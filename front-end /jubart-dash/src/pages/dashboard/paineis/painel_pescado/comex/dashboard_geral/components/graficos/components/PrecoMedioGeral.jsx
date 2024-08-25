import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os componentes necessários do ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PrecoMedioGeral = ({ selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth, importData, exportData }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });
  const chartRef = useRef(null);

  useEffect(() => {
    if (importData && exportData) {
      const filteredImportData = importData.filter(item =>
        parseInt(item.ano) >= selectedStartYear &&
        parseInt(item.ano) <= selectedEndYear &&
        parseInt(item.mes) >= parseInt(selectedStartMonth) &&
        parseInt(item.mes) <= selectedEndMonth
      );
      const filteredExportData = exportData.filter(item =>
        parseInt(item.ano) >= selectedStartYear &&
        parseInt(item.ano) <= selectedEndYear &&
        parseInt(item.mes) >= parseInt(selectedStartMonth) &&
        parseInt(item.mes) <= selectedEndMonth
      );

      const allYears = Array.from({ length: selectedEndYear - selectedStartYear + 1 }, (_, i) => selectedStartYear + i);

      const calculateAveragePrice = (data, year) => {
        const yearData = data.filter(item => parseInt(item.ano) === year);
        const totalVolume = yearData.reduce((acc, item) => acc + parseFloat(item.total_kg || 0), 0);
        const totalValue = yearData.reduce((acc, item) => acc + parseFloat(item.total_usd || 0), 0);
        return totalVolume > 0 ? totalValue / totalVolume : 0;
      };

      const precoMedioImportacao = allYears.map(year => calculateAveragePrice(filteredImportData, year));
      const precoMedioExportacao = allYears.map(year => calculateAveragePrice(filteredExportData, year));

      setData({
        labels: allYears,
        datasets: [
          {
            label: 'Preço Médio de Importação (US$)',
            data: precoMedioImportacao,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.1
          },
          {
            label: 'Preço Médio de Exportação (US$)',
            data: precoMedioExportacao,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            tension: 0.1
          }
        ]
      });
    }
  }, [selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth, importData, exportData]);

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
            const value = tooltipItem.raw;
            return `${tooltipItem.dataset.label}: ${value.toLocaleString('pt-BR', {
              minimumFractionDigits: 4,
              maximumFractionDigits: 5
            })}`;
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
        type: 'linear',
        min: selectedStartYear,
        max: selectedEndYear,
        ticks: {
          stepSize: 2,
          callback: (value) => value.toString(),
        },
        grid: {
          display: true,
        },
        title: {
          display: true,
          text: 'Ano'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Preço Médio (US$/kg)'
        },
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return value.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 5 });
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
      clonedCtx.fillText('Média dos Preços Anuais de Comércio Exterior', clonedCanvas.width / 2, 30);

      // Redesenha o gráfico original no canvas clonado, ajustado para baixo
      clonedCtx.drawImage(canvas, 0, 50);

      // Converte o canvas clonado para uma imagem PNG
      const chartImage = clonedCanvas.toDataURL('image/png');

      // Inicia o download da imagem
      const link = document.createElement('a');
      link.href = chartImage;
      link.download = 'MediaAnualPrecosComEx.png';
      link.click();
    }
  };

  return (
    <div>
      <h2>Média dos Preços Anuais de Comércio Exterior</h2>
      <Line ref={chartRef} data={data} options={options} />
      <button onClick={downloadChart}>Clique aqui para baixar o gráfico</button>
    </div>
  );
};

export default PrecoMedioGeral;
