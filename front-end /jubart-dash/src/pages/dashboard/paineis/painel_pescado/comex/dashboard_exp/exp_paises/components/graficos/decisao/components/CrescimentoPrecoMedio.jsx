import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CrescimentoPrecoMedio = ({ exportData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let statsByCountry = {};

      exportData.forEach(({ pais, total_usd, total_kg, ano, mes }) => {
        const year = parseInt(ano);
        const month = parseInt(mes);
        const totalFOB = parseFloat(total_usd);
        const totalKG = parseFloat(total_kg);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const currentPrice = totalKG > 0 ? totalFOB / totalKG : 0;

          if (!statsByCountry[pais]) {
            statsByCountry[pais] = { lastPrice: currentPrice, changes: [] };
          } else {
            const lastPrice = statsByCountry[pais].lastPrice;

            // Verifica se lastPrice é maior que 0 para evitar divisão por zero
            if (lastPrice > 0) {
              const percentChange = ((currentPrice - lastPrice) / lastPrice) * 100;

              if (!isNaN(percentChange) && percentChange !== 0) {
                statsByCountry[pais].changes.push(percentChange);
              }
            }

            statsByCountry[pais].lastPrice = currentPrice;
          }
        }
      });

      let priceChanges = {};

      Object.keys(statsByCountry).forEach(country => {
        if (statsByCountry[country].changes.length > 0) {
          const avgChange = statsByCountry[country].changes.reduce((a, b) => a + b, 0) / statsByCountry[country].changes.length;
          if (avgChange > 0 && !isNaN(avgChange) && avgChange !== Infinity) {
            priceChanges[country] = avgChange;
          }
        }
      });

      const sortedData = Object.entries(priceChanges).map(([country, percentChange]) => ({ country, percentChange }))
        .sort((a, b) => b.percentChange - a.percentChange);

      console.log('Dados finais para o gráfico de crescimento:', sortedData);

      return sortedData.slice(0, 10);
    };

    const finalData = processData();

    setChartData({
      labels: finalData.map(data => data.country),
      datasets: [{
        label: 'Crescimento %PM',
        data: finalData.map(data => data.percentChange),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    });
  }, [exportData, startYear, endYear, startMonth, endMonth]);

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
          text: 'Países'
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

  return (
    <div>
      <h2>Maiores crescimentos do preço médio</h2>
      {chartData ? <Bar ref={chartRef} data={chartData} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default CrescimentoPrecoMedio;
