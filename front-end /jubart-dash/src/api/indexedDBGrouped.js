const dbName = 'groupedDataDatabase'; // Nome do banco de dados para dados agrupados
const storeName = 'groupedDataStore'; // Nome da store para dados agrupados

// Abre ou cria o banco de dados
const openDb = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'key' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Erro ao abrir o banco de dados:', event.target.error);
            reject(event.target.error);
        };
    });
};

export const setGroupedItem = async (key, value) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.put({ key, value });
    } catch (error) {
        console.error('Erro ao armazenar dados agrupados:', error);
    }
};

export const getGroupedItem = async (key) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const result = event.target.result ? event.target.result.value : null;
                resolve(result);
            };
            request.onerror = (event) => {
                console.error(`Falha ao recuperar dados para a chave: ${key}`, event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Erro ao recuperar dados agrupados:', error);
    }
};

export const clearGroupedData = async () => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.clear();
    } catch (error) {
        console.error('Erro ao limpar a store de dados agrupados:', error);
    }
};
