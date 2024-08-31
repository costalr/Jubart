import React from 'react';
import '../../../../shared/Cards.css';

const CardsNCMImp = ({ importData, referenceMonth, referenceYear }) => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Calcula as métricas de importação baseadas no ano e mês de referência
    const calculateMetrics = (data, year, month) => {
        const filterDataForYear = data.filter(d => parseInt(d.ano) === year && d.total_kg !== 'none' && d.total_usd !== 'none');
        const currentYearData = filterDataForYear.filter(d => parseInt(d.mes) <= month);
        const previousYearData = data.filter(d => parseInt(d.ano) === year - 1 && parseInt(d.mes) <= month && d.total_kg !== 'none' && d.total_usd !== 'none');

        const sumMetrics = (data, metric) => data.reduce((sum, item) => sum + parseFloat(item[metric]), 0);

        const currentVolume = sumMetrics(currentYearData, 'total_kg');
        const previousVolume = sumMetrics(previousYearData, 'total_kg');
        const currentRevenue = sumMetrics(currentYearData, 'total_usd');
        const previousRevenue = sumMetrics(previousYearData, 'total_usd');

        const volumeChange = previousVolume ? ((currentVolume - previousVolume) / previousVolume * 100).toFixed(2) : 'N/A';
        const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2) : 'N/A';

        const currentAveragePrice = currentVolume ? (currentRevenue / currentVolume).toFixed(2) : '0.00';
        const previousAveragePrice = previousVolume ? (previousRevenue / previousVolume).toFixed(2) : '0.00';
        const averagePriceChange = previousAveragePrice ? (((currentAveragePrice - previousAveragePrice) / previousAveragePrice) * 100).toFixed(2) : 'N/A';

        return {
            volume: (currentVolume / 1000).toLocaleString('pt-BR'), // Convertendo para toneladas
            revenue: currentRevenue.toLocaleString('pt-BR'),
            averagePrice: currentAveragePrice,
            volumeChange,
            revenueChange,
            averagePriceChange
        };
    };

    if (!importData.length || referenceMonth === null || referenceYear === null) {
        return <div>Loading...</div>;
    }

    const metrics = calculateMetrics(importData, referenceYear, referenceMonth);

    return (
        <div className="imp-container">
            <h1>Painel de Importação - {monthNames[referenceMonth - 1]} de {referenceYear}</h1>
            <div className="cards-container">
                <div className="card">
                    <h2>Importação</h2>
                    <p>Volume de Importação: {metrics.volume} t</p>
                    <p>Dispendio de Importação: {metrics.revenue} US$</p>
                    <p>Preço Médio de Importação: {metrics.averagePrice} US$/t</p>
                    <p>Variação de Volume: {metrics.volumeChange}%</p>
                    <p>Variação de Dispendio: {metrics.revenueChange}%</p>
                    <p>Variação de Preço Médio: {metrics.averagePriceChange}%</p>
                </div>
            </div>
        </div>
    );
};

export default CardsNCMImp;
