import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PrecoMedioCumulativo = ({ startYear, endYear, startMonth, endMonth, exportData }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const filteredData = exportData.filter(item =>
          parseInt(item.ano) >= startYear &&
          parseInt(item.ano) <= endYear &&
          item.total_kg !== 'NaN' && 
          item.total_usd !== 'NaN' &&
          parseInt(item.mes) >= startMonth &&
          parseInt(item.mes) <= endMonth
        );

        const yearlyData = filteredData.reduce((acc, curr) => {
          const year = curr.ano;
          acc[year] = acc[year] || { totalVolume: 0, totalValue: 0 };
          acc[year].totalVolume += parseFloat(curr.total_kg || 0);
          acc[year].totalValue += parseFloat(curr.total_usd || 0);
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
  }, [startYear, endYear, startMonth, endMonth, exportData]);

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
              return '';
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
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
        
        }
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Preço Médio (US$/Kg)',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 0.5,
          suggestedMax: 7.0, // Ajuste do valor máximo sugerido
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
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

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50;

      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText('Preço Médio Cumulativo de Importação', clonedCanvas.width / 2, 30);

      clonedCtx.drawImage(canvas, 0, 50);

      const chartImage = clonedCanvas.toDataURL('image/png');

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

export default PrecoMedioCumulativo;
