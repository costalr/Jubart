import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistribuicaoPrecoImp = ({ startYear, endYear, startMonth, endMonth, importData }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const chartRef = useRef(null);  // Assegure-se que a ref está sendo usada

  useEffect(() => {
    try {
      const countryValues = {};
      importData.forEach(item => {
        // Converta os valores para números para garantir uma comparação correta
        const year = parseInt(item.year, 10);
        const month = parseInt(item.monthNumber, 10);
      
        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const country = item.country;
          const value = parseFloat(item.metricFOB || 0);
          countryValues[country] = (countryValues[country] || 0) + value;
        }
      });
      
  
      console.log("Country Values: ", countryValues);
  
      const sortedCountries = Object.keys(countryValues).sort((a, b) => countryValues[b] - countryValues[a]);
      console.log("Sorted Countries: ", sortedCountries);
  
      const topCountries = sortedCountries.slice(0, 5);
      console.log("Top Countries: ", topCountries);
  
      const otherCountriesValue = sortedCountries.slice(5).reduce((acc, country) => acc + countryValues[country], 0);
      console.log("Other Countries Value: ", otherCountriesValue);
  
      const total = Object.values(countryValues).reduce((acc, curr) => acc + curr, 0);
      console.log("Total Value: ", total);
      setTotalValue(total);
  
      const labels = [...topCountries, 'Outros'];
      const values = topCountries.map(country => countryValues[country]).concat(otherCountriesValue);
  
      const chartData = {
        labels,
        datasets: [{
          label: 'Distribuição por países em US$',
          data: values,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(201, 203, 207, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)', 'rgba(201, 203, 207, 1)'
          ],
          borderWidth: 1
        }]
      };
  
      console.log("Final Chart Data: ", chartData);
      setData(chartData);
    } catch (err) {
      console.error('Erro ao processar os dados:', err);
      setError(err);
    }
  }, [startYear, endYear, startMonth, endMonth, importData]);
  

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');
      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
      clonedCtx.drawImage(canvas, 0, 0);
      const imageURL = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'grafico-preco-distribuicao.png';
      link.href = imageURL;
      link.click();
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Distribuição por países em US$', align: 'start' },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const value = tooltipItem.raw;
            const percentage = ((value / totalValue) * 100).toFixed(2) + '%';
            return `${tooltipItem.label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })} (${percentage})`;
          }
        }
      }
    }
  };

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>Distribuição por países em US$</h2>
      {data ? <Pie ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
      <button onClick={downloadChart} style={{ marginTop: '10px' }}>Clique aqui para baixar o gráfico!</button>
    </div>
  );
};

export default DistribuicaoPrecoImp;

