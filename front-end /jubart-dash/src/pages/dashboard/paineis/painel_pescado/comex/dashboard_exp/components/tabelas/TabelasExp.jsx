import React from 'react';

const TabelasExp = ({ exportData }) => {
    const currentYear = new Date().getFullYear();

    const calculateTableData = () => {
        const dataByCountry = {};

        exportData.forEach(item => {
            const year = parseInt(item.year);
            const country = item.country;

            if (year === currentYear || year === currentYear - 1) {
                if (!dataByCountry[country]) {
                    dataByCountry[country] = { [currentYear]: { kg: 0, usd: 0 }, [currentYear - 1]: { kg: 0, usd: 0 } };
                }
                dataByCountry[country][year].kg += parseFloat(item.metricKG);
                dataByCountry[country][year].usd += parseFloat(item.metricFOB);
            }
        });

        const tableData = Object.keys(dataByCountry).map(country => {
            const data = dataByCountry[country];
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
                country,
                [`${currentYear}-kg`]: data[currentYear].kg,
                [`${currentYear - 1}-kg`]: kgPreviousYear,
                'varKg%': varKg === '-100.00' ? '0' : varKg, // Converting -100% to 0
                [`${currentYear}-usd`]: data[currentYear].usd,
                [`${currentYear - 1}-usd`]: usdPreviousYear,
                'varUsd%': varUsd === '-100.00' ? '0' : varUsd, // Converting -100% to 0
                [`${currentYear}-Preco`]: avgPriceCurrent !== '0' ? `$${avgPriceCurrent}` : '0',
                [`${currentYear - 1}-Preco`]: avgPricePrevious !== '0' ? `$${avgPricePrevious}` : '0',
                'varPrice%': varPrice === '-100.00' ? '0' : varPrice // Converting -100% to 0
            };
        });

        // Ordenar os dados por kg em 2024 e depois por kg em 2023 em ordem decrescente
        return tableData.sort((a, b) => {
            if (b[`${currentYear}-kg`] !== a[`${currentYear}-kg`]) {
                return b[`${currentYear}-kg`] - a[`${currentYear}-kg`];
            }
            return b[`${currentYear - 1}-kg`] - a[`${currentYear - 1}-kg`];
        });
    };

    const tableData = calculateTableData();

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Tabela  de Exportações</h1>
            <table>
                <thead>
                    <tr>
                        <th>País</th>
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
                            <td>{row.country}</td>
                            <td>{row[`${currentYear}-kg`].toLocaleString()}</td>
                            <td>{row[`${currentYear - 1}-kg`].toLocaleString()}</td>
                            <td>{row['varKg%']}%</td>
                            <td>{row[`${currentYear}-usd`].toLocaleString()}</td>
                            <td>{row[`${currentYear - 1}-usd`].toLocaleString()}</td>
                            <td>{row['varUsd%']}%</td>
                            <td>{row[`${currentYear}-Preco`]}</td>
                            <td>{row[`${currentYear - 1}-Preco`]}</td>
                            <td>{row['varPrice%']}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelasExp;
