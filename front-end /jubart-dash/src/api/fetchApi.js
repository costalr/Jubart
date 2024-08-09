import axios from 'axios';
import { getItem, setItem } from './indexedDB';

// URL base da API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Obtém o hash dos dados
const getHash = async (type) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${type}/get_${type}_data_hash/`);
        return response.data.hash;
    } catch (error) {
        console.error(`Erro ao obter hash de ${type}:`, error);
        return null;
    }
};

// Busca dados da API
const fetchData = async (type) => {
    try {
        // Obtém a URL dos dados
        const { data: { url } } = await axios.get(`${API_BASE_URL}/${type}/get_${type}_data_url/`);
        // Busca os dados na URL obtida
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar dados de ${type}:`, error);
        return [];
    }
};

// Busca dados de importação
export const fetchImportData = async () => {
    const hash = await getHash('import');
    const cachedHash = await getItem('import_hash');

    if (hash === cachedHash) {
        return await getItem('import_data');
    } else {
        const data = await fetchData('import');
        await setItem('import_data', data);
        await setItem('import_hash', hash);
        return data;
    }
};

// Busca dados de exportação
export const fetchExportData = async () => {
    const hash = await getHash('export');
    const cachedHash = await getItem('export_hash');

    if (hash === cachedHash) {
        return await getItem('export_data');
    } else {
        const data = await fetchData('export');
        await setItem('export_data', data);
        await setItem('export_hash', hash);
        return data;
    }
};

// Configura o WebSocket
export const setupWebSocket = (onMessageCallback) => {
    const ws = new WebSocket('wss://9z8gdf7u5j.execute-api.us-east-1.amazonaws.com/production/');

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.action === 'file_update') {
            if (data.bucket === 'jubart-dashboard') {
                const importData = await fetchImportData();
                const exportData = await fetchExportData();
                onMessageCallback({ importData, exportData });
            }
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    return ws;
};
