import { ErrorHandler } from "../factories/errorHandler";
import { routes } from "./apiRoutes";
import HttpService from "./httpService";
import useMutateItem from "./useMutateItem";
import Storage from "../utils/storageUtil";
import { decodeToken, getAccessToken, getAccessTokenData, parseData } from "../utils";
import { QueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const httpService = new HttpService();
const queryClient = new QueryClient();

export const useLogin = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("===  LOGIN API CALL STARTED ===");
      console.log(" Input Payload:", JSON.stringify(payload, null, 2));

      const result = await httpService.postDataWithoutToken(
        payload,
        routes.Login()
      );

      console.log(" Raw API Response:", JSON.stringify(result, null, 2));
      console.log(" Response data field:", result?.data?.data);

      if (result?.data?.res !== "failed" && result?.data?.status !== "failed") {
        // Store the complete auth data
        Storage.setObject("auth", result?.data?.data);
        console.log(" Stored auth data in SessionStorage : ", result?.data?.data);

        // COMPREHENSIVE LOGGING OF ALL STORED DATA
        const storedAuth = Storage.getObject("auth");
        console.log("\n===  STORED AUTH DATA ===");
        console.log(JSON.stringify(storedAuth, null, 2));

        // NEW LOGIC: Try to decrypt the 'data' field first (inner JWT)
        // If that fails, fall back to decrypting the 'token' field
        let tokenToDecrypt = null;
        let tokenSource = "";

        if (storedAuth?.data) {
          // Prefer the inner 'data' JWT token
          tokenToDecrypt = storedAuth.data;
          tokenSource = "data field (inner JWT)";
        } else if (storedAuth?.token) {
          // Fallback to 'token' field
          tokenToDecrypt = storedAuth.token;
          tokenSource = "token field";
        }

        if (tokenToDecrypt) {
          console.log("\n===  ATTEMPTING DECRYPTION FROM:", tokenSource.toUpperCase(), "===");

          try {
            const tokenParts = tokenToDecrypt.split('.');
            if (tokenParts.length === 3) {
              const header = JSON.parse(atob(tokenParts[0]));
              const jwtPayload = JSON.parse(atob(tokenParts[1]));

              console.log("\n===  JWT HEADER ===");
              console.log(JSON.stringify(header, null, 2));

              console.log("\n===  JWT PAYLOAD (Before Decryption) ===");
              console.log(JSON.stringify(jwtPayload, null, 2));

              // If encdata exists, decrypt it
              if (jwtPayload.encdata) {
                console.log("\n===  ENCRYPTED DATA (encdata) ===");
                console.log("Encrypted data length:", jwtPayload.encdata.length);
                console.log("Encrypted data preview:", jwtPayload.encdata.substring(0, 100) + "...");

                // TRY TO DECRYPT IT using dynamic import
                console.log("\n===  ATTEMPTING IMMEDIATE DECRYPTION ===");
                const email = Storage.getObject("email") || '';
                console.log("Using secret key:", email);

                // Use dynamic import for crypto-js
                import('crypto-js').then((CryptoJS) => {
                  try {
                    const decryptedBytes = CryptoJS.default.AES.decrypt(jwtPayload.encdata, email);
                    const decryptedData = decryptedBytes.toString(CryptoJS.default.enc.Utf8);

                    if (decryptedData && decryptedData.trim() !== '') {
                      try {
                        const parsedDecryptedData = JSON.parse(decryptedData);

                        // ═══════════════════════════════════════════════════════════
                        // 🎉 COMPLETE DECRYPTED USER DATA - PRINT CONSOLE TABLE
                        // ═══════════════════════════════════════════════════════════
                        console.log("\n\n" + "=".repeat(80));
                        console.log("🎉 LOGIN SUCCESSFUL - COMPLETE DECRYPTED USER PROFILE");
                        console.log("=".repeat(80));

                        // Create a clean table of all fields
                        const tableData = {};
                        Object.entries(parsedDecryptedData).forEach(([key, value]) => {
                          tableData[key] = typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
                        });

                        console.table(tableData);

                        // Also print as structured JSON for easy copying
                        console.log("\n📋 COPY-FRIENDLY JSON FORMAT:");
                        console.log("-".repeat(80));
                        console.log(JSON.stringify(parsedDecryptedData, null, 2));
                        console.log("-".repeat(80));

                        // Print summary
                        console.log("\n📊 SUMMARY:");
                        console.log(`   Total Fields: ${Object.keys(parsedDecryptedData).length}`);
                        console.log(`   Email: ${parsedDecryptedData?.email || 'N/A'}`);
                        console.log(`   Name: ${parsedDecryptedData?.name || 'N/A'}`);
                        console.log(`   PAN Number: ${parsedDecryptedData?.panNumber || 'N/A'}`);
                        console.log(`   Role: ${parsedDecryptedData?.role || 'N/A'}`);
                        console.log(`   Company: ${parsedDecryptedData?.companyName || 'N/A'}`);
                        console.log("=".repeat(80) + "\n\n");

                      } catch (parseError) {
                        console.log("⚠️ Decrypted but not valid JSON:", decryptedData);
                      }
                    } else {
                      console.log(" Decryption returned empty string");
                    }
                  } catch (decryptError) {
                    console.error("Decryption failed:", decryptError.message);
                  }
                }).catch((err) => {
                  console.error(" Failed to load crypto-js:", err);
                });
              }
            }
          } catch (e) {
            console.log("Could not parse JWT token:", e.message);
          }
        } else {
          console.log("\n⚠️ No token or data field found in auth storage!");
        }

        // Log refresh token if exists
        if (storedAuth?.refreshToken) {
          console.log("\n=== 🔄 REFRESH TOKEN ===");
          console.log("Length:", storedAuth.refreshToken.length);
          console.log("Preview:", storedAuth.refreshToken.substring(0, 50) + "...");
        }

        console.log("\n=== ✅ LOGIN SUCCESS ===\n");
        return result;
      }

      console.log("\n=== ❌ LOGIN FAILED ===\n");
      return result;
    },
    onSuccess: (res) => {
      console.log("=== 🎉 LOGIN onSuccess CALLBACK ===");
      console.log("Response:", res);
      handleSuccess?.(res);
    }
  });

  return {
    loginAsync: mutateAsync,
    loginIsLoading: isLoading,
    loginError: error?.response?.data?.message
  };
};

export const getProfileFromToken = () => {
  let token = getTokenData();
  if (token) {
    let profile = decodeToken(token, Storage.getObject("email"));
    console.log("Profile data role:", profile.role);
    // console.log("what is wrong with profile: ", profile)
    return {
      email: profile?.email?.trim() ?? profile?.Email?.trim() ?? "",
      panNumber: profile?.panNumber ?? "",
      role: profile?.role?.trim() ?? "",
      name: profile?.name?.trim() ?? "",
      usercac: profile?.usercac ?? "",
      isSubAdmin: profile?.isSubAdmin ?? "",
      // accounts: profile?.accounts ?? [],
      // bvnNo: profile?.bvn_verified ?? ""

    };

  } else return {};
};

/**
 * COMPREHENSIVE: Get FULL decrypted user profile with ALL fields
 * This will decrypt and return EVERY field from the JWT payload
 */
export const getFullUserProfile = async () => {
  console.log("\n=== 🔍 FETCHING FULL USER PROFILE ===");

  try {
    const authData = Storage.getObject("auth");

    if (!authData) {
      console.log("❌ No auth data found in storage");
      return null;
    }

    // NEW LOGIC: Try to decrypt the 'data' field first (inner JWT)
    // If that fails, fall back to decrypting the 'token' field
    let tokenToDecrypt = null;
    let tokenSource = "";

    if (authData?.data) {
      // Prefer the inner 'data' JWT token
      tokenToDecrypt = authData.data;
      tokenSource = "data field (inner JWT)";
    } else if (authData?.token) {
      // Fallback to 'token' field
      tokenToDecrypt = authData.token;
      tokenSource = "token field";
    }

    if (!tokenToDecrypt) {
      console.log("❌ No token or data field found in auth storage");
      return null;
    }

    console.log("🔑 Attempting to decrypt from:", tokenSource.toUpperCase());

    // Split JWT token
    const tokenParts = tokenToDecrypt.split('.');
    if (tokenParts.length !== 3) {
      console.log("❌ Invalid JWT token structure");
      return null;
    }

    // Parse header and payload
    const header = JSON.parse(atob(tokenParts[0]));
    const jwtPayload = JSON.parse(atob(tokenParts[1]));

    console.log("✅ JWT Header parsed successfully");
    console.log("✅ JWT Payload has", Object.keys(jwtPayload).length, "fields");

    // Check if there's encrypted data
    if (jwtPayload.encdata) {
      console.log("🔒 Token contains encrypted encdata - attempting decryption...");

      // Import crypto-js dynamically
      const CryptoJS = await import('crypto-js');

      // Try different possible secret keys
      const possibleSecrets = [
        Storage.getObject("email"),  // Email used for login
        jwtPayload.email,
        jwtPayload.Email,
        jwtPayload.emial,
        jwtPayload.panNumber,
        'band@mailinator.com',  // Default fallback
      ].filter(Boolean);

      console.log("🔑 Trying", possibleSecrets.length, "possible secret keys...");

      for (const secretKey of possibleSecrets) {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(jwtPayload.encdata, secretKey);
          const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

          if (decryptedData && decryptedData.trim() !== '') {
            try {
              const parsedDecryptedData = JSON.parse(decryptedData);

              // ═══════════════════════════════════════════════════════════
              // 🎉 COMPLETE DECRYPTED USER DATA - PRINT CONSOLE TABLE
              // ═══════════════════════════════════════════════════════════
              console.log("\n\n" + "=".repeat(80));
              console.log("🎉 GET FULL USER PROFILE - COMPLETE DECRYPTED DATA");
              console.log("=".repeat(80));

              // Create a clean table of all fields
              const tableData = {};
              Object.entries(parsedDecryptedData).forEach(([key, value]) => {
                tableData[key] = typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
              });

              console.table(tableData);

              // Also print as structured JSON for easy copying
              console.log("\n📋 COPY-FRIENDLY JSON FORMAT:");
              console.log("-".repeat(80));
              console.log(JSON.stringify(parsedDecryptedData, null, 2));
              console.log("-".repeat(80));

              // Print summary
              console.log("\n📊 SUMMARY:");
              console.log(`   Total Fields: ${Object.keys(parsedDecryptedData).length}`);
              console.log(`   Email: ${parsedDecryptedData?.email || 'N/A'}`);
              console.log(`   Name: ${parsedDecryptedData?.name || 'N/A'}`);
              console.log(`   PAN Number: ${parsedDecryptedData?.panNumber || 'N/A'}`);
              console.log(`   Role: ${parsedDecryptedData?.role || 'N/A'}`);
              console.log(`   Company: ${parsedDecryptedData?.companyName || 'N/A'}`);
              console.log("=".repeat(80) + "\n\n");

              return {
                ...parsedDecryptedData,
                _jwtHeader: header,
                _jwtPayload: jwtPayload
              };
            } catch (parseError) {
              console.log("⚠️ Decrypted but not JSON:", decryptedData);
              continue;
            }
          }
        } catch (decryptError) {
          console.log(`⚠️ Failed with key "${secretKey}":`, decryptError.message);
          continue;
        }
      }

      console.log("❌ Could not decrypt encdata with any key");
      return { ...jwtPayload, _decryptionFailed: true };
    } else {
      console.log("ℹ️ No encdata in JWT - using payload as-is");
      console.log("\n=== 📝 JWT PAYLOAD DATA ===");
      console.log(JSON.stringify(jwtPayload, null, 2));
      return jwtPayload;
    }
  } catch (error) {
    console.error("❌ Error fetching full profile:", error);
    return null;
  }
};

export const getToken = () => {
  const token = getAccessToken();
  const AuthStr = "Bearer ".concat(token);
  return token ? AuthStr : null;
};

export const getTokenData = () => {
  const token = getAccessTokenData();
  //   const AuthStr = "Bearer ".concat(token);
  return token
};

const clearAndRedirect = () => {
  console.log("clearAndRedirect");
  Storage.clear();
  queryClient.clear();
  window.location.href = `${window.location.origin}`
};

export const logOut = async (skipLogoutCall = false) => {
  console.log("logOut skipLogoutCall", skipLogoutCall);
  try {
    if (!skipLogoutCall) {
      const authObj = parseData(getAuthModel());
      const refreshToken = authObj?.refreshToken;
      await httpService.postData({ refreshToken }, routes.LogOut());
    }
    clearAndRedirect();
  } catch (err) {
    clearAndRedirect();
  }
};

export const getAuthModel = () => {
  return Storage.get("auth");
};
export const isLoggedIn = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      // Checking if token is expired. N
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
};

export const refreshToken = async () => {
  if (isLoggedIn()) {
    try {
      const authObj = parseData(getAuthModel());

      const result = await httpService.postDataWithoutToken(
        { refreshToken: authObj?.refreshToken },
        routes.RefreshToken()
      );
      Storage.setObject("auth", result?.data?.result);
      return "success";
    } catch (err) {
      if (_authObj?.token && _authObj?.refreshToken) {
        Storage.setObject("auth", { ..._authObj, expires_in: 360000 });
        return "move";
      } else {
        throw new Error(ErrorHandler(err));
      }
    }
  }
};

export const isTokenValid = async () => {
  if (isLoggedIn()) {
    try {
      if (
        window.location.origin?.includes("localhost") ||
        window.location.origin?.includes("qa.azurewebsites")
      ) {
        return "success";
      }
      const res = await httpService.postData(
        {},
        routes.IsTokenValid(),
        "DIGITAL_URL"
      );
      if (res?.data?.result) {
        return "success";
      } else {
        logOut(true);
      }
    } catch (err) {
      throw new Error(ErrorHandler(err));
    }
  }
};

// Anchor Dashboard API
export const useGetAnchorDashboard = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("ANCHOR DASHBOARD API CALL - Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        routes.AnchorDashboard()
      );
      console.log("ANCHOR DASHBOARD API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data?.data;
    },
    onSuccess: (res) => {
      console.log("ANCHOR DASHBOARD API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    anchorDashboardAsync: mutateAsync,
    anchorDashboardIsLoading: isLoading,
    anchorDashboardError: errorMessage,
    anchorDashboardData: data
  };
};

// Payment Upcoming Today API
export const useGetUpcomingPayments = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("PAYMENT UPCOMING TODAY API CALL - Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        routes.PaymentUpcomingToday()
      );
      console.log("PAYMENT UPCOMING TODAY API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("PAYMENT UPCOMING TODAY API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    upcomingPaymentsAsync: mutateAsync,
    upcomingPaymentsIsLoading: isLoading,
    upcomingPaymentsError: errorMessage,
    upcomingPaymentsData: data
  };
};

// Payment Paid (Completed) API
export const useGetCompletedPayments = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("PAYMENT PAID API CALL - Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        routes.PaymentPaid()
      );
      console.log("PAYMENT PAID API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("PAYMENT PAID API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    completedPaymentsAsync: mutateAsync,
    completedPaymentsIsLoading: isLoading,
    completedPaymentsError: errorMessage,
    completedPaymentsData: data
  };
};

// Upcoming Payments - Time Bucket API (Dynamic endpoint)
export const useGetUpcomingTimeBucketPayments = (endpointFunction, handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("UPCOMING TIME BUCKET API CALL - Endpoint:", endpointFunction());
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        endpointFunction()
      );
      console.log("UPCOMING TIME BUCKET API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("UPCOMING TIME BUCKET API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    upcomingTimeBucketAsync: mutateAsync,
    upcomingTimeBucketIsLoading: isLoading,
    upcomingTimeBucketError: errorMessage,
    upcomingTimeBucketData: data
  };
};

// Investor Upcoming Invoices API
export const useGetInvestorUpcomingInvoices = (endpointFunction, handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("INVESTOR UPCOMING INVOICES API CALL - endpoint:", endpointFunction());
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        endpointFunction()
      );
      console.log("INVESTOR UPCOMING INVOICES API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("INVESTOR UPCOMING INVOICES API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    investorUpcomingInvoicesAsync: mutateAsync,
    investorUpcomingInvoicesIsLoading: isLoading,
    investorUpcomingInvoicesError: errorMessage,
    investorUpcomingInvoicesData: data
  };
};

// Vendor Invite List API
export const useGetVendorInviteList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("VENDOR INVITE LIST API CALL");
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        routes.VendorInviteList()
      );
      console.log("VENDOR INVITE LIST API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("VENDOR INVITE LIST API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    vendorInviteListAsync: mutateAsync,
    vendorInviteListIsLoading: isLoading,
    vendorInviteListError: errorMessage,
    vendorInviteListData: data
  };
};

// Send Vendor Invite API
export const useSendVendorInvite = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("SEND VENDOR INVITE API CALL");
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const res = await httpService.postData(
        payload,
        routes.SendVendorInvite()
      );
      console.log("SEND VENDOR INVITE API RESPONSE:", JSON.stringify(res?.data, null, 2));
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("SEND VENDOR INVITE API CALLBACK - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    sendVendorInviteAsync: mutateAsync,
    sendVendorInviteIsLoading: isLoading,
    sendVendorInviteError: errorMessage,
    sendVendorInviteData: data
  };
};
