import Storage from './storageUtil';

/**
 * Check if user is a sub-admin
 * @returns {Promise<boolean>} true if sub-admin, false if super admin
 */
export const isSubAdmin = async () => {
  try {
    const authData = Storage.getObject('auth');
    
    if (!authData) {
      console.error('❌ No auth data found');
      return false;
    }

    // Try 'data' field first (new API), then 'token' field (old API)
    let tokenToDecrypt = authData.data || authData.token;
    
    if (!tokenToDecrypt) {
      console.error('❌ No token found in auth data');
      return false;
    }

    const tokenParts = tokenToDecrypt.split('.');
    if (tokenParts.length !== 3) {
      console.error('❌ Invalid JWT structure');
      return false;
    }

    const jwtPayload = JSON.parse(atob(tokenParts[1]));
    
    if (!jwtPayload.encdata) {
      console.warn('⚠️ No encdata in JWT');
      // If no encrypted data, check for isSubAdmin in plain payload
      return jwtPayload?.isSubAdmin === "1";
    }

    // Import crypto-js
    const CryptoJS = await import('crypto-js');
    const email = Storage.getObject('email') || '';
    
    const decryptedBytes = CryptoJS.AES.decrypt(jwtPayload.encdata, email);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData || decryptedData.trim() === '') {
      console.error('❌ Decryption failed');
      return false;
    }

    const profile = JSON.parse(decryptedData);
    
    // Check isSubAdmin field
    // Can be either:
    // 1. Direct string: profile.isSubAdmin === "1"
    // 2. Object with nested field: profile.isSubAdmin?.isSubAdmin === "1"
    const isSubAdminValue = typeof profile.isSubAdmin === 'object' 
      ? profile.isSubAdmin?.isSubAdmin 
      : profile.isSubAdmin;
    
    return isSubAdminValue === "1";
  } catch (error) {
    console.error('❌ Error checking sub-admin status:', error);
    return false;
  }
};

/**
 * Get sub-admin details
 * @returns {Promise<Object|null>} Sub-admin details or null if not sub-admin
 */
export const getSubAdminDetails = async () => {
  try {
    const authData = Storage.getObject('auth');
    
    if (!authData) {
      return null;
    }

    let tokenToDecrypt = authData.data || authData.token;
    
    if (!tokenToDecrypt) {
      return null;
    }

    const tokenParts = tokenToDecrypt.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    const jwtPayload = JSON.parse(atob(tokenParts[1]));
    
    if (!jwtPayload.encdata) {
      return jwtPayload?.sub_admin_details || null;
    }

    const CryptoJS = await import('crypto-js');
    const email = Storage.getObject('email') || '';
    
    const decryptedBytes = CryptoJS.AES.decrypt(jwtPayload.encdata, email);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      return null;
    }

    const profile = JSON.parse(decryptedData);
    
    // Return sub_admin_details
    return profile?.sub_admin_details || null;
  } catch (error) {
    console.error('❌ Error getting sub-admin details:', error);
    return null;
  }
};

/**
 * Get sub-admin role flags directly from details
 * @param {Object} details - sub_admin_details object
 * @returns {Object} Object containing role flags
 */
export const getSubAdminRoleFlags = (details) => {
  if (!details) {
    return {
      canUpload: false,
      canApprove: false,
      canReview: false
    };
  }
  
  return {
    canUpload: details?.roleUploadRFInvoice === 1,
    canApprove: details?.roleApproveRFInvoice === 1,
    canReview: details?.roleReviewRFInvoice === 1
  };
};

/**
 * Determine sub-admin type based on permissions
 * @param {Object} details - sub_admin_details object from login API
 * @returns {string} 'Reviewer' | 'Uploader' | 'Approver' | 'Unknown'
 */
export const getSubAdminType = (details) => {
  if (!details) return 'Unknown';
  
  console.log('[getSubAdminType] Details received:', details);
  
  // Check the RF Invoice role flags
  const canUpload = details?.roleUploadRFInvoice === 1;
  const canApprove = details?.roleApproveRFInvoice === 1;
  const canReview = details?.roleReviewRFInvoice === 1;
  
  console.log('[getSubAdminType] Role Flags:', {
    canUpload,
    canApprove,
    canReview
  });
  
  // Determine role based on which flag is enabled
  if (canReview && !canUpload && !canApprove) {
    console.log('[getSubAdminType] Identified as: Reviewer');
    return 'Reviewer';
  }
  
  if (canUpload && !canApprove) {
    console.log('[getSubAdminType] Identified as: Uploader');
    return 'Uploader';
  }
  
  if (canApprove) {
    console.log('[getSubAdminType] Identified as: Approver');
    return 'Approver';
  }
  
  // Fallback - if multiple flags or no flags are set
  console.warn('[getSubAdminType] Unknown role type, defaulting to Unknown');
  return 'Unknown';
};
