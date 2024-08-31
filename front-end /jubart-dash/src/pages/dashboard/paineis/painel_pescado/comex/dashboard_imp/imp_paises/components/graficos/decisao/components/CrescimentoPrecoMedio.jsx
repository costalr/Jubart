import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CrescimentoPrecoMedio = ({ importData, startYear, endYear, startMonth, endMonth, selectedCountry, isIndividual }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let statsByUF = {};

      importData.forEach(({ estado, total_usd, total_kg, ano, mes, pais }) => {
        if (isIndividual && pais !== selectedCountry) return; // Filtra pelos dados do país selecionado se for visão individual

        const year = parseInt(ano);
        const month = parseInt(mes);
        const totalFOB = parseFloat(total_usd);
        const totalKG = parseFloat(total_kg);

        if (year >= startYear - 1 && year <= endYear && month >= startMonth && month <= endMonth) {
          const currentPrice = totalKG > 0 ? totalFOB / totalKG : 0;

          if (!statsByUF[estado]) {
            statsByUF[estado] = {};
          }

          if (!statsByUF[estado][year]) {
            statsByUF[estado][year] = {};
          }

          statsByUF[estado][year][month] = currentPrice;
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
                const currentPrice = statsByUF[uf][nextYear][month];
                const previousPrice = statsByUF[uf][year][month];

                if (previousPrice > 0) {
                  const percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;

                  if (!isNaN(percentChange) && percentChange > 0) { // Considera apenas crescimentos
                    if (!priceChanges[uf]) {
                      priceChanges[uf] = [];
                    }
                    priceChanges[uf].push(percentChange);
                  }
                }
              }
            });
          }
        });
      });

      const finalChanges = Object.entries(priceChanges).map(([uf, changes]) => ({
        uf,
        avgChange: changes.reduce((sum, change) => sum + change, 0) / changes.length,
      }));

      const sortedData = finalChanges.sort((a, b) => b.avgChange - a.avgChange).slice(0, 10);

      return sortedData;
    };

    const finalData = processData();

    setChartData({
      labels: finalData.map(data => data.uf),
      datasets: [{
        label: 'Crescimento %PM',
        data: finalData.map(data => data.avgChange),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    });
  }, [importData, startYear, endYear, startMonth, endMonth, selectedCountry, isIndividual]);

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
          text: 'Variação %PM'
        },
        ticks: {
          callback: function (value) {
            return `${value.toFixed(2)}%`;
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
      clonedCanvas.height = canvas.height;

      // Define fundo branco
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
      clonedCtx.drawImage(canvas, 0, 0);

      const imageURL = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `CrescimentoPrecoMedio_${selectedCountry || 'Geral'}.png`;
      link.href = imageURL;
      link.click();
    }
  };

  return (
    <div>
      <h2>{isIndividual ? `Maiores Crescimentos do Preço Médio por UF - ${selectedCountry}` : 'Maiores Crescimentos do Preço Médio por UF - Geral'}</h2>
      {chartData ? (
        <>
          <Bar ref={chartRef} data={chartData} options={options} />
          <button onClick={downloadChart} style={{ marginTop: '10px' }}>Baixar Gráfico</button>
        </>
      ) : (
        <div>Carregando...</div>
      )}
    </div>
  );
};

export default CrescimentoPrecoMedio;
