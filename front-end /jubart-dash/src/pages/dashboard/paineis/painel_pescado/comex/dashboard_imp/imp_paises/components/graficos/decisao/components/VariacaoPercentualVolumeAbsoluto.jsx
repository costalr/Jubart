import React, { useEffect, useState, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const VariacaoPercentualVolumeAbsoluto = ({ importData }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = (importData) => {
      let countryData = {};
      let scatterData = [];

      importData.forEach(item => {
        const year = parseInt(item.ano);
        const monthNumber = parseInt(item.mes);
        const volume = parseFloat(item.total_kg || 0);

        if (!isNaN(year) && !isNaN(monthNumber) && !isNaN(volume) && year === 2024) {
          const country = item.pais;
          
          if (countryData.hasOwnProperty(country)) {
            const previousVolume = countryData[country].lastVolume;
            
            if (previousVolume > 0) { // Evitar divisão por zero
              const variacaoPercentual = ((volume - previousVolume) / previousVolume) * 100;
              scatterData.push({ x: volume, y: variacaoPercentual, label: country });
            }
          }

          countryData[country] = { lastVolume: volume };
        }
      });

      return scatterData;
    };

    const scatterData = processData(importData);

    setData({
      datasets: [{
        label: 'Variação Percentual x Volume Absoluto',
        data: scatterData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 3 // Reduzir o tamanho das bolinhas
      }]
    });
  }, [importData]);

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

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;

      // Set background to white
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
      clonedCtx.drawImage(canvas, 0, 0);

      const imageURL = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'VariacaoPercentualVolume.png';
      link.href = imageURL;
      link.click();
    }
  };

  return (
    <div>
      <h2>Análise de Variação Percentual e Volume Absoluto para 2024</h2>
      {data ? (
        <>
          <Scatter ref={chartRef} data={data} options={options} />
          <button onClick={downloadChart}>Baixar Gráfico</button>
        </>
      ) : <div>Carregando...</div>}
    </div>
  );
};

export default VariacaoPercentualVolumeAbsoluto;
