import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReducaoPrecoMedioExp = ({ importData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = () => {
      let statsByState = {};

      importData.forEach(item => {
        if (item.ano >= startYear && item.ano <= endYear && item.mes >= startMonth && item.mes <= endMonth) {
          const key = `${item.estado}-${item.ano}-${item.mes}`;
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
          const percentChange = ((lastAvgPrice - avgPrice) / lastAvgPrice) * 100;

          priceChanges[state].push(lastData); // Push back the last data
          if (percentChange > 0) { // We only care about negative changes shown positively
            priceChanges[state].push({ year, month, avgPrice, percentChange });
          }
        } else {
          priceChanges[state] = [{ year, month, avgPrice, percentChange: 0 }];
        }
      });

      // Select the highest price reduction for each state
      let finalData = [];
      Object.keys(priceChanges).forEach(state => {
        let maxChange = priceChanges[state].reduce((max, item) => item.percentChange > max.percentChange ? item : max, { percentChange: -Infinity });
        if (maxChange.percentChange > 0) {
          finalData.push({ state, percentChange: maxChange.percentChange });
        }
      });

      finalData.sort((a, b) => b.percentChange - a.percentChange); // Sort descending by percent change
      return finalData.slice(0, 10); // Top 10 states
    };

    const finalData = processData();
    setChartData({
      labels: finalData.map(v => v.state),
      datasets: [{
        label: 'Redução %PM',
        data: finalData.map(v => v.percentChange),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    });
  }, [importData, startYear, endYear, startMonth, endMonth]);

  const downloadChart = () => {
    const canvas = chartRef.current.canvas;
    const clonedCanvas = document.createElement('canvas');
    const clonedCtx = clonedCanvas.getContext('2d');

    clonedCanvas.width = canvas.width;
    clonedCanvas.height = canvas.height;

    // Set background to white
    clonedCtx.fillStyle = 'white';
    clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

    // Draw the original canvas onto the cloned canvas
    clonedCtx.drawImage(canvas, 0, 0);

    // Convert cloned canvas to data URL
    const dataURL = clonedCanvas.toDataURL('image/png');

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.download = 'ReducaoPrecoMedio.png';
    downloadLink.href = dataURL;
    downloadLink.click();
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
          text: 'Estados'
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
      <h2>Maiores reduções do preço médio por Estado</h2>
      {chartData ? (
        <>
          <Bar ref={chartRef} data={chartData} options={options} />
          <button onClick={downloadChart}>Baixar Gráfico</button>
        </>
      ) : <div>Carregando...</div>}
    </div>
  );
};

export default ReducaoPrecoMedioExp;
