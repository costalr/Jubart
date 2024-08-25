import axios from 'axios';
import pako from 'pako';
import { getRawItem, setRawItem } from './indexedDBRaw';
import { getGroupedItem, setGroupedItem } from './indexedDBGrouped';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Função para descomprimir dados GZ
const decompressData = (compressedData) => {
    try {
        const binaryString = pako.inflate(compressedData, { to: 'string' });
        const jsonData = JSON.parse(binaryString);
        return jsonData;
    } catch (error) {
        console.error('Erro ao descomprimir os dados:', error);
        return null;
    }
};

// Obtém o hash dos dados
const getHash = async (type, isGrouped) => {
    const endpoint = isGrouped ? `get_${type}_grouped_data_hash` : `get_${type}_data_hash`;
    try {
        const response = await axios.get(`${API_BASE_URL}/${type}/${endpoint}/`);
        return response.data.hash;
    } catch (error) {
        console.error(`Erro ao obter hash de ${type}:`, error);
        return null;
    }
};

// Busca dados da API
const fetchData = async (type, isGrouped) => {
    const endpoint = isGrouped ? `get_${type}_grouped_data_url` : `get_${type}_data_url`;
    try {
        const { data: { url } } = await axios.get(`${API_BASE_URL}/${type}/${endpoint}/`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const decompressedData = decompressData(new Uint8Array(response.data));
        return decompressedData;
    } catch (error) {
        console.error(`Erro ao buscar dados de ${type}:`, error);
        return [];
    }
};

// Busca dados de importação
export const fetchImportData = async (isGrouped = false) => {
    try {
        const hash = await getHash('import', isGrouped);
        const cachedHash = await (isGrouped ? getGroupedItem('import_grouped_hash') : getRawItem('import_hash'));

        if (hash === cachedHash) {
            return await (isGrouped ? getGroupedItem('import_grouped_data') : getRawItem('import_data'));
        } else {
            const data = await fetchData('import', isGrouped);
            await (isGrouped ? setGroupedItem('import_grouped_data', data) : setRawItem('import_data', data));
            await (isGrouped ? setGroupedItem('import_grouped_hash', hash) : setRawItem('import_hash', hash));
            return data;
        }
    } catch (error) {
        console.error('Erro ao buscar dados de importação:', error);
        return [];
    }
};

// Busca dados de exportação
export const fetchExportData = async (isGrouped = false) => {
    try {
        const hash = await getHash('export', isGrouped);
        const cachedHash = await (isGrouped ? getGroupedItem('export_grouped_hash') : getRawItem('export_hash'));

        if (hash === cachedHash) {
            return await (isGrouped ? getGroupedItem('export_grouped_data') : getRawItem('export_data'));
        } else {
            const data = await fetchData('export', isGrouped);
            await (isGrouped ? setGroupedItem('export_grouped_data', data) : setRawItem('export_data', data));
            await (isGrouped ? setGroupedItem('export_grouped_hash', hash) : setRawItem('export_hash', hash));
            return data;
        }
    } catch (error) {
        console.error('Erro ao buscar dados de exportação:', error);
        return [];
    }
};
