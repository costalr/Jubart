import React from 'react';
import '../../../shared/Cards.css';

const CardsExp = ({ exportData, referenceMonth, referenceYear }) => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Calcula as métricas de exportação baseadas no ano e mês de referência
    const calculateMetrics = (data, year, month) => {
        const filterDataForYear = data.filter(d => parseInt(d.year) === year && d.metricKG !== 'none' && d.metricFOB !== 'none');
        const currentYearData = filterDataForYear.filter(d => parseInt(d.monthNumber) <= month);
        const previousYearData = data.filter(d => parseInt(d.year) === year - 1 && parseInt(d.monthNumber) <= month && d.metricKG !== 'none' && d.metricFOB !== 'none');

        const sumMetrics = (data, metric) => data.reduce((sum, item) => sum + parseFloat(item[metric]), 0);

        const currentVolume = sumMetrics(currentYearData, 'metricKG');
        const previousVolume = sumMetrics(previousYearData, 'metricKG');
        const currentRevenue = sumMetrics(currentYearData, 'metricFOB');
        const previousRevenue = sumMetrics(previousYearData, 'metricFOB');

        const volumeChange = previousVolume ? ((currentVolume - previousVolume) / previousVolume * 100).toFixed(2) : 'N/A';
        const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2) : 'N/A';

        const currentAveragePrice = currentVolume ? (currentRevenue / currentVolume).toFixed(2) : '0.00';
        const previousAveragePrice = previousVolume ? (previousRevenue / previousVolume).toFixed(2) : '0.00';
        const averagePriceChange = previousAveragePrice ? (((currentAveragePrice - previousAveragePrice) / previousAveragePrice) * 100).toFixed(2) : 'N/A';

        return {
            volume: currentVolume.toLocaleString('pt-BR'),
            revenue: currentRevenue.toLocaleString('pt-BR'),
            averagePrice: currentAveragePrice,
            volumeChange,
            revenueChange,
            averagePriceChange
        };
    };

    if (!exportData.length || referenceMonth === null || referenceYear === null) {
        return <div>Loading...</div>;
    }

    const metrics = calculateMetrics(exportData, referenceYear, referenceMonth);

    return (
        <div className="imp-container">
            <h1>Painel de Exportação - {monthNames[referenceMonth - 1]} de {referenceYear}</h1>
            <div className="cards-container">
                <div className="card">
                    <h2>Exportação</h2>
                    <p>Volume de Exportação: {metrics.volume} t</p>
                    <p>Dispendio de Exportação: {metrics.revenue} US$</p>
                    <p>Preço Médio de Exportação: {metrics.averagePrice} US$/t</p>
                    <p>Variação de Volume: {metrics.volumeChange}%</p>
                    <p>Variação de Dispendio: {metrics.revenueChange}%</p>
                    <p>Variação de Preço Médio: {metrics.averagePriceChange}%</p>
                </div>
            </div>
        </div>
    );
};

export default CardsExp;
