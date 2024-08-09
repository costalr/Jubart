import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar componentes necessários do ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PrecoMedioCumulativoImp = ({ startYear, endYear, startMonth, endMonth, importData }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);  // Referência para acessar o canvas do gráfico

  useEffect(() => {
    const loadData = async () => {
      try {
        const filteredData = importData.filter(item =>
          parseInt(item.year) >= startYear &&
          parseInt(item.year) <= endYear &&
          item.metricKG !== 'NaN' && 
          item.metricFOB !== 'NaN' &&
          parseInt(item.monthNumber) >= startMonth &&
          parseInt(item.monthNumber) <= endMonth
        );

        const yearlyData = filteredData.reduce((acc, curr) => {
          const year = curr.year;
          acc[year] = acc[year] || { totalVolume: 0, totalValue: 0 };
          acc[year].totalVolume += parseFloat(curr.metricKG || 0); // Usa 0 se NaN
          acc[year].totalValue += parseFloat(curr.metricFOB || 0); // Usa 0 se NaN
          return acc;
        }, {});

        const years = Object.keys(yearlyData).sort();
        const volumes = years.map(year => yearlyData[year].totalVolume);
        const values = years.map(year => yearlyData[year].totalValue);
        const prices = years.map(year => (yearlyData[year].totalVolume ? yearlyData[year].totalValue / yearlyData[year].totalVolume : 0));

        setData({
          labels: years.map(year => year.toString()),
          datasets: [
            {
              type: 'bar',
              label: 'Kg',
              data: volumes,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              yAxisID: 'y',
            },
            {
              type: 'bar',
              label: 'US$',
              data: values,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              yAxisID: 'y1',
            },
            {
              type: 'line',
              label: 'Preço Médio',
              data: prices,
              borderColor: 'rgba(53, 162, 235, 1)',
              yAxisID: 'y2',
              pointRadius: 3,
            }
          ]
        });
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        setError(error);
      }
    };

    loadData();
  }, [startYear, endYear, startMonth, endMonth, importData]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ano'
        },
        ticks: {
          callback: function(val, index) {
            // Mostra apenas os anos com intervalo de 2 anos
            return index % 2 === 0 ? this.getLabelForValue(val) : '';
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Valor (US$)'
        },
        ticks: {
          callback: (value) => {
            if (value >= 1e9) {
              return `${(value / 1e9).toFixed(1)}B`;
            } else {
              return ''; // Hide values in millions
            }
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: false,
        },
        ticks: {
          callback: (value) => {
            if (value >= 1e6) {
              return `${(value / 1e9).toFixed(1)}B`;
            } else {
              return ''; // Hide values less than 1 million
            }
          }
        }
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Preço Médio (US$/Kg)'
        },
        ticks: {
          stepSize: 0.5, // Configura a granularidade de 0.5
          suggestedMax: 5.5, // Define o máximo sugerido para o preço médio
        }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'start',
        title: {
          display: true,
          text: 'Variáveis',
          color: 'grey'
        },
        labels: {
          boxWidth: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let label = tooltipItem.dataset.label;
            let value = tooltipItem.raw;
            if (label === 'US$') {
              value = `${(value / 1e6).toFixed(2)}M US$`;
            } else if (label === 'Kg') {
              value = `${(value / 1e3).toFixed(2)}k kg`;
            } else {
              value = `${value.toFixed(2)} US$/kg`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  
  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');
  
      // Define o tamanho do canvas clonado para igualar o original
      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50; // Adiciona espaço para o título no topo
  
      // Aplica o fundo branco
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
  
      // Desenha o título no topo do gráfico
      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText('Preço Médio Cumulativo de Importação', clonedCanvas.width / 2, 30);
  
      // Redesenha o gráfico original no canvas clonado, ajustado para baixo
      clonedCtx.drawImage(canvas, 0, 50);
  
      // Converte o canvas clonado para uma imagem PNG
      const chartImage = clonedCanvas.toDataURL('image/png');
  
      // Inicia o download da imagem
      const link = document.createElement('a');
      link.href = chartImage;
      link.download = 'PrecoMedioCumulativoImportacao.png';
      link.click();
    }
  };
  


  if (error) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <div>
      <h2>Preço Médio Cumulativo de Importação</h2>
      {data ? <Bar ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
      <button onClick={downloadChart}>Download do Gráfico</button>
    </div>
  );
};

export default PrecoMedioCumulativoImp;
