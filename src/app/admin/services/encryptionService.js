// src/services/encryptionService.js
// Encryption/Decryption utilities based on Flutter implementation

import CryptoJS from 'crypto-js';

// Constants (using environment variables)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '2CYq2iKTFKBL168DePsBw2/jwMMoVn+NCO4oY6ggRWw='; // Use env var or fallback
const ENCRYPTION_IV = process.env.NEXT_PUBLIC_ENCRYPTION_IV || 'SbWYloBrQC6MdYWlEP9oKg==';   // Use env var or fallback

console.log('Encryption service initialized with:');
console.log('ENCRYPTION_KEY:', ENCRYPTION_KEY);
console.log('ENCRYPTION_IV:', ENCRYPTION_IV);

/**
 * Get encryption key
 * @returns {Promise<string>}
 */
export async function getKey() {
  console.log('Getting key from environment:', process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
  return process.env.NEXT_PUBLIC_ENCRYPTION_KEY || ENCRYPTION_KEY;
}

/**
 * Get initialization vector
 * @returns {Promise<string>}
 */
export async function getIv() {
  console.log('Getting IV from environment:', process.env.NEXT_PUBLIC_ENCRYPTION_IV);
  return process.env.NEXT_PUBLIC_ENCRYPTION_IV || ENCRYPTION_IV;
}

/**
 * Encrypt list of dynamic values
 * @param {Array} list - List of dynamic values to encrypt
 * @returns {string} Encrypted string
 */
export function encryptList(list) {
  if (!list || list.length === 0) {
    return 'null';
  }

  let encryptedString = '';
  for (let i = 0; i < list.length; i++) {
    if (i === 0) {
      encryptedString += list[i].toString();
    } else {
      encryptedString += '-' + list[i].toString();
    }
  }

  return encryptedString;
}

/**
 * Decrypt list from encrypted string
 * @param {string|null} encryptedString - Encrypted string to decrypt
 * @returns {Array<string>} Decrypted list
 */
export function decryptList(encryptedString) {
  if (encryptedString === 'null') {
    return [];
  }

  console.log('Encrypted String', encryptedString);

  const decryptedString = [];
  let s = '';

  for (let i = 0; i < encryptedString.length; i++) {
    const c = encryptedString[i];
    if (c !== '-') {
      s += c;
    } else {
      decryptedString.push(s);
      s = '';
    }
  }
  decryptedString.push(s);

  console.log('Decrypted String:', decryptedString);

  return decryptedString;
}

/**
 * Encrypt payload using AES encryption
 * @param {string} payload - Payload to encrypt
 * @returns {Promise<string>} Encrypted payload
 */
export async function encryptPayload(payload) {
  try {
    const key = await getKey();
    const iv = await getIv();
    
    // Convert key and IV from base64
    const keyBytes = CryptoJS.enc.Base64.parse(key);
    const ivBytes = CryptoJS.enc.Base64.parse(iv);
    
    // Encrypt the payload
    const encrypted = CryptoJS.AES.encrypt(payload, keyBytes, { 
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return payload; // Return original payload if encryption fails
  }
}

/**
 * Encrypt file bytes
 * @param {any} file - File to encrypt
 * @returns {Promise<string>} Encrypted file bytes
 */
export async function encryptFileBytes(file) {
  try {
    const key = await getKey();
    const iv = await getIv();
    
    // Convert key and IV from base64
    const keyBytes = CryptoJS.enc.Base64.parse(key);
    const ivBytes = CryptoJS.enc.Base64.parse(iv);
    
    // Get file bytes
    const fileBytes = file.bytes || file;
    
    // Convert to WordArray if it's a string
    const wordArray = typeof fileBytes === 'string' ? 
      CryptoJS.enc.Utf8.parse(fileBytes) : 
      CryptoJS.lib.WordArray.create(fileBytes);
    
    // Encrypt the file bytes
    const encrypted = CryptoJS.AES.encrypt(wordArray, keyBytes, { 
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
  } catch (error) {
    console.error('File encryption error:', error);
    return file.bytes || file; // Return original file if encryption fails
  }
}

/**
 * Decrypt payload using AES decryption
 * @param {string} encryptedPayload - Encrypted payload to decrypt
 * @returns {Promise<string>} Decrypted payload
 */
export async function decryptPayload(encryptedPayload) {
  console.log('=== STARTING DECRYPTION PROCESS ===');
  console.log('decryptPayload started with:', encryptedPayload);
  console.log('Encrypted payload length:', encryptedPayload.length);
  console.log('Encrypted payload type:', typeof encryptedPayload);
  
  // Remove surrounding quotes if present
  let cleanEncryptedPayload = encryptedPayload;
  if (typeof encryptedPayload === 'string' && 
      encryptedPayload.length >= 2 && 
      encryptedPayload.startsWith('"') && 
      encryptedPayload.endsWith('"')) {
    cleanEncryptedPayload = encryptedPayload.slice(1, -1);
    console.log('Removed surrounding quotes. Clean payload:', cleanEncryptedPayload);
  }
  
  try {
    console.log('About to call getIv()');
    const ivString = await getIv();
    console.log('getIv() returned:', ivString);
    console.log('IV length:', ivString.length);
    
    console.log('About to call getKey()');
    const keyString = await getKey();
    console.log('getKey() returned:', keyString);
    console.log('Key length:', keyString.length);
    
    // Convert key and IV from base64
    console.log('Converting key from base64...');
    const keyBytes = CryptoJS.enc.Base64.parse(keyString);
    console.log('Key bytes:', keyBytes);
    console.log('Key bytes string:', keyBytes.toString());
    
    console.log('Converting IV from base64...');
    const ivBytes = CryptoJS.enc.Base64.parse(ivString);
    console.log('IV bytes:', ivBytes);
    console.log('IV bytes string:', ivBytes.toString());
    
    console.log('Attempting to decrypt payload:', cleanEncryptedPayload);
    
    // Check if the encrypted payload is valid base64
    try {
      const testParsed = CryptoJS.enc.Base64.parse(cleanEncryptedPayload);
      console.log('Encrypted payload is valid base64. Parsed length:', testParsed.words.length);
    } catch (e) {
      console.error('Encrypted payload is NOT valid base64:', e);
    }
    
    // Decrypt the payload
    console.log('Calling CryptoJS.AES.decrypt...');
    const decrypted = CryptoJS.AES.decrypt(cleanEncryptedPayload, keyBytes, { 
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    console.log('Decrypted object:', decrypted);
    console.log('Decrypted words:', decrypted.words);
    console.log('Decrypted sigBytes:', decrypted.sigBytes);
    
    // Convert to UTF-8 string
    console.log('Converting to UTF-8 string...');
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('Decryption successful:', decryptedString);
    console.log('Decrypted string length:', decryptedString.length);
    console.log('Decrypted string type:', typeof decryptedString);
    
    console.log('=== END DECRYPTION PROCESS ===');
    
    return decryptedString;
  } catch (e) {
    console.log('!!! ERROR DURING DECRYPTION !!!');
    console.log('Error during decryption:', e);
    console.log('Error name:', e.name);
    console.log('Error message:', e.message);
    console.log('Stack trace:', e.stack);
    
    // Try alternative decryption approaches
    try {
      console.log('Trying alternative decryption approach...');
      const keyBytes = CryptoJS.enc.Base64.parse(await getKey());
      const ivBytes = CryptoJS.enc.Base64.parse(await getIv());
      
      // Try with different padding
      const decryptedAlt = CryptoJS.AES.decrypt(cleanEncryptedPayload, keyBytes, { 
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      
      const decryptedStringAlt = decryptedAlt.toString(CryptoJS.enc.Utf8);
      console.log('Alternative decryption result:', decryptedStringAlt);
      if (decryptedStringAlt && decryptedStringAlt.length > 0) {
        return decryptedStringAlt;
      }
    } catch (altError) {
      console.log('Alternative decryption also failed:', altError);
    }
    
    console.log('=== END DECRYPTION PROCESS WITH ERROR ===');
    // Return the original payload if decryption fails
    return encryptedPayload;
  }
}

/**
 * Decrypt payload conditionally based on URL
 * @param {string} encryptedPayload - Encrypted payload to decrypt
 * @param {string} url - URL to check for conditional decryption
 * @returns {Promise<string>} Decrypted payload
 */
export async function decryptPayloadConditional(encryptedPayload, url) {
  console.log('decrypted text :', encryptedPayload, url);

  // Do NOT remove first/last chars
  // encryptedPayload = encryptedPayload.substring(1, encryptedPayload.length - 1);

  if (url.toString().includes('signin/') || url.toString().includes('signup/')) {
    // For signin/signup endpoints, decrypt the payload
    return await decryptPayload(encryptedPayload);
  } else {
    console.log('decrypted text pass 2:', url);
    return encryptedPayload;
  }
}

/**
 * Test different decryption approaches for debugging
 * @param {string} encryptedPayload - Encrypted payload to decrypt
 * @returns {Promise<string>} Decrypted payload
 */
export async function testDecryptPayload(encryptedPayload) {
  console.log('=== TESTING DIFFERENT DECRYPTION APPROACHES ===');
  console.log('Testing payload:', encryptedPayload);
  
  try {
    const keyString = await getKey();
    const ivString = await getIv();
    
    console.log('Using key:', keyString);
    console.log('Using IV:', ivString);
    
    // Approach 1: Standard decryption
    try {
      console.log('Approach 1: Standard decryption');
      const keyBytes = CryptoJS.enc.Base64.parse(keyString);
      const ivBytes = CryptoJS.enc.Base64.parse(ivString);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedPayload, keyBytes, { 
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      console.log('Approach 1 result:', result);
      if (result && result.length > 0) return result;
    } catch (e) {
      console.log('Approach 1 failed:', e.message);
    }
    
    // Approach 2: Try different padding
    try {
      console.log('Approach 2: Different padding');
      const keyBytes = CryptoJS.enc.Base64.parse(keyString);
      const ivBytes = CryptoJS.enc.Base64.parse(ivString);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedPayload, keyBytes, { 
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      console.log('Approach 2 result:', result);
      if (result && result.length > 0) return result;
    } catch (e) {
      console.log('Approach 2 failed:', e.message);
    }
    
    // Approach 3: Try without IV
    try {
      console.log('Approach 3: Without IV');
      const keyBytes = CryptoJS.enc.Base64.parse(keyString);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedPayload, keyBytes);
      
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      console.log('Approach 3 result:', result);
      if (result && result.length > 0) return result;
    } catch (e) {
      console.log('Approach 3 failed:', e.message);
    }
    
    console.log('All approaches failed');
    return encryptedPayload;
  } catch (e) {
    console.log('Test decryption failed:', e);
    return encryptedPayload;
  }
}

export default {
  getKey,
  getIv,
  encryptList,
  decryptList,
  encryptPayload,
  encryptFileBytes,
  decryptPayload,
  decryptPayloadConditional
};