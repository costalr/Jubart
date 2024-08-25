import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { fetchImportData, fetchExportData } from '../../api/fetchApi';
import { getGroupedItem, setGroupedItem } from '../../api/indexedDBGrouped';

const Selectors = ({ selectedReportType, onCountryChange, onNcmChange, onStateChange, onSpeciesChange, onCategoryChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadGroupedData = useCallback(async (category, isImport = true) => {
        const groupKeyMap = {
            paises: 'por_pais',
            categorias: 'por_categoria',
            especies: 'por_especie',
            ncm: 'por_ncm',
            estados: 'por_estado',
        };

        const extractUniqueValues = (data, group) => {
            console.log(`Extracting unique values for group: ${group}`);
            
            const dataGroupKey = groupKeyMap[group];
            
            if (!data || !data[dataGroupKey]) {
                console.error(`No data found for group: ${group}`);
                return [];
            }

            if (group === 'ncm') {
                return [...new Set(Object.values(data[dataGroupKey]).flat().map(item => item.coNcm))]
                    .map(coNcm => ({ value: coNcm, label: coNcm }))
                    .sort((a, b) => a.label.localeCompare(b.label));
            }

            return Object.keys(data[dataGroupKey])
                .map(key => ({ value: key, label: key }))
                .sort((a, b) => a.label.localeCompare(b.label));
        };

        let data = await getGroupedItem(category);
        if (!data) {
            console.log(`No cached data found for ${category}, fetching from API...`);
            data = isImport ? await fetchImportData(true) : await fetchExportData(true);
            await setGroupedItem(category, data);
        } else {
            console.log(`Using cached data for ${category}`);
        }
        const groupedOptions = extractUniqueValues(data, category);
        setOptions(groupedOptions);
        console.log(`Loaded ${category} data:`, groupedOptions);
    }, []);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            if (selectedReportType) {
                await loadGroupedData(selectedReportType);
            }
            setLoading(false);
        };

        loadAllData();
    }, [selectedReportType, loadGroupedData]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    const handleChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : '';
        switch (selectedReportType) {
            case 'paises':
                onCountryChange(value);
                break;
            case 'ncm':
                onNcmChange(value);
                break;
            case 'estados':
                onStateChange(value);
                break;
            case 'especies':
                onSpeciesChange(value);
                break;
            case 'categorias':
                onCategoryChange(value);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            {selectedReportType && (
                <Select
                    options={options}
                    onChange={handleChange}
                    placeholder={`Selecione um ${selectedReportType}`}
                    isClearable
                    isSearchable
                />
            )}
        </div>
    );
};

export default Selectors;
