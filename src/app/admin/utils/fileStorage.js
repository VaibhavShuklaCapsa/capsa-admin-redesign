/**
 * File Storage Utility
 * Provides persistent file storage across route changes using IndexedDB
 * This solves the Redux serialization issue while maintaining file access
 */

const DB_NAME = 'capsa-file-storage';
const DB_VERSION = 1;
const STORE_NAME = 'files';

// Open database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

// Store file as Blob with metadata
export const storeFile = async (key, file) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Store file metadata
    const fileData = {
      file: file, // Store actual File object in IndexedDB
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      timestamp: Date.now()
    };
    
    await new Promise((resolve, reject) => {
      const request = store.put(fileData, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    console.log(`✅ File stored in IndexedDB: ${key}`, file.name);
    return true;
  } catch (error) {
    console.error('❌ Error storing file:', error);
    return false;
  }
};

// Retrieve file from IndexedDB
export const getFile = async (key) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const fileData = await new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    if (fileData) {
      console.log(`✅ File retrieved from IndexedDB: ${key}`, fileData.file?.name);
      return fileData.file; // Return the actual File object
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error retrieving file:', error);
    return null;
  }
};

// Delete file from IndexedDB
export const deleteFile = async (key) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    console.log(`✅ File deleted from IndexedDB: ${key}`);
    return true;
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return false;
  }
};

// Get file metadata only (for Redux state)
export const getFileMetadata = async (key) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const fileData = await new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    if (fileData) {
      return {
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        lastModified: fileData.lastModified
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting file metadata:', error);
    return null;
  }
};

// Clear all files from storage
export const clearAllFiles = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    console.log('✅ All files cleared from IndexedDB');
    return true;
  } catch (error) {
    console.error('❌ Error clearing files:', error);
    return false;
  }
};
