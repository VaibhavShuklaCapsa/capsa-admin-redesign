import { ErrorHandler } from "../factories/errorHandler";
import { routes } from "./apiRoutes";
import HttpService from "./httpService";
import useMutateItem from "./useMutateItem";
import { checkApiResponse, handleApiError } from "./responseHandler";

const httpService = new HttpService();

// Common onboarding hooks
export const useGetRFVendor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      // Using postDataWithoutToken since this seems to be an onboarding endpoint
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.GetRFVendor()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/getRFVendor');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    getRFVendorAsync: mutateAsync,
    getRFVendorIsLoading: isLoading,
    getRFVendorError: errorMessage,
    getRFVendorData: data
  };
};

export const useGetAllAnchors = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      // Using postDataWithoutToken since this seems to be an onboarding endpoint
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.GetAllAnchors()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/getAllAnchors');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    getAllAnchorsAsync: mutateAsync,
    getAllAnchorsIsLoading: isLoading,
    getAllAnchorsError: errorMessage,
    getAllAnchorsData: data
  };
};

export const useSaveAnchors = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      // Using postDataWithoutToken since this seems to be an onboarding endpoint
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.SaveAnchors()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/saveAnchors');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    saveAnchorsAsync: mutateAsync,
    saveAnchorsIsLoading: isLoading,
    saveAnchorsError: errorMessage,
    saveAnchorsData: data
  };
};

export const useCheckBlockedPassword = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.CheckBlockedPassword()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signin/checkBlockedPassword');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    checkBlockedPasswordAsync: mutateAsync,
    checkBlockedPasswordIsLoading: isLoading,
    checkBlockedPasswordError: errorMessage,
    checkBlockedPasswordData: data
  };
};

export const useCommonSubmitData = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.SubmitData()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/submitData');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    commonSubmitDataAsync: mutateAsync,
    commonSubmitDataIsLoading: isLoading,
    commonSubmitDataError: errorMessage,
    commonSubmitDataData: data
  };
};

export const useSendOTP = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.SendOTP()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/sendOTP');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    sendOTPAsync: mutateAsync,
    sendOTPIsLoading: isLoading,
    sendOTPError: errorMessage,
    sendOTPData: data
  };
};

export const useVerifyOTP = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.VerifyOTP()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/verifyOtp');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    verifyOTPAsync: mutateAsync,
    verifyOTPIsLoading: isLoading,
    verifyOTPError: errorMessage,
    verifyOTPData: data
  };
};

export const useSubmitAPI = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      // Prepare the login credentials - NO ENCRYPTION NEEDED
      const loginCredentials = {
        emailid: payload.email,
        password: payload.password,  // Password should already be handled by the API
        device: payload.device || "web",
        location: payload.location || "IP location data",
        uniqueId: payload.uniqueId || ""
      };

      console.log("=== SUBMIT API CALL ===");
      console.log("Sending unencrypted payload to /signin/submit:", loginCredentials);
      
      // Call the API directly with unencrypted payload
      const res = await httpService.postDataWithoutToken(
        loginCredentials,
        routes.Submit()
      );
      
      console.log("Raw response from submit API:", res);
      console.log("Response data:", res?.data);
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        console.log("Response appears to be encrypted, attempting decryption...");
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/signin/submit');
          console.log("Decrypted response:", decryptedResponse);
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
              console.log("Parsed decrypted JSON:", processedData);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      } else {
        console.log("Response is not encrypted or is already parsed");
      }
      
      console.log("Final processed data for submit API:", processedData);
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      console.log("Response check result:", responseCheck);
      if (!responseCheck.isSuccess) {
        console.error("Submit API failed:", responseCheck.message);
        throw new Error(responseCheck.message);
      }
      
      // Extract the actual user data from the response
      // The response contains token, data (JWT), and active fields
      let finalUserData = responseCheck.data;
      
      if (responseCheck.data && typeof responseCheck.data === 'object') {
        // Get the JWT token from the 'data' field
        const jwtToken = responseCheck.data.data;
        
        if (jwtToken && typeof jwtToken === 'string') {
          try {
            // Decode JWT token without verifying signature (for client-side)
            const jwtParts = jwtToken.split('.');
            if (jwtParts.length === 3) {
              const header = JSON.parse(atob(jwtParts[0]));
              const payload = JSON.parse(atob(jwtParts[1]));
              
              console.log("JWT Header:", header);
              console.log("JWT Payload:", payload);
              
              // If the payload contains an encrypted data field (encdata), decrypt it
              if (payload.encdata) {
                // Import crypto-js for decryption
                const CryptoJS = await import('crypto-js');
                
                // Use the email from the original request payload as the secret key
                // since it might not be available in the JWT payload itself
                const email = payload.email || payload.Email || payload.emial || payload.panNumber || loginCredentials.emailid || 'band@mailinator.com';
                
                console.log("Using email as secret key for decryption:", email);
                
                // Decrypt the encdata using the email as the secret key
                const decryptedBytes = CryptoJS.AES.decrypt(payload.encdata, email);
                const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
                
                if (decryptedData) {
                  try {
                    const parsedDecryptedData = JSON.parse(decryptedData);
                    console.log("Decrypted user profile data from JWT encdata:", parsedDecryptedData);
                    
                    // Merge the decrypted data with other response data
                    finalUserData = {
                      ...responseCheck.data,
                      data: parsedDecryptedData
                    };
                  } catch (parseError) {
                    console.error("Failed to parse decrypted data as JSON:", parseError);
                    // If JSON parsing fails, use the decrypted string as-is
                    finalUserData = {
                      ...responseCheck.data,
                      data: decryptedData
                    };
                  }
                } else {
                  console.log("Could not decrypt encdata from JWT payload, trying alternative approach...");
                  // Try alternative decryption approach with different secret keys
                  const alternativeSecretKeys = [
                    loginCredentials.emailid,
                    payload.email || payload.Email || payload.emial || payload.panNumber,
                    'band@mailinator.com',
                    'secret',
                    'mySecretKey'
                  ];
                  
                  let decryptedSuccessfully = false;
                  
                  for (const secretKey of alternativeSecretKeys) {
                    if (secretKey && secretKey !== 'band@mailinator.com') { // Skip default if we already tried it
                      try {
                        const decryptedBytesAlt = CryptoJS.AES.decrypt(payload.encdata, secretKey);
                        const decryptedDataAlt = decryptedBytesAlt.toString(CryptoJS.enc.Utf8);
                        
                        if (decryptedDataAlt && decryptedDataAlt.trim() !== '') {
                          try {
                            const parsedDecryptedDataAlt = JSON.parse(decryptedDataAlt);
                            console.log("Alternative decryption successful with key:", secretKey);
                            console.log("Decrypted user profile data:", parsedDecryptedDataAlt);
                            
                            // Merge the decrypted data with other response data
                            finalUserData = {
                              ...responseCheck.data,
                              data: parsedDecryptedDataAlt
                            };
                            decryptedSuccessfully = true;
                            break;
                          } catch (parseError) {
                            // If JSON parsing fails, try the next secret key
                            continue;
                          }
                        }
                      } catch (altDecryptError) {
                        // Continue to next secret key if decryption fails
                        continue;
                      }
                    }
                  }
                  
                  if (!decryptedSuccessfully) {
                    console.log("Could not decrypt encdata from JWT payload with any secret key");
                    finalUserData = {
                      ...responseCheck.data,
                      data: payload
                    };
                  }
                }
              } else {
                console.log("JWT payload does not contain encdata, using payload as-is:", payload);
                finalUserData = {
                  ...responseCheck.data,
                  data: payload
                };
              }
            } else {
              console.log("Data field is not a JWT token, using as-is");
              finalUserData = responseCheck.data;
            }
          } catch (jwtError) {
            console.error('Failed to decode JWT or decrypt user profile data:', jwtError);
            // If JWT decoding fails, use the original data
            finalUserData = responseCheck.data;
          }
        }
      }
      
      console.log("=== SUBMIT API SUCCESS ===");
      console.log("Returning final user data:", finalUserData);
      
      return finalUserData;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    submitAPIAsync: mutateAsync,
    submitAPIIsLoading: isLoading,
    submitAPIError: errorMessage,
    submitAPIData: data
  };
};

// Vendor-specific hooks
export const useGetDirectorByRc = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.GetDirectorByRc()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/get_directorByRc');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    getDirectorByRcAsync: mutateAsync,
    getDirectorByRcIsLoading: isLoading,
    getDirectorByRcError: errorMessage,
    getDirectorByRcData: data
  };
};

export const useVendorSaveDetails1 = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (formData) => {
      // For multipart form data (file uploads), we need to handle differently
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.SaveDetails1()}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      // Handle potential decryption if needed
      // This assumes the same encryption pattern as in onboarding pages
      let parsedData;
      try {
        // Try to decrypt the response if it's encrypted
        if (text && typeof text === 'string' && text.length > 0) {
          const { decryptPayloadConditional } = await import('./encryptionService');
          try {
            const decryptedResponse = await decryptPayloadConditional(text, '/redesign/signup/savedetails1');
            if (decryptedResponse && decryptedResponse.trim() !== '') {
              // Try to parse the decrypted response as JSON
              try {
                parsedData = JSON.parse(decryptedResponse);
              } catch (parseError) {
                console.error('Failed to parse decrypted response:', parseError);
                // If parsing fails, return raw text
                parsedData = text;
              }
            } else {
              // If decryption returns empty, use original text
              parsedData = text;
            }
          } catch (decryptError) {
            console.error('Decryption failed:', decryptError);
            // If decryption fails, try to parse original text as JSON
            try {
              parsedData = JSON.parse(text);
            } catch {
              // If direct parsing fails, return raw text
              parsedData = text;
            }
          }
        } else {
          // If text is not a string or is empty, try to parse as JSON
          try {
            parsedData = JSON.parse(text);
          } catch {
            // If direct parsing fails, return raw text
            parsedData = text;
          }
        }
      } catch {
        // If any error occurs, return raw text
        parsedData = text;
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(parsedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    vendorSaveDetails1Async: mutateAsync,
    vendorSaveDetails1IsLoading: isLoading,
    vendorSaveDetails1Error: errorMessage,
    vendorSaveDetails1Data: data
  };
};

export const useVendorSaveDetails2 = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (formData) => {
      // For multipart form data (file uploads), we need to handle differently
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.SaveDetails2()}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      // Handle potential decryption if needed
      // This assumes the same encryption pattern as in onboarding pages
      let parsedData;
      try {
        // Try to decrypt the response if it's encrypted
        if (text && typeof text === 'string' && text.length > 0) {
          const { decryptPayloadConditional } = await import('./encryptionService');
          try {
            const decryptedResponse = await decryptPayloadConditional(text, '/redesign/signup/savedetails2');
            if (decryptedResponse && decryptedResponse.trim() !== '') {
              // Try to parse the decrypted response as JSON
              try {
                parsedData = JSON.parse(decryptedResponse);
              } catch (parseError) {
                console.error('Failed to parse decrypted response:', parseError);
                // If parsing fails, return raw text
                parsedData = text;
              }
            } else {
              // If decryption returns empty, use original text
              parsedData = text;
            }
          } catch (decryptError) {
            console.error('Decryption failed:', decryptError);
            // If decryption fails, try to parse original text as JSON
            try {
              parsedData = JSON.parse(text);
            } catch {
              // If direct parsing fails, return raw text
              parsedData = text;
            }
          }
        } else {
          // If text is not a string or is empty, try to parse as JSON
          try {
            parsedData = JSON.parse(text);
          } catch {
            // If direct parsing fails, return raw text
            parsedData = text;
          }
        }
      } catch {
        // If any error occurs, return raw text
        parsedData = text;
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(parsedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    vendorSaveDetails2Async: mutateAsync,
    vendorSaveDetails2IsLoading: isLoading,
    vendorSaveDetails2Error: errorMessage,
    vendorSaveDetails2Data: data
  };
};

export const useVendorSubmitData = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.VendorSubmitData()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/vendorSubmitData');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    vendorSubmitDataAsync: mutateAsync,
    vendorSubmitDataIsLoading: isLoading,
    vendorSubmitDataError: errorMessage,
    vendorSubmitDataData: data
  };
};

export const useVendorSaveDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (formData) => {
      // For multipart form data (file uploads), we need to handle differently
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.SaveDetails2()}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      // Handle potential decryption if needed
      // This assumes the same encryption pattern as in onboarding pages
      let parsedData;
      try {
        // Try to decrypt the response if it's encrypted
        if (text && typeof text === 'string' && text.length > 0) {
          const { decryptPayloadConditional } = await import('./encryptionService');
          try {
            const decryptedResponse = await decryptPayloadConditional(text, '/redesign/signup/savedetails2');
            if (decryptedResponse && decryptedResponse.trim() !== '') {
              // Try to parse the decrypted response as JSON
              try {
                parsedData = JSON.parse(decryptedResponse);
              } catch (parseError) {
                console.error('Failed to parse decrypted response:', parseError);
                // If parsing fails, return raw text
                parsedData = text;
              }
            } else {
              // If decryption returns empty, use original text
              parsedData = text;
            }
          } catch (decryptError) {
            console.error('Decryption failed:', decryptError);
            // If decryption fails, try to parse original text as JSON
            try {
              parsedData = JSON.parse(text);
            } catch {
              // If direct parsing fails, return raw text
              parsedData = text;
            }
          }
        } else {
          // If text is not a string or is empty, try to parse as JSON
          try {
            parsedData = JSON.parse(text);
          } catch {
            // If direct parsing fails, return raw text
            parsedData = text;
          }
        }
      } catch {
        // If any error occurs, return raw text
        parsedData = text;
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(parsedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    vendorSaveDetailsAsync: mutateAsync,
    vendorSaveDetailsIsLoading: isLoading,
    vendorSaveDetailsError: errorMessage,
    vendorSaveDetailsData: data
  };
};

// Investor-specific hooks
export const useInvestorSubmitData = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.InvestorSubmitData()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/investorSubmitData');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    investorSubmitDataAsync: mutateAsync,
    investorSubmitDataIsLoading: isLoading,
    investorSubmitDataError: errorMessage,
    investorSubmitDataData: data
  };
};

export const useInvestorSaveDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postDataWithoutToken(
        payload,
        routes.InvestorSaveDetails()
      );
      
      // Check if response is encrypted (string) and needs decryption
      let processedData = res?.data;
      if (typeof processedData === 'string' && processedData.length > 0) {
        // Import and use the decrypt service for encrypted responses
        const { decryptPayloadConditional } = await import('./encryptionService');
        try {
          const decryptedResponse = await decryptPayloadConditional(processedData, '/redesign/signup/investorSaveDetails');
          if (decryptedResponse && decryptedResponse.trim() !== '') {
            // Try to parse the decrypted response as JSON
            try {
              processedData = JSON.parse(decryptedResponse);
            } catch (parseError) {
              console.error('Failed to parse decrypted response:', parseError);
              // If parsing fails, return the original data
              processedData = res?.data;
            }
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // If decryption fails, return the original data
          processedData = res?.data;
        }
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(processedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    investorSaveDetailsAsync: mutateAsync,
    investorSaveDetailsIsLoading: isLoading,
    investorSaveDetailsError: errorMessage,
    investorSaveDetailsData: data
  };
};

// Investor save details 3 hook for personal investor
export const useInvestorSaveDetails3 = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (formData) => {
      // For multipart form data (file uploads), we need to handle differently
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.SaveDetails3()}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      // Handle potential decryption if needed
      // This assumes the same encryption pattern as in onboarding pages
      let parsedData;
      try {
        // Try to decrypt the response if it's encrypted
        if (text && typeof text === 'string' && text.length > 0) {
          const { decryptPayloadConditional } = await import('./encryptionService');
          try {
            const decryptedResponse = await decryptPayloadConditional(text, '/redesign/signup/savedetails3');
            if (decryptedResponse && decryptedResponse.trim() !== '') {
              // Try to parse the decrypted response as JSON
              try {
                parsedData = JSON.parse(decryptedResponse);
              } catch (parseError) {
                console.error('Failed to parse decrypted response:', parseError);
                // If parsing fails, return raw text
                parsedData = text;
              }
            } else {
              // If decryption returns empty, use original text
              parsedData = text;
            }
          } catch (decryptError) {
            console.error('Decryption failed:', decryptError);
            // If decryption fails, try to parse original text as JSON
            try {
              parsedData = JSON.parse(text);
            } catch {
              // If direct parsing fails, return raw text
              parsedData = text;
            }
          }
        } else {
          // If text is not a string or is empty, try to parse as JSON
          try {
            parsedData = JSON.parse(text);
          } catch {
            // If direct parsing fails, return raw text
            parsedData = text;
          }
        }
      } catch {
        // If any error occurs, return raw text
        parsedData = text;
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(parsedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    investorSaveDetails3Async: mutateAsync,
    investorSaveDetails3IsLoading: isLoading,
    investorSaveDetails3Error: errorMessage,
    investorSaveDetails3Data: data
  };
};

// Update address hook for investor onboarding
export const useUpdateAddress = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (formData) => {
      // For multipart form data (file uploads), we need to handle differently
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.UpdateAddress()}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      // Handle potential decryption if needed
      // This assumes the same encryption pattern as in onboarding pages
      let parsedData;
      try {
        // Try to decrypt the response if it's encrypted
        if (text && typeof text === 'string' && text.length > 0) {
          const { decryptPayloadConditional } = await import('./encryptionService');
          try {
            const decryptedResponse = await decryptPayloadConditional(text, '/redesign/signup/updateAddress');
            if (decryptedResponse && decryptedResponse.trim() !== '') {
              // Try to parse the decrypted response as JSON
              try {
                parsedData = JSON.parse(decryptedResponse);
              } catch (parseError) {
                console.error('Failed to parse decrypted response:', parseError);
                // If parsing fails, return raw text
                parsedData = text;
              }
            } else {
              // If decryption returns empty, use original text
              parsedData = text;
            }
          } catch (decryptError) {
            console.error('Decryption failed:', decryptError);
            // If decryption fails, try to parse original text as JSON
            try {
              parsedData = JSON.parse(text);
            } catch {
              // If direct parsing fails, return raw text
              parsedData = text;
            }
          }
        } else {
          // If text is not a string or is empty, try to parse as JSON
          try {
            parsedData = JSON.parse(text);
          } catch {
            // If direct parsing fails, return raw text
            parsedData = text;
          }
        }
      } catch {
        // If any error occurs, return raw text
        parsedData = text;
      }
      
      // Check API response using standardized format
      const responseCheck = checkApiResponse(parsedData);
      if (!responseCheck.isSuccess) {
        throw new Error(responseCheck.message);
      }
      
      return responseCheck.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  
  const errorMessage = ErrorHandler(error);

  return {
    updateAddressAsync: mutateAsync,
    updateAddressIsLoading: isLoading,
    updateAddressError: errorMessage,
    updateAddressData: data
  };
};