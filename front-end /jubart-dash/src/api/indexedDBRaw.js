const dbName = 'rawDataDatabase'; // Nome do banco de dados para dados brutos
const storeName = 'rawDataStore'; // Nome da store para dados brutos

// Abre ou cria o banco de dados
const openDb = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'key' });
                console.info('Store criada:', storeName);
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

export const setRawItem = async (key, value) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ key, value });

        request.onsuccess = () => console.info(`Dados brutos armazenados para a chave: ${key}`);
        request.onerror = (event) => console.error(`Falha ao armazenar os dados brutos para a chave: ${key}`, event.target.error);
    } catch (error) {
        console.error('Erro em setRawItem:', error);
    }
};

export const getRawItem = async (key) => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.value : null);
            };
            request.onerror = (event) => {
                console.error(`Falha ao recuperar os dados brutos para a chave: ${key}`, event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Erro em getRawItem:', error);
    }
};

export const clearRawData = async () => {
    try {
        const db = await openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => console.info('Store de dados brutos limpa');
        request.onerror = (event) => console.error('Falha ao limpar a store de dados brutos:', event.target.error);
    } catch (error) {
        console.error('Erro em clearRawData:', error);
    }
};
