import React from 'react';
import './TabelasPaisesImp.css'

const TabelasPaisesImp = ({ importData, selectedCountry }) => {
    const currentYear = new Date().getFullYear();

    const calculateTableData = () => {
        const dataByRegion = {};

        importData.forEach(item => {
            const year = parseInt(item.ano);
            const region = selectedCountry ? item.estado : item.pais;  // Agrupar por UF se um país for selecionado, caso contrário, por país

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

        return tableData.sort((a, b) => {
            if (b[`${currentYear}-kg`] !== a[`${currentYear}-kg`]) {
                return b[`${currentYear}-kg`] - a[`${currentYear}-kg`];
            }
            return b[`${currentYear - 1}-kg`] - a[`${currentYear - 1}-kg`];
        });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
    };

    const formatTonnes = (value) => {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " kg";
    };

    const formatPercentage = (value) => {
        return `${parseFloat(value).toFixed(2)}%`;
    };

    const formatPrice = (value) => {
        return `$${parseFloat(value).toFixed(2)}`;
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
                        <th>{selectedCountry ? 'UF' : 'País'}</th>
                        <th>{currentYear}-kg</th>
                        <th>{currentYear - 1}-kg</th>
                        <th>Variação% kg</th>
                        <th>{currentYear}-US$</th>
                        <th>{currentYear - 1}-US$</th>
                        <th>Variação% US$</th>
                        <th>Preço Médio {currentYear}</th>
                        <th>Preço Médio {currentYear - 1}</th>
                        <th>Var% Preço Médio</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.region}</td>
                            <td>{formatTonnes(row[`${currentYear}-kg`])}</td>
                            <td>{formatTonnes(row[`${currentYear - 1}-kg`])}</td>
                            <td>{formatPercentage(row['varKg%'])}</td>
                            <td>{formatCurrency(row[`${currentYear}-usd`])}</td>
                            <td>{formatCurrency(row[`${currentYear - 1}-usd`])}</td>
                            <td>{formatPercentage(row['varUsd%'])}</td>
                            <td>{formatPrice(row[`${currentYear}-Preco`])}</td>
                            <td>{formatPrice(row[`${currentYear - 1}-Preco`])}</td>
                            <td>{formatPercentage(row['varPrice%'])}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelasPaisesImp;
