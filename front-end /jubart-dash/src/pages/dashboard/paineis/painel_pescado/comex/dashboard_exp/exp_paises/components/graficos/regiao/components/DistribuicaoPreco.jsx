import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistribuicaoPreco = ({ exportData, startYear, endYear, startMonth, endMonth }) => {
  const [data, setData] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      const countryValues = {};

      exportData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const country = item.pais;
          const value = parseFloat(item.total_usd || 0);

          countryValues[country] = (countryValues[country] || 0) + value;
        }
      });

      const total = Object.values(countryValues).reduce((acc, curr) => acc + curr, 0);
      setTotalValue(total);

      const sortedCountries = Object.keys(countryValues).sort((a, b) => countryValues[b] - countryValues[a]);
      const topCountries = sortedCountries.slice(0, 5);
      const otherCountriesValue = sortedCountries.slice(5).reduce((acc, country) => acc + countryValues[country], 0);

      const labels = [...topCountries, 'Outros'];
      const values = topCountries.map(country => countryValues[country]).concat(otherCountriesValue);

      setData({
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
      });
    };

    processData();
  }, [exportData, startYear, endYear, startMonth, endMonth]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: tooltipItem => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            const percentage = ((value / totalValue) * 100).toFixed(2) + '%';
            return `${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })} (${percentage})`;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>Distribuição por países em US$</h2>
      {data ? <Pie ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default DistribuicaoPreco;
