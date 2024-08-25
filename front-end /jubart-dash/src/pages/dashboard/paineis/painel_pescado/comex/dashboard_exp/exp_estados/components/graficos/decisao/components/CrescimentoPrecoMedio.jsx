import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CrescimentoPrecoMedio = ({ exportData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let statsByState = {};

      exportData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const key = `${item.estado}-${year}-${month}`;
          if (!statsByState[key]) {
            statsByState[key] = { totalFOB: 0, totalKG: 0 };
          }
          statsByState[key].totalFOB += parseFloat(item.total_usd);
          statsByState[key].totalKG += parseFloat(item.total_kg);
        }
      });

      let priceChanges = [];
      Object.keys(statsByState).forEach(key => {
        const [state, year, month] = key.split('-');
        const { totalFOB, totalKG } = statsByState[key];
        const avgPrice = totalKG > 0 ? totalFOB / totalKG : 0;

        if (priceChanges[state]) {
          const lastData = priceChanges[state].pop();
          const lastAvgPrice = lastData.avgPrice;
          const percentChange = ((avgPrice - lastAvgPrice) / lastAvgPrice) * 100;

          priceChanges[state].push(lastData);
          if (percentChange > 0) {
            priceChanges[state].push({ year, month, avgPrice, percentChange });
          }
        } else {
          priceChanges[state] = [{ year, month, avgPrice, percentChange: 0 }];
        }
      });

      let finalData = [];
      Object.keys(priceChanges).forEach(state => {
        let maxChange = priceChanges[state].reduce((max, item) => item.percentChange > max.percentChange ? item : max, { percentChange: -Infinity });
        if (maxChange.percentChange > 0) {
          finalData.push({ state, percentChange: maxChange.percentChange });
        }
      });

      finalData.sort((a, b) => b.percentChange - a.percentChange);
      return finalData.slice(0, 10);
    };

    const finalData = processData();
    setChartData({
      labels: finalData.map(v => v.state),
      datasets: [{
        label: 'Crescimento %PM',
        data: finalData.map(v => v.percentChange),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
          text: 'Estados'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Crescimento %PM'
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
      <h2>Maiores crescimentos do preço médio por Estado</h2>
      {chartData ? <Bar ref={chartRef} data={chartData} options={options} /> : <div>Carregando...</div>}
    </div>
  );
};

export default CrescimentoPrecoMedio;
