import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ToneladasCumulativo = ({ importData, startYear, endYear, startMonth, endMonth }) => {
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

      const cumulativeData = {};
      Object.keys(monthlyData).forEach(year => {
        let cumulative = 0;
        cumulativeData[year] = monthlyData[year].map((kg, index) => {
          cumulative += kg;
          return cumulative;
        });
      });

      return cumulativeData;
    };

    const cumulativeData = processData();

    const datasets = Object.keys(cumulativeData).map(year => ({
      label: year,
      data: cumulativeData[year],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.1
    }));

    setData({
      labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('pt-BR', { month: 'long' })),
      datasets
    });
  }, [importData, startYear, endYear, startMonth, endMonth]);

  return (
    <div>
      <h2>Toneladas Cumulativas de Importação</h2>
      {data ? <Line ref={chartRef} data={data} /> : <div>Carregando dados...</div>}
    </div>
  );
};

export default ToneladasCumulativo;
