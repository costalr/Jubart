import React, { useEffect, useState, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const VariacaoPercentualVolumeAbsoluto = ({ exportData }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let stateData = {};
      let scatterData = [];

      exportData.forEach(item => {
        const year = parseInt(item.ano);
        const volume = parseFloat(item.total_kg || 0); // Removido o "month"

        if (year === 2024) {
          const state = item.estado;

          if (stateData[state]) {
            const previousVolume = stateData[state].lastVolume;

            if (previousVolume > 0) {
              const variacaoPercentual = ((volume - previousVolume) / previousVolume) * 100;
              scatterData.push({ x: volume, y: variacaoPercentual, label: state });
            }
          }

          stateData[state] = { lastVolume: volume };
        }
      });

      return scatterData;
    };

    const scatterData = processData();

    setData({
      datasets: [{
        label: 'Variação Percentual x Volume Absoluto',
        data: scatterData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 3,
        type: 'scatter'
      }]
    });
  }, [exportData]);

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Volume Absoluto (kg)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Variação Percentual (%)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.label}: ${context.raw.x.toLocaleString()} kg, ${context.raw.y.toFixed(2)}%`
        }
      }
    }
  };

  return (
    <div>
      <h2>Análise de Variação Percentual e Volume Absoluto por Estado para 2024</h2>
      {data ? <Scatter ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default VariacaoPercentualVolumeAbsoluto;
