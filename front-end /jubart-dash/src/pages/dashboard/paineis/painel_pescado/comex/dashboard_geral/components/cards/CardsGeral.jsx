// CardsGeral.js
import React from 'react';
import '../../../shared/Cards.css';

const CardsGeral = ({ importData = [], exportData = [], error, referenceMonth, referenceYear }) => {
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const calculateMetricAndVariation = (data, year, month, metric) => {
    if (!Array.isArray(data)) return { metric: '0.00', metricChange: 'N/A' };

    const currentYearData = data.filter(item => parseInt(item.year) === year && parseInt(item.monthNumber) <= month);
    const previousYearData = data.filter(item => parseInt(item.year) === year - 1 && parseInt(item.monthNumber) <= month);

    const currentYearMetric = (currentYearData.reduce((sum, item) => sum + (parseFloat(item[metric]) || 0), 0) / 1000);
    const previousYearMetric = previousYearData.reduce((sum, item) => sum + (parseFloat(item[metric]) || 0), 0) / 1000;

    const metricChange = previousYearMetric === 0 ? 'N/A' : ((currentYearMetric - previousYearMetric) / previousYearMetric) * 100;
    return { 
      metric: currentYearMetric.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
      metricChange: metricChange.toFixed(2) 
    };
  };

  const calculateAveragePriceAndVariation = (data, year, month) => {
    if (!Array.isArray(data)) return { averagePrice: '0.00', averagePriceChange: 'N/A' };

    const currentYearData = data.filter(item => parseInt(item.year) === year && parseInt(item.monthNumber) <= month);
    const previousYearData = data.filter(item => parseInt(item.year) === year - 1 && parseInt(item.monthNumber) <= month);

    const currentYearRevenue = currentYearData.reduce((sum, item) => sum + (parseFloat(item.metricFOB) || 0), 0);
    const currentYearVolume = currentYearData.reduce((sum, item) => sum + (parseFloat(item.metricKG) || 0), 0) / 1000;
    const previousYearRevenue = previousYearData.reduce((sum, item) => sum + (parseFloat(item.metricFOB) || 0), 0);
    const previousYearVolume = previousYearData.reduce((sum, item) => sum + (parseFloat(item.metricKG) || 0), 0) / 1000;

    const currentYearAveragePrice = currentYearVolume === 0 ? 0 : currentYearRevenue / currentYearVolume;
    const previousYearAveragePrice = previousYearVolume === 0 ? 0 : previousYearRevenue / previousYearVolume;
    const averagePriceChange = previousYearAveragePrice === 0 ? 'N/A' : ((currentYearAveragePrice - previousYearAveragePrice) / previousYearAveragePrice) * 100;

    return { 
      averagePrice: currentYearAveragePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
      averagePriceChange: averagePriceChange.toFixed(2) 
    };
  };

  if (error) {
    return <div>Erro ao carregar dados</div>;
  }

  if (!importData.length || !exportData.length || referenceMonth === null || referenceYear === null) {
    return <div>Loading...</div>;
  }

  const importVolumeStats = calculateMetricAndVariation(importData, referenceYear, referenceMonth, 'metricKG');
  const exportVolumeStats = calculateMetricAndVariation(exportData, referenceYear, referenceMonth, 'metricKG');
  const importRevenueStats = calculateMetricAndVariation(importData, referenceYear, referenceMonth, 'metricFOB');
  const exportRevenueStats = calculateMetricAndVariation(exportData, referenceYear, referenceMonth, 'metricFOB');
  const importAveragePriceStats = calculateAveragePriceAndVariation(importData, referenceYear, referenceMonth);
  const exportAveragePriceStats = calculateAveragePriceAndVariation(exportData, referenceYear, referenceMonth);

  return (
    <div>
      <h1>Painel Geral - {monthNames[referenceMonth - 1]} de {referenceYear}</h1>
      <div className="cards-container">
        <div className="card">
          <h2>Importação</h2>
          <p>Volume Atual: {importVolumeStats.metric} t</p>
          <p>Dispendio Atual: {importRevenueStats.metric} US$</p>
          <p>Preço Médio Atual: {importAveragePriceStats.averagePrice} US$/t</p>
          <p>Variação de Volume: {importVolumeStats.metricChange}%</p>
          <p>Variação de Dispendio: {importRevenueStats.metricChange}%</p>
          <p>Variação de Preço Médio: {importAveragePriceStats.averagePriceChange}%</p>
        </div>
        <div className="card">
          <h2>Exportação</h2>
          <p>Volume Atual: {exportVolumeStats.metric} t</p>
          <p>Dispendio Atual: {exportRevenueStats.metric} US$</p>
          <p>Preço Médio Atual: {exportAveragePriceStats.averagePrice} US$/t</p>
          <p>Variação de Volume: {exportVolumeStats.metricChange}%</p>
          <p>Variação de Dispendio: {exportRevenueStats.metricChange}%</p>
          <p>Variação de Preço Médio: {exportAveragePriceStats.averagePriceChange}%</p>
        </div>
      </div>
    </div>
  );
};

export default CardsGeral;
