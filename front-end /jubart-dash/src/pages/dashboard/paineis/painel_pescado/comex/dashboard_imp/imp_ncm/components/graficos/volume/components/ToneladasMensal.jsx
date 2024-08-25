import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ToneladasMensal = ({ importData }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      const filteredData = importData.filter(d => parseInt(d.year) >= 2021 && parseInt(d.year) <= 2024);
      const structuredData = {};

      filteredData.forEach(item => {
        const year = item.year.toString();
        const monthIndex = parseInt(item.monthNumber) - 1;
        if (!structuredData[year]) {
          structuredData[year] = Array(12).fill(0);
        }
        structuredData[year][monthIndex] += parseFloat(item.metricKG);
      });

      const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const datasets = Object.keys(structuredData).map(year => ({
        label: year,
        data: structuredData[year],
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        borderWidth: 1
      }));

      setData({
        labels,
        datasets
      });
    };

    processData();
  }, [importData]);

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50; // Adds space for the title

      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText('Histórico Mensal de Toneladas 2021 a 2024', clonedCanvas.width / 2, 30);

      clonedCtx.drawImage(canvas, 0, 50);

      const url = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'ToneladasMensais2021a2024.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div>
      <h2>Histórico Mensal de Toneladas 2021 a 2024</h2>
      {data ? (
        <>
          <Bar ref={chartRef} data={data} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Toneladas'
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
          <button onClick={downloadChart} style={{ marginTop: '10px' }}>Download do Gráfico</button>
        </>
      ) : <p>Carregando dados...</p>}
    </div>
  );
};

export default ToneladasMensalImp;
