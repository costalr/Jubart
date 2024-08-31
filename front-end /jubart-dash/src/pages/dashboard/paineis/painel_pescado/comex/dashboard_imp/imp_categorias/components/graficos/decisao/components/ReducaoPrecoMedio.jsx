import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReducaoPrecoMedio = ({ importData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let categoryData = {};

      importData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);
        const volume = parseFloat(item.total_kg || 0);
        const fob = parseFloat(item.total_usd || 0);
        const avgPrice = volume > 0 ? fob / volume : 0;

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          const category = item.categoria;

          if (!categoryData[category]) {
            categoryData[category] = { previousAvgPrice: 0, currentAvgPrice: 0, reduction: 0 };
          }

          categoryData[category].previousAvgPrice = categoryData[category].currentAvgPrice;
          categoryData[category].currentAvgPrice = avgPrice;

          if (categoryData[category].previousAvgPrice > 0) {
            categoryData[category].reduction = ((categoryData[category].previousAvgPrice - categoryData[category].currentAvgPrice) / categoryData[category].previousAvgPrice) * 100;
          }
        }
      });

      const sortedCategories = Object.keys(categoryData).sort((a, b) => categoryData[b].reduction - categoryData[a].reduction).slice(0, 10);
      const labels = sortedCategories.map(category => category);
      const reductionData = sortedCategories.map(category => categoryData[category].reduction);

      setChartData({
        labels,
        datasets: [{
          label: 'Redução %PM',
          data: reductionData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      });
    };

    processData();
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
          text: 'Categorias'
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
      <h2>Maiores Reduções do Preço Médio por Categorias</h2>
      {chartData ? (
        <>
          <Bar ref={chartRef} data={chartData} options={options} />
        </>
      ) : <div>Carregando...</div>}
    </div>
  );
};

export default ReducaoPrecoMedio;
