import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReducaoPrecoMedioExp = ({ exportData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Verificação de dados
    if (!exportData || exportData.length === 0) {
      console.log("No export data available");
      return;
    }

    const processData = () => {
      let statsByCountry = {};

      exportData.forEach(item => {
        if (item.year >= startYear && item.year <= endYear && item.monthNumber >= startMonth && item.monthNumber <= endMonth) {
          const key = `${item.country}-${item.year}-${item.monthNumber}`;
          if (!statsByCountry[key]) {
            statsByCountry[key] = { totalFOB: 0, totalKG: 0 };
          }
          statsByCountry[key].totalFOB += parseFloat(item.metricFOB);
          statsByCountry[key].totalKG += parseFloat(item.metricKG);
        }
      });

      let priceChanges = [];
      Object.keys(statsByCountry).forEach(key => {
        const [country, year, month] = key.split('-');
        const { totalFOB, totalKG } = statsByCountry[key];
        const avgPrice = totalKG > 0 ? totalFOB / totalKG : 0;

        if (priceChanges[country]) {
          const lastData = priceChanges[country].pop();
          const lastAvgPrice = lastData.avgPrice;
          const percentChange = ((lastAvgPrice - avgPrice) / lastAvgPrice) * 100;

          priceChanges[country].push(lastData); // Push back the last data
          if (percentChange > 0) { // We only care about negative changes shown positively
            priceChanges[country].push({ year, month, avgPrice, percentChange });
          }
        } else {
          priceChanges[country] = [{ year, month, avgPrice, percentChange: 0 }];
        }
      });

      // Select the highest price reduction for each country
      let finalData = [];
      Object.keys(priceChanges).forEach(country => {
        let maxChange = priceChanges[country].reduce((max, item) => item.percentChange > max.percentChange ? item : max, { percentChange: -Infinity });
        if (maxChange.percentChange > 0) {
          finalData.push({ country, percentChange: maxChange.percentChange });
        }
      });

      finalData.sort((a, b) => b.percentChange - a.percentChange); // Sort descending by percent change
      return finalData.slice(0, 10); // Top 10 countries
    };

    try {
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
    } catch (error) {
      console.error("Error processing export data:", error);
    }
  }, [exportData, startYear, endYear, startMonth, endMonth]);

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
