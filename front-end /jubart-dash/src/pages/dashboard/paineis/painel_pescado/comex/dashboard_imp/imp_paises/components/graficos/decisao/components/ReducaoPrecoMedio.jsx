import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReducaoPrecoMedio = ({ importData, startYear, endYear, startMonth, endMonth, selectedCountry, isIndividual }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar a expansão

  useEffect(() => {
    const processData = () => {
      let statsByUF = {};

      importData.forEach(item => {
        if (isIndividual && item.pais !== selectedCountry) return; // Filtra pelo país selecionado, se for visão individual

        const year = parseInt(item.ano);
        const month = parseInt(item.mes);
        const uf = item.estado || 'Outros';

        if (year >= startYear - 1 && year <= endYear && month >= startMonth && month <= endMonth) {
          const totalFOB = parseFloat(item.total_usd);
          const totalKG = parseFloat(item.total_kg);

          if (!statsByUF[uf]) {
            statsByUF[uf] = {};
          }

          if (!statsByUF[uf][year]) {
            statsByUF[uf][year] = {};
          }

          if (!statsByUF[uf][year][month]) {
            statsByUF[uf][year][month] = { totalFOB: 0, totalKG: 0 };
          }

          statsByUF[uf][year][month].totalFOB += totalFOB;
          statsByUF[uf][year][month].totalKG += totalKG;
        }
      });

      let priceChanges = {};

      Object.keys(statsByUF).forEach(uf => {
        Object.keys(statsByUF[uf]).forEach(year => {
          year = parseInt(year);
          const nextYear = year + 1;

          if (statsByUF[uf][nextYear]) {
            Object.keys(statsByUF[uf][year]).forEach(month => {
              if (statsByUF[uf][nextYear][month]) {
                const currentAvgPrice = statsByUF[uf][nextYear][month].totalKG > 0 
                  ? statsByUF[uf][nextYear][month].totalFOB / statsByUF[uf][nextYear][month].totalKG 
                  : 0;
                const previousAvgPrice = statsByUF[uf][year][month].totalKG > 0 
                  ? statsByUF[uf][year][month].totalFOB / statsByUF[uf][year][month].totalKG 
                  : 0;

                if (previousAvgPrice > 0) {
                  const percentChange = ((previousAvgPrice - currentAvgPrice) / previousAvgPrice) * 100;

                  if (!isNaN(percentChange) && percentChange < 0) { // Apenas considerar reduções
                    priceChanges[uf] = Math.abs(percentChange); // Armazena a redução como número positivo
                  }
                }
              }
            });
          }
        });
      });

      const sortedData = Object.entries(priceChanges)
        .map(([uf, percentChange]) => ({ uf, percentChange }))
        .sort((a, b) => b.percentChange - a.percentChange);

      return sortedData.slice(0, 10); // Limitar às 10 maiores reduções
    };

    const finalData = processData();

    setChartData({
      labels: finalData.map(data => data.uf),
      datasets: [{
        label: 'Redução %PM',
        data: finalData.map(data => data.percentChange),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    });
  }, [importData, startYear, endYear, startMonth, endMonth, selectedCountry, isIndividual]);

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;

      // Definir fundo branco
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
      clonedCtx.drawImage(canvas, 0, 0);

      const imageURL = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ReducaoPrecoMedio_${selectedCountry || 'Geral'}.png`;
      link.href = imageURL;
      link.click();
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'end'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'UFs'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Redução %PM'
        },
        ticks: {
          callback: function (value) {
            return `${value.toFixed(2)}%`;
          }
        }
      }
    }
  };

  return (
    <div className={`grafico ${isExpanded ? 'expanded' : ''}`}>
      <h2>{isIndividual ? `Maiores Reduções do Preço Médio por UF - ${selectedCountry}` : 'Maiores Reduções do Preço Médio por UF - Geral'}</h2>
      {chartData ? (
        <>
          <Bar ref={chartRef} data={chartData} options={options} />
          <div className="grafico-buttons">
            <button onClick={downloadChart} style={{ marginTop: '10px' }}>Baixar Gráfico</button>
            <button onClick={() => setIsExpanded(!isExpanded)} style={{ marginTop: '10px' }}>
              {isExpanded ? 'Fechar' : 'Expandir'}
            </button>
          </div>
        </>
      ) : (
        <div>Carregando...</div>
      )}
    </div>
  );
};

export default ReducaoPrecoMedio;
