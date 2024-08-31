import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const PrecoMedioMensal = ({ startYear, endYear, startMonth, endMonth, importData, isIndividual = false }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!importData) return;

    const currentYear = new Date().getFullYear();
    const adjustedStartYear = isIndividual ? currentYear - 5 : startYear;
    const adjustedEndYear = isIndividual ? currentYear : endYear;

    const processData = importData.reduce((acc, item) => {
      const ano = parseInt(item.ano);
      const mes = parseInt(item.mes);

      if (ano >= adjustedStartYear && ano <= adjustedEndYear) {
        const yearMonth = `${ano}-${mes.toString().padStart(2, '0')}`;
        if (!acc[yearMonth]) {
          acc[yearMonth] = { totalVolume: 0, totalValue: 0 };
        }
        acc[yearMonth].totalVolume += item.total_kg ? parseFloat(item.total_kg) : 0;
        acc[yearMonth].totalValue += item.total_usd ? parseFloat(item.total_usd) : 0;
      }

      return acc;
    }, {});

    const lastSixYears = Array.from({ length: 6 }, (_, i) => currentYear - i).reverse();

    const meses = [];
    lastSixYears.forEach(ano => {
      for (let mes = 1; mes <= 12; mes++) {
        meses.push(`${ano}-${mes.toString().padStart(2, '0')}`);
      }
    });

    setData(createChartData(meses, processData));
  }, [importData, startYear, endYear, startMonth, endMonth, isIndividual]);

  const createChartData = (periods, data) => {
    const volumes = periods.map(period => data[period]?.totalVolume || 0);
    const values = periods.map(period => data[period]?.totalValue || 0);
    const averagePrices = periods.map(period =>
      data[period]?.totalVolume > 0 ? data[period].totalValue / data[period].totalVolume : 0
    );

    return {
      labels: periods.map(period => {
        const [ano, mes] = period.split('-');
        return `${mes}/${ano}`;
      }),
      datasets: [
        {
          type: 'bar',
          label: 'Kg',
          data: volumes,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'US$',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: 'Preço Médio',
          data: averagePrices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          yAxisID: 'y2',
          pointRadius: 3,
          fill: false
        }
      ]
    };
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50; // Adds space for the title

      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText('Histórico Mensal dos Últimos 6 Anos', clonedCanvas.width / 2, 30);

      clonedCtx.drawImage(canvas, 0, 50);

      const url = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'PrecoMedioMensal_Ultimos6Anos.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div>
      <h2>Histórico Mês a Mês</h2>
      {data ? (
        <>
          <Bar
            ref={chartRef}
            data={data}
            options={{
              responsive: true,
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Volume (Kg)',
                  },
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Valor (US$)',
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y2: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Preço Médio (US$/kg)',
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
            }}
          />
          <button onClick={downloadChart} style={{ marginTop: '10px' }}>Download do Gráfico</button>
        </>
      ) : (
        <div>Carregando dados...</div>
      )}
    </div>
  );
};

export default PrecoMedioMensal;
