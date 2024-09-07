import React, { useState, useEffect } from 'react';
import './TabelasPaisesImp.css';

const TabelasPaisesImp = ({ importData, selectedCountry }) => {
    const currentYear = new Date().getFullYear();

    // Estado para armazenar a coluna e a direção da ordenação
    const [sortColumn, setSortColumn] = useState(`${currentYear}-kg`);
    const [sortDirection, setSortDirection] = useState('desc'); // 'asc' para ascendente e 'desc' para descendente
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);



    const calculateTableData = () => {
        const dataByRegion = {};

        importData.forEach(item => {
            const year = parseInt(item.ano);
            const region = selectedCountry ? item.estado : item.pais;

            if ((year === currentYear || year === currentYear - 1) && (!selectedCountry || item.pais === selectedCountry)) {
                if (!dataByRegion[region]) {
                    dataByRegion[region] = { [currentYear]: { kg: 0, usd: 0 }, [currentYear - 1]: { kg: 0, usd: 0 } };
                }
                dataByRegion[region][year].kg += parseFloat(item.total_kg);
                dataByRegion[region][year].usd += parseFloat(item.total_usd);
            }
        });

        const tableData = Object.keys(dataByRegion).map(region => {
            const data = dataByRegion[region];
            const kgPreviousYear = data[currentYear - 1].kg;
            const usdPreviousYear = data[currentYear - 1].usd;

            const varKg = kgPreviousYear > 0 
                ? ((data[currentYear].kg - kgPreviousYear) / kgPreviousYear * 100).toFixed(2)
                : '0';

            const varUsd = usdPreviousYear > 0
                ? ((data[currentYear].usd - usdPreviousYear) / usdPreviousYear * 100).toFixed(2)
                : '0';

            const avgPriceCurrent = data[currentYear].kg > 0
                ? (data[currentYear].usd / data[currentYear].kg).toFixed(2)
                : '0';

            const avgPricePrevious = kgPreviousYear > 0
                ? (usdPreviousYear / kgPreviousYear).toFixed(2)
                : '0';

            const varPrice = avgPricePrevious !== '0' && avgPriceCurrent !== '0'
                ? ((avgPriceCurrent - avgPricePrevious) / avgPricePrevious * 100).toFixed(2)
                : '0';

            return {
                region,
                [`${currentYear}-kg`]: data[currentYear].kg,
                [`${currentYear - 1}-kg`]: kgPreviousYear,
                'varKg%': varKg === '-100.00' ? '0' : varKg,
                [`${currentYear}-usd`]: data[currentYear].usd,
                [`${currentYear - 1}-usd`]: usdPreviousYear,
                'varUsd%': varUsd === '-100.00' ? '0' : varUsd,
                [`${currentYear}-Preco`]: avgPriceCurrent !== '0' ? avgPriceCurrent : '0',
                [`${currentYear - 1}-Preco`]: avgPricePrevious !== '0' ? avgPricePrevious : '0',
                'varPrice%': varPrice === '-100.00' ? '0' : varPrice
            };
        });

        const sortedTableData = [...tableData].sort((a, b) => {
            const compareA = a[sortColumn];
            const compareB = b[sortColumn];

            if (sortDirection === 'asc') {
                return compareA > compareB ? 1 : -1;
            } else {
                return compareA < compareB ? 1 : -1;
            }
        });

        return sortedTableData;
    };

    const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
    const formatTonnes = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " kg";
    const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;
    const formatPrice = (value) => `$${parseFloat(value).toFixed(2)}`;

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const renderSortIcon = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? '▲' : '▼';
        }
        return null;
    };

    const tableData = calculateTableData();

    return (
        <div className="table-container">
            <h1 style={{ textAlign: 'center' }}>
                {selectedCountry ? `Tabela de Importações por UF - ${selectedCountry}` : 'Tabela de Importações por País'}
            </h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort(selectedCountry ? 'UF' : 'País')}>
                            {selectedCountry ? 'UF' : 'País'} {renderSortIcon(selectedCountry ? 'UF' : 'País')}
                        </th>
                        <th onClick={() => handleSort(`${currentYear}-kg`)}>{currentYear}-kg {renderSortIcon(`${currentYear}-kg`)}</th>
                        <th onClick={() => handleSort(`${currentYear - 1}-kg`)}>{currentYear - 1}-kg {renderSortIcon(`${currentYear - 1}-kg`)}</th>
                        <th onClick={() => handleSort('varKg%')}>Variação% kg {renderSortIcon('varKg%')}</th>
                        <th onClick={() => handleSort(`${currentYear}-usd`)}>{currentYear}-US$ {renderSortIcon(`${currentYear}-usd`)}</th>
                        <th onClick={() => handleSort(`${currentYear - 1}-usd`)}>{currentYear - 1}-US$ {renderSortIcon(`${currentYear - 1}-usd`)}</th>
                        <th onClick={() => handleSort('varUsd%')}>Variação% US$ {renderSortIcon('varUsd%')}</th>
                        <th onClick={() => handleSort(`${currentYear}-Preco`)}>Preço Médio {currentYear} {renderSortIcon(`${currentYear}-Preco`)}</th>
                        <th onClick={() => handleSort(`${currentYear - 1}-Preco`)}>Preço Médio {currentYear - 1} {renderSortIcon(`${currentYear - 1}-Preco`)}</th>
                        <th onClick={() => handleSort('varPrice%')}>Var% Preço Médio {renderSortIcon('varPrice%')}</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.region}</td>
                            <td>{formatTonnes(row[`${currentYear}-kg`])}</td>
                            <td>{formatTonnes(row[`${currentYear - 1}-kg`])}</td>
                            <td className={parseFloat(row['varKg%']) > 0 ? "positive" : "negative"}>
                                {formatPercentage(row['varKg%'])}
                            </td>
                            <td>{formatCurrency(row[`${currentYear}-usd`])}</td>
                            <td>{formatCurrency(row[`${currentYear - 1}-usd`])}</td>
                            <td className={parseFloat(row['varUsd%']) > 0 ? "positive" : "negative"}>
                                {formatPercentage(row['varUsd%'])}
                            </td>
                            <td>{formatPrice(row[`${currentYear}-Preco`])}</td>
                            <td>{formatPrice(row[`${currentYear - 1}-Preco`])}</td>
                            <td className={parseFloat(row['varPrice%']) > 0 ? "positive" : "negative"}>
                                {formatPercentage(row['varPrice%'])}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelasPaisesImp;
