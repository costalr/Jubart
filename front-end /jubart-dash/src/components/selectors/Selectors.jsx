import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { fetchImportData, fetchExportData } from '../../api/fetchApi';
import { getGroupedItem, setGroupedItem } from '../../api/indexedDBGrouped';

const Selectors = ({ selectedReportType, onCountryChange, onNcmChange, onStateChange, onSpeciesChange, onCategoryChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadGroupedData = useCallback(async (category, isImport = true) => {
        console.log(`Loading data for category: ${category}, isImport: ${isImport}`);

        const groupKeyMap = {
            paises: 'por_pais',
            categorias: 'por_categoria',
            especies: 'por_especie',
            ncm: 'por_ncm',
            estados: 'por_estado',
        };

        const extractUniqueValues = (data, group) => {
            const dataGroupKey = groupKeyMap[group];

            if (!data || !data[dataGroupKey]) {
                return [];
            }

            console.log(`Extracting options for group: ${group}`);

            if (group === 'ncm') {
                return [...new Set(Object.values(data[dataGroupKey]).flat().map(item => item.coNcm))]
                    .filter(coNcm => {
                        // Filtra NCMs que têm dados válidos
                        return Object.values(data[dataGroupKey]).flat().some(item => item.coNcm === coNcm && parseFloat(item.total_kg) > 0);
                    })
                    .map(coNcm => ({ value: coNcm, label: coNcm }))
                    .sort((a, b) => a.label.localeCompare(b.label));
            }

            return Object.keys(data[dataGroupKey])
                .filter(key => {
                    // Filtra elementos que têm dados válidos
                    return data[dataGroupKey][key].some(item => parseFloat(item.total_kg) > 0);
                })
                .map(key => ({ value: key, label: key }))
                .sort((a, b) => a.label.localeCompare(b.label));
        };

        let data = await getGroupedItem(category);
        if (!data) {
            data = isImport ? await fetchImportData(true) : await fetchExportData(true);
            await setGroupedItem(category, data);
        }

        const groupedOptions = extractUniqueValues(data, category);
        setOptions(groupedOptions);

        if (groupedOptions.length > 0) {
            console.log(`Auto-selecting first option: ${groupedOptions[0].label}`);
            handleChange(groupedOptions[0]);
        }
    }, []);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            if (selectedReportType) {
                console.log(`Selected report type: ${selectedReportType}`);
                await loadGroupedData(selectedReportType);
            }
            setLoading(false);
        };

        loadAllData();
    }, [selectedReportType, loadGroupedData]);

    const handleChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : '';
        console.log(`Handling change, selected value: ${value}`);

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

    if (loading) {
        return <div>Carregando...</div>;
    }

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
