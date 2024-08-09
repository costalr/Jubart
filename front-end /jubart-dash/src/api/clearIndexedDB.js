// src/api/clearIndexedDB.js
export const clearIndexedDB = async () => {
    const request = window.indexedDB.deleteDatabase('myDatabase')
    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log('IndexedDB cleared successfully');
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error clearing IndexedDB:', event);
            reject(event);
        };
    });
};
