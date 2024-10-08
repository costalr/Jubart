import React from 'react';
import './CardsCategoriasImp.css';

const CardsCategoriasImp = ({ importData, startYear, endYear, startMonth, endMonth }) => {
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Calcula as métricas de importação baseadas no ano e mês de referência
  const calculateMetrics = (data, startYear, endYear, startMonth, endMonth) => {
    // Filtra os dados conforme o ano e mês selecionados
    const currentYearData = data.filter(d => {
      const year = parseInt(d.ano);
      const month = parseInt(d.mes);
      return year === endYear && month <= endMonth;
    });

    const previousYearData = data.filter(d => {
      const year = parseInt(d.ano);
      const month = parseInt(d.mes);
      return year === (endYear - 1) && month <= endMonth;
    });

    const sumMetrics = (filteredData, metric) => filteredData.reduce((sum, item) => sum + parseFloat(item[metric] || 0), 0);

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

  if (!importData.length) {
    return <div>Loading...</div>;
  }

  const metrics = calculateMetrics(importData, startYear, endYear, startMonth, endMonth);

  return (
    <div className="exp-cards-container">
      <h1>Painel de Importação - {monthNames[endMonth - 1]} de {endYear}</h1>
      <div className="cards-container">
        <div className="card">
          <h2>Importação</h2>
          <p>Volume de Importação: {metrics.volume} t</p>
          <p>Receita de Importação: {metrics.revenue} US$</p>
          <p>Preço Médio de Importação: {metrics.averagePrice} US$/t</p>
          <p>Variação de Volume: {metrics.volumeChange}%</p>
          <p>Variação de Receita: {metrics.revenueChange}%</p>
          <p>Variação de Preço Médio: {metrics.averagePriceChange}%</p>
        </div>
      </div>
    </div>
  );
};

export default CardsCategoriasImp;
