import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReducaoPrecoMedio = ({ importData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let statsByCountry = {};

      importData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const key = `${item.pais}-${year}-${month}`;
          if (!statsByCountry[key]) {
            statsByCountry[key] = { totalFOB: 0, totalKG: 0, count: 0 };
          }
          statsByCountry[key].totalFOB += parseFloat(item.total_usd);
          statsByCountry[key].totalKG += parseFloat(item.total_kg);
          statsByCountry[key].count += 1;
        }
      });

      let priceChanges = [];
      Object.keys(statsByCountry).forEach(key => {
        const [country] = key.split('-');
        const { totalFOB, totalKG } = statsByCountry[key];
        const avgPrice = totalKG > 0 ? totalFOB / totalKG : 0;

        if (priceChanges[country]) {
          const lastData = priceChanges[country].pop();
          const lastAvgPrice = lastData.avgPrice;

          if (lastAvgPrice > 0) {
            const percentChange = ((lastAvgPrice - avgPrice) / lastAvgPrice) * 100;

            if (!isNaN(percentChange) && percentChange !== Infinity && percentChange !== -Infinity) {
              priceChanges[country].push({ avgPrice, percentChange });
            }
          }

          priceChanges[country].push(lastData);
        } else {
          priceChanges[country] = [{ avgPrice, percentChange: 0 }];
        }
      });

      let finalData = [];
      Object.keys(priceChanges).forEach(country => {
        let maxChange = priceChanges[country].reduce(
          (max, item) => (item.percentChange < max.percentChange ? item : max),
          { percentChange: Infinity }
        );
        if (maxChange.percentChange < 0 && maxChange.percentChange !== Infinity) {
          finalData.push({ country, percentChange: Math.abs(maxChange.percentChange) });
        }
      });

      finalData.sort((a, b) => b.percentChange - a.percentChange);
      return finalData.slice(0, 10);
    };

    const finalData = processData();
    setChartData({
      labels: finalData.map(v => v.country),
      datasets: [{
        label: 'Redução %PM',
        data: finalData.map(v => v.percentChange),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    });
  }, [importData, startYear, endYear, startMonth, endMonth]);

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
    <div>
      <h2>Maiores reduções do preço médio</h2>
      {chartData ? <Bar ref={chartRef} data={chartData} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default ReducaoPrecoMedio;
