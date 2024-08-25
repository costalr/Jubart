// src/api/clearIndexedDB.js
export const clearIndexedDB = async () => {
    const clearDatabase = (dbName) => {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(dbName);

            request.onsuccess = () => {
                console.log(`IndexedDB ${dbName} cleared successfully`);
                resolve();
            };

            request.onerror = (event) => {
                console.error(`Error clearing IndexedDB ${dbName}:`, event);
                reject(event);
            };

            request.onblocked = () => {
                console.log(`Database ${dbName} deletion blocked`);
            };
        });
    };

    try {
        await clearDatabase('rawDataDatabase');
        await clearDatabase('groupedDataDatabase');
        console.log('Both databases cleared successfully');
    } catch (error) {
        console.error('Error clearing one or both IndexedDB databases:', error);
    }
};
