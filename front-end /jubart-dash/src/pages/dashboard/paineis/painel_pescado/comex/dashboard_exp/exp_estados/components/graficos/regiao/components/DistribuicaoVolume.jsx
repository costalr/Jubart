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
      const stateVolumes = {};

      exportData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const state = item.estado;
          const volume = parseFloat(item.total_kg || 0);

          stateVolumes[state] = (stateVolumes[state] || 0) + volume;
        }
      });

      const total = Object.values(stateVolumes).reduce((acc, curr) => acc + curr, 0);
      setTotalVolume(total);

      const sortedStates = Object.keys(stateVolumes).sort((a, b) => stateVolumes[b] - stateVolumes[a]);
      const topStates = sortedStates.slice(0, 5);
      const otherStatesVolume = sortedStates.slice(5).reduce((acc, state) => acc + stateVolumes[state], 0);

      const labels = [...topStates, 'Outros'];
      const volumes = topStates.map(state => stateVolumes[state]).concat(otherStatesVolume);

      setData({
        labels,
        datasets: [{
          label: 'Distribuição por estados em Kg',
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
      <h2>Distribuição por estados em Kg</h2>
      {data ? <Pie ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default DistribuicaoVolume;
