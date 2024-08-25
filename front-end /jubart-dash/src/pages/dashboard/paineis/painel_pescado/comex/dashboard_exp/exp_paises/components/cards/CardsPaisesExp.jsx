import React from 'react';
import './CardsPaisesExp.css';

const CardsPaisesExp = ({ exportData, referenceMonth, referenceYear }) => {
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Calcula as métricas de exportação baseadas no ano e mês de referência
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
    <div className="exp-cards-container">
      <h1>Painel de Exportação - {monthNames[referenceMonth - 1]} de {referenceYear}</h1>
      <div className="cards-container">
        <div className="card">
          <h2>Exportação</h2>
          <p>Volume de Exportação: {metrics.volume} t</p>
          <p>Receita de Exportação: {metrics.revenue} US$</p>
          <p>Preço Médio de Exportação: {metrics.averagePrice} US$/t</p>
          <p>Variação de Volume: {metrics.volumeChange}%</p>
          <p>Variação de Receita: {metrics.revenueChange}%</p>
          <p>Variação de Preço Médio: {metrics.averagePriceChange}%</p>
        </div>
      </div>
    </div>
  );
};

export default CardsPaisesExp;
