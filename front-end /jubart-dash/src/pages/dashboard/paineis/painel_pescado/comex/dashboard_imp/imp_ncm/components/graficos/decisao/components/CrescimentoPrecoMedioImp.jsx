import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CrescimentoPrecoMedioImp = ({ importData, startYear, endYear, startMonth, endMonth }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!importData || importData.length === 0) {
      console.warn("No import data available");
      return;
    }

    const processData = () => {
      let statsByCountry = {};

      importData.forEach(({ country, metricFOB, metricKG, year, monthNumber }) => {
        // Ensure year, monthNumber, metricFOB, and metricKG are numbers
        const parsedYear = parseInt(year, 10);
        const parsedMonth = parseInt(monthNumber, 10);
        const parsedFOB = parseFloat(metricFOB);
        const parsedKG = parseFloat(metricKG);

        if (parsedYear >= startYear && parsedYear <= endYear && parsedMonth >= startMonth && parsedMonth <= endMonth) {
          const currentPrice = parsedKG > 0 ? parsedFOB / parsedKG : 0;

          if (!statsByCountry[country]) {
            statsByCountry[country] = { lastPrice: currentPrice, changes: [] };
          } else {
            const lastPrice = statsByCountry[country].lastPrice;
            const percentChange = ((currentPrice - lastPrice) / lastPrice) * 100;

            if (!isNaN(percentChange) && percentChange !== 0) {
              statsByCountry[country].changes.push(percentChange);
            }

            statsByCountry[country].lastPrice = currentPrice;
          }
        }
      });

      console.log("Price Changes by Country: ", statsByCountry);

      let priceChanges = {};

      Object.keys(statsByCountry).forEach(country => {
        if (statsByCountry[country].changes.length > 0) {
          const avgChange = statsByCountry[country].changes.reduce((a, b) => a + b, 0) / statsByCountry[country].changes.length;
          if (avgChange > 0) {
            priceChanges[country] = avgChange;
          }
        }
      });

      console.log("Average Price Changes: ", priceChanges);

      // Convert to array and sort by percent change descending
      const sortedData = Object.entries(priceChanges).map(([country, percentChange]) => ({ country, percentChange }))
        .sort((a, b) => b.percentChange - a.percentChange);

      // Return the top 10
      return sortedData.slice(0, 10);
    };

    const finalData = processData();

    if (finalData.length > 0) {
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
    } else {
      console.warn("No significant price changes to display.");
    }

  }, [importData, startYear, endYear, startMonth, endMonth]);

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;

      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
      clonedCtx.drawImage(canvas, 0, 0);

      const dataURL = clonedCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'CrescimentoPrecoMedio.png';
      downloadLink.href = dataURL;
      downloadLink.click();
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
      {chartData ? (
        <>
          <Bar ref={chartRef} data={chartData} options={options} />
          <button onClick={downloadChart}>Baixar Gráfico</button>
        </>
      ) : <div>Carregando...</div>}
    </div>
  );
};

export default CrescimentoPrecoMedioImp;
