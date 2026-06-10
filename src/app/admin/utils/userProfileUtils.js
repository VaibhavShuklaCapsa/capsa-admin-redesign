import Storage from './storageUtil';

/**
 * Get ALL decrypted user profile data
 * @returns {Promise<Object>} Complete user profile with all fields
 */
export const getAllUserData = async () => {
  try {
    const authData = Storage.getObject('auth');
    
    if (!authData) {
      console.error('❌ No auth data found');
      return null;
    }

    // Try 'data' field first (new API), then 'token' field (old API)
    let tokenToDecrypt = authData.data || authData.token;
    
    if (!tokenToDecrypt) {
      console.error('❌ No token found in auth data');
      return null;
    }

    const tokenParts = tokenToDecrypt.split('.');
    if (tokenParts.length !== 3) {
      console.error('❌ Invalid JWT structure');
      return null;
    }

    const jwtPayload = JSON.parse(atob(tokenParts[1]));
    
    if (!jwtPayload.encdata) {
      console.warn('⚠️ No encdata in JWT');
      return jwtPayload;
    }

    // Import crypto-js
    const CryptoJS = await import('crypto-js');
    const email = Storage.getObject('email') || '';
    
    const decryptedBytes = CryptoJS.AES.decrypt(jwtPayload.encdata, email);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData || decryptedData.trim() === '') {
      console.error('❌ Decryption failed');
      return null;
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return null;
  }
};

/**
 * Get specific user field
 * @param {string} fieldName - Field name (e.g., 'email', 'panNumber', 'companyName')
 * @returns {Promise<any>} Field value
 */
export const getUserField = async (fieldName) => {
  const profile = await getAllUserData();
  return profile?.[fieldName];
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check ('VENDOR', 'INVESTOR', 'BUYER/ANCHOR')
 * @returns {Promise<boolean>}
 */
export const hasRole = async (role) => {
  const profile = await getAllUserData();
  
  if (!profile?.role) return false;
  
  // Handle role variations
  const userRole = profile.role.toUpperCase();
  const checkRole = role.toUpperCase();
  
  if (checkRole === 'ANCHOR' && userRole === 'BUYER') return true;
  if (checkRole === 'BUYER' && userRole === 'ANCHOR') return true;
  
  return userRole === checkRole;
};

/**
 * Get company/business related fields
 * @returns {Promise<Object>} Company data
 */
export const getCompanyData = async () => {
  const profile = await getAllUserData();
  
  if (!profile) return null;
  
  return {
    companyName: profile.companyName,
    companyType: profile.companyType,
    gstNumber: profile.gstNumber,
    udyamNumber: profile.udyamNumber,
    cacNumber: profile.usercac,
    // Add more as needed
  };
};

/**
 * Get contact information
 * @returns {Promise<Object>} Contact data
 */
export const getContactData = async () => {
  const profile = await getAllUserData();
  
  if (!profile) return null;
  
  return {
    email: profile.email,
    phone: profile.contact || profile.phone,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    pincode: profile.pincode,
  };
};

/**
 * Get banking information
 * @returns {Promise<Object>} Bank data
 */
export const getBankData = async () => {
  const profile = await getAllUserData();
  
  if (!profile) return null;
  
  return {
    accountNumber: profile.accountNumber,
    ifscCode: profile.ifscCode,
    bankName: profile.bankName,
    branchName: profile.branchName,
    accountType: profile.accountType,
  };
};

/**
 * Get KYC and verification status
 * @returns {Promise<Object>} KYC data
 */
export const getKYCData = async () => {
  const profile = await getAllUserData();
  
  if (!profile) return null;
  
  return {
    kyc: profile.kyc,
    kycStatus: profile.KYC_DATA_VALID,
    bvnVerified: profile.bvn_verified,
    isActive: profile.active,
    isBlacklisted: profile.isBlacklisted,
    MFA: profile.MFA,
  };
};

/**
 * Get admin/sub-admin details
 * @returns {Promise<Object>} Admin data
 */
export const getAdminData = async () => {
  const profile = await getAllUserData();
  
  if (!profile) return null;
  
  return {
    isSubAdmin: profile.isSubAdmin?.isSubAdmin,
    subAdminEmail: profile.sub_admin_email,
    adminEmail: profile.admin_email,
    subAdminDetails: profile.sub_admin_details,
  };
};
