import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ToneladasMensalImp = ({ importData, isIndividual = false, startYear, endYear, startMonth, endMonth }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar a expansão

  useEffect(() => {
    const processData = () => {
      const currentYear = new Date().getFullYear();
      const filteredStartYear = isIndividual ? currentYear - 5 : startYear;
      const filteredEndYear = isIndividual ? currentYear : endYear;

      const filteredData = importData.filter(d => {
        const ano = parseInt(d.ano);
        return ano >= filteredStartYear && ano <= filteredEndYear;
      });

      const structuredData = {};

      // Inicializa com zeros para todos os meses de todos os anos no intervalo
      for (let ano = filteredStartYear; ano <= filteredEndYear; ano++) {
        structuredData[ano.toString()] = Array(12).fill(0);
      }

      // Acumula os valores por mês
      filteredData.forEach(item => {
        const year = item.ano.toString();
        const monthIndex = parseInt(item.mes) - 1;
        structuredData[year][monthIndex] += parseFloat(item.total_kg);
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
  }, [importData, isIndividual, startYear, endYear, startMonth, endMonth]);

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50; // Adiciona espaço para o título

      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText(
        `Histórico Mensal de Toneladas ${isIndividual ? `${new Date().getFullYear() - 5} a ${new Date().getFullYear()}` : `${startYear} a ${endYear}`}`,
        clonedCanvas.width / 2,
        30
      );

      clonedCtx.drawImage(canvas, 0, 50);

      const url = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ToneladasMensais${isIndividual ? `${new Date().getFullYear() - 5}a${new Date().getFullYear()}` : `${startYear}a${endYear}`}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className={`grafico ${isExpanded ? 'expanded' : ''}`}> {/* Classe condicional para controlar a expansão */}
      <h2>Histórico Mensal de Toneladas {isIndividual ? `${new Date().getFullYear() - 5} a ${new Date().getFullYear()}` : `${startYear} a ${endYear}`}</h2>
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

export default ToneladasMensalImp;
