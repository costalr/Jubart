import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ToneladasMensal = ({ importData, startYear, endYear, startMonth, endMonth }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      const monthlyData = {};

      importData.forEach(item => {
        const year = parseInt(item.ano);
        const month = parseInt(item.mes);
        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          if (!monthlyData[year]) {
            monthlyData[year] = Array(12).fill(0);
          }
          monthlyData[year][month - 1] += parseFloat(item.total_kg);
        }
      });

      return monthlyData;
    };

    const monthlyData = processData();

    const datasets = Object.keys(monthlyData).map(year => ({
      label: year,
      data: monthlyData[year],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }));

    setData({
      labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('pt-BR', { month: 'long' })),
      datasets
    });
  }, [importData, startYear, endYear, startMonth, endMonth]);

  return (
    <div>
      <h2>Toneladas Mensais de Importação</h2>
      {data ? <Bar ref={chartRef} data={data} /> : <div>Carregando dados...</div>}
    </div>
  );
};

export default ToneladasMensal;
