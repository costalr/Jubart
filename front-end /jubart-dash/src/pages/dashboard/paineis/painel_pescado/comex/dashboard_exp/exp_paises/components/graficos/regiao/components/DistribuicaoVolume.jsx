import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistribuicaoVolume = ({ exportData, startYear, endYear, startMonth, endMonth }) => {
  const [data, setData] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      const countryVolumes = {};

      exportData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const country = item.pais;
          const volume = parseFloat(item.total_kg || 0);

          countryVolumes[country] = (countryVolumes[country] || 0) + volume;
        }
      });

      const total = Object.values(countryVolumes).reduce((acc, curr) => acc + curr, 0);
      setTotalVolume(total);

      const sortedCountries = Object.keys(countryVolumes).sort((a, b) => countryVolumes[b] - countryVolumes[a]);
      const topCountries = sortedCountries.slice(0, 5);
      const otherCountriesVolume = sortedCountries.slice(5).reduce((acc, country) => acc + countryVolumes[country], 0);

      const labels = [...topCountries, 'Outros'];
      const volumes = topCountries.map(country => countryVolumes[country]).concat(otherCountriesVolume);

      setData({
        labels,
        datasets: [{
          label: 'Distribuição por países em Kg',
          data: volumes,
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
            const percentage = ((value / totalVolume) * 100).toFixed(2) + '%';
            return `${label}: ${value.toLocaleString()} Kg (${percentage})`;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>Distribuição por países em Kg</h2>
      {data ? <Pie ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default DistribuicaoVolume;
