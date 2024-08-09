import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os componentes necessários do ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VolumeGeral = ({ selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth, importData, exportData }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (importData && exportData) {
      const filteredImportData = importData.filter(item =>
        parseInt(item.year) >= selectedStartYear &&
        parseInt(item.year) <= selectedEndYear &&
        parseInt(item.monthNumber) >= parseInt(selectedStartMonth) &&
        parseInt(item.monthNumber) <= selectedEndMonth
      );
      const filteredExportData = exportData.filter(item =>
        parseInt(item.year) >= selectedStartYear &&
        parseInt(item.year) <= selectedEndYear &&
        parseInt(item.monthNumber) >= parseInt(selectedStartMonth) &&
        parseInt(item.monthNumber) <= selectedEndMonth
      );

      const calculateTotalVolume = (data, year) => {
        const yearData = data.filter(item => parseInt(item.year) === year);
        return yearData.reduce((acc, item) => acc + parseFloat(item.metricKG || 0), 0);
      };

      const allYears = Array.from({ length: selectedEndYear - selectedStartYear + 1 }, (_, i) => selectedStartYear + i);

      const volumeImportacao = allYears.map(year => calculateTotalVolume(filteredImportData, year));
      const volumeExportacao = allYears.map(year => calculateTotalVolume(filteredExportData, year));

      setData({
        labels: allYears,
        datasets: [
          {
            label: 'Volume de Importação (toneladas)',
            data: volumeImportacao,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.1
          },
          {
            label: 'Volume de Exportação (toneladas)',
            data: volumeExportacao,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            tension: 0.1
          }
        ]
      });
    }
  }, [selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth, importData, exportData]);

  if (!data) {
    return <div>Carregando dados...</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        align: 'start',
        title: {
          display: true,
          text: 'Variáveis',
          color: 'grey' 
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()} toneladas`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ano'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        title: {
          display: true,
          text: 'Toneladas'
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: Math.max(...data.datasets[0].data.concat(data.datasets[1].data)) + 100000,
          stepSize: 100000, 
          callback: function (value) {
            return `${Math.round(value / 1000000)}k`; 
          }
        }
      }
    }
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
  
      // Cria uma cópia do canvas para aplicar o fundo branco
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');
      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50; // Adiciona espaço para o título no topo
  
      // Aplica o fundo branco
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

      // Desenha o título no topo do gráfico
      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText('Volumes Anuais de Comércio Exterior', clonedCanvas.width / 2, 30);
  
      // Redesenha o gráfico original no canvas clonado, ajustado para baixo
      clonedCtx.drawImage(canvas, 0, 50);
  
      // Converte o canvas clonado para uma imagem PNG
      const chartImage = clonedCanvas.toDataURL('image/png');
  
      // Inicia o download da imagem
      const link = document.createElement('a');
      link.href = chartImage;
      link.download = 'VolumesAnuaisComEx.png';
      link.click();
    }
  };

  return (
    <div>
      <h2>Volumes Anuais de Comércio Exterior</h2>
      <Line ref={chartRef} data={data} options={options} />
      <button onClick={downloadChart}>Clique aqui para baixar o gráfico</button>
    </div>
  );
};

export default VolumeGeral;
