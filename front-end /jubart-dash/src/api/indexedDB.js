const dbName = 'myDatabase'; // Nome do banco de dados
const storeName = 'myStore'; // Nome da store

// Abre ou cria o banco de dados
const openDb = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2); // Atualize a versão aqui se necessário

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.log('onupgradeneeded: Checking store existence');
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'key' });
                console.log('Store created:', storeName);
            } else {
                console.log('Store already exists:', storeName);
            }
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };
    });
};

// Função para armazenar dados no cache
export const setItem = async (key, value) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ key, value });

        request.onsuccess = () => console.log('Data stored successfully');
        request.onerror = (event) => console.error('Failed to store data:', event.target.error);
    } catch (error) {
        console.error('Error in setItem:', error);
    }
};

// Função para obter dados do cache
export const getItem = async (key) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName);
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const result = event.target.result ? event.target.result.value : null;
                console.log('Data retrieved:', result);
                resolve(result);
            };
            request.onerror = (event) => {
                console.error('Failed to retrieve data:', event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Error in getItem:', error);
    }
};

// Função para remover dados do cache
export const removeItem = async (key) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => console.log('Data removed successfully');
        request.onerror = (event) => console.error('Failed to remove data:', event.target.error);
    } catch (error) {
        console.error('Error in removeItem:', error);
    }
};

// Função para limpar o banco de dados
export const clear = async () => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => console.log('Database cleared successfully');
        request.onerror = (event) => console.error('Failed to clear database:', event.target.error);
    } catch (error) {
        console.error('Error in clear:', error);
    }
};
