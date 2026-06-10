/**
 * Response Handler for standardized API response checking
 * Checks for status field in response instead of just HTTP status codes
 */

export const checkApiResponse = (responseData) => {
  // Check if response has the standardized format with status field
  if (responseData && typeof responseData === 'object') {
    if (responseData.status) {
      // If status exists, check if it's "success" or "failed"
      if (responseData.status.toLowerCase() === 'success') {
        return {
          isSuccess: true,
          data: responseData.data || responseData,
          message: responseData.message || 'Operation successful'
        };
      } else if (responseData.status.toLowerCase() === 'failed') {
        return {
          isSuccess: false,
          data: responseData.data || null,
          message: responseData.message || 'Operation failed'
        };
      }
    }
  }
  
  // If no standardized format, assume success for backward compatibility
  return {
    isSuccess: true,
    data: responseData,
    message: 'Operation successful'
  };
};

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  // Handle different types of errors
  if (error.response) {
    // Server responded with error status
    const responseData = error.response.data;
    if (responseData && responseData.status) {
      // Use standardized response format
      return responseData.message || defaultMessage;
    } else {
      // Use HTTP status text
      return error.response.statusText || defaultMessage;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};