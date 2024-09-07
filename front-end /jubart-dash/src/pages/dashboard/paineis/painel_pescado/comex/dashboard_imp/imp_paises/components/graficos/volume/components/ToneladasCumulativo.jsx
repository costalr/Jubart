import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ToneladasCumulativasImp = ({ importData, isIndividual = false, startYear, endYear, startMonth, endMonth }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar a expansão

  useEffect(() => {
    if (!importData) return;

    const processData = () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const filterStartYear = isIndividual ? currentYear - 5 : startYear;
      const filterEndYear = isIndividual ? currentYear : endYear;

      const monthlyData = {};

      for (let year = filterStartYear; year <= filterEndYear; year++) {
        monthlyData[year] = Array(12).fill(0);
      }

      importData.forEach(item => {
        const year = parseInt(item.ano, 10);
        const month = parseInt(item.mes, 10);
        if (year >= filterStartYear && year <= filterEndYear) {
          monthlyData[year][month - 1] += parseFloat(item.total_kg) || 0;
        }
      });

      const cumulativeData = {};
      Object.keys(monthlyData).forEach(year => {
        let cumulative = 0;
        cumulativeData[year] = monthlyData[year].map((kg, index) => {
          cumulative += kg;
          return cumulative;
        }).filter((value, index) => (year < currentYear) || (index + 1 <= currentMonth));
      });

      return cumulativeData;
    };

    const cumulativeData = processData();

    const yearsToDisplay = Object.keys(cumulativeData);

    const monthLabels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('pt-BR', { month: 'long' }));
    const datasets = yearsToDisplay.map(year => ({
      label: year.toString(),
      data: cumulativeData[year],
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
      fill: false,
      tension: 0.1
    }));

    setData({
      labels: monthLabels,
      datasets
    });
  }, [importData, isIndividual, startYear, endYear, startMonth, endMonth]);

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
      clonedCtx.fillText(
        `Toneladas Cumulativas de Importação ${isIndividual ? `${new Date().getFullYear() - 5} a ${new Date().getFullYear()}` : `${startYear} a ${endYear}`}`,
        clonedCanvas.width / 2,
        30
      );

      clonedCtx.drawImage(canvas, 0, 50);

      const url = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ToneladasCumulativas${isIndividual ? `${new Date().getFullYear() - 5}a${new Date().getFullYear()}` : `${startYear}a${endYear}`}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className={`grafico ${isExpanded ? 'expanded' : ''}`}> {/* Classe condicional para controlar a expansão */}
      <h2>Toneladas Cumulativas {isIndividual ? `${new Date().getFullYear() - 5} a ${new Date().getFullYear()}` : `${startYear} a ${endYear}`}</h2>
      {data ? (
        <>
          <Line ref={chartRef} data={data} options={{
            responsive: true,
            scales: {
              y: {
                type: 'linear',
                display: true,
                title: {
                  display: true,
                  text: 'Toneladas'
                },
                ticks: {
                  callback: value => `${(value / 1000).toLocaleString()}k`
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Mês'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} toneladas`
                }
              }
            }
          }} />
          <div className="grafico-buttons">
            <button onClick={downloadChart} style={{ marginTop: '10px' }}>Download do Gráfico</button>
            <button onClick={() => setIsExpanded(!isExpanded)} style={{ marginTop: '10px' }}>
              {isExpanded ? 'Fechar' : 'Expandir'}
            </button>
          </div>
        </>
      ) : <p>Carregando dados...</p>}
    </div>
  );
};

export default ToneladasCumulativasImp;
