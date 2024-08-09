import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const PrecoMedioMensalExp = ({ startYear, endYear, startMonth, endMonth, exportData }) => {
  const [data, setData] = useState(null);
  const [viewMode, setViewMode] = useState('annual'); // 'annual', 'monthly', or 'lastSixYears'
  const [selectedYear, setSelectedYear] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!exportData) return;

    const processData = exportData.reduce((acc, item) => {
      if (parseInt(item.year) >= startYear && parseInt(item.year) <= endYear &&
          parseInt(item.monthNumber) >= startMonth && parseInt(item.monthNumber) <= endMonth) {
        const yearMonth = `${item.year}-${item.monthNumber.toString().padStart(2, '0')}`;
        const year = item.year.toString();
        acc[year] = acc[year] || { totalVolume: 0, totalValue: 0, months: {} };
        acc[year].totalVolume += parseFloat(item.metricKG) || 0;
        acc[year].totalValue += parseFloat(item.metricFOB) || 0;
        acc[year].months[yearMonth] = acc[year].months[yearMonth] || { totalVolume: 0, totalValue: 0 };
        acc[year].months[yearMonth].totalVolume += parseFloat(item.metricKG) || 0;
        acc[year].months[yearMonth].totalValue += parseFloat(item.metricFOB) || 0;
      }
      return acc;
    }, {});

    const lastSixYears = Object.keys(processData).sort().slice(-6);

    if (viewMode === 'annual') {
      const years = Object.keys(processData).sort();
      setData(createChartData(years, processData));
      setSelectedYear(null);
    } else if (viewMode === 'monthly' && selectedYear) {
      const months = Object.keys(processData[selectedYear].months).sort();
      setData(createChartData(months, processData[selectedYear].months));
    } else if (viewMode === 'lastSixYears') {
      const monthlyData = {};
      lastSixYears.forEach(year => {
        Object.keys(processData[year].months).forEach(month => {
          monthlyData[month] = processData[year].months[month];
        });
      });
      const months = Object.keys(monthlyData).sort();
      setData(createChartData(months, monthlyData));
    }
  }, [exportData, viewMode, selectedYear, startYear, endYear, startMonth, endMonth]);

  const createChartData = (periods, data) => {
    const volumes = periods.map(period => data[period].totalVolume);
    const values = periods.map(period => data[period].totalValue);
    const averagePrices = periods.map(period => data[period].totalVolume > 0 ? data[period].totalValue / data[period].totalVolume : 0);

    return {
      labels: periods,
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

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = data.labels[index];
      if (viewMode === 'annual') {
        setSelectedYear(label);
        setViewMode('monthly');
      } else {
        setViewMode('annual');
      }
    }
  };

  const handleViewChange = () => {
    if (viewMode === 'lastSixYears') {
      setViewMode('annual');
    } else {
      setViewMode('lastSixYears');
    }
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
      clonedCtx.fillText(
        viewMode === 'annual' ? 'Histórico Anual de Preços Médios' : `Histórico Mensal de Preços Médios para o Ano de ${selectedYear}`,
        clonedCanvas.width / 2,
        30
      );

      clonedCtx.drawImage(canvas, 0, 50);

      const url = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'PrecoMedioMensalExp.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div>
      <h2>{viewMode === 'annual' ? 'Histórico Anual de Preços Médios' : (viewMode === 'lastSixYears' ? 'Histórico Mensal dos Últimos 6 Anos' : `Histórico Mensal de Preços Médios para o Ano de ${selectedYear}`)}</h2>
      {data ? (
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
            onClick: handleChartClick,
          }}
        />
      ) : (
        <div>Carregando dados...</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '10px', marginBottom: '20px' }}>
        <button  onClick={handleViewChange}>{viewMode === 'lastSixYears' ? 'Voltar para Visualização Anual' : 'Visualizar Últimos 6 Anos Mês a Mês'}</button>
        <button onClick={downloadChart}>Download do Gráfico</button>
      </div>
    </div>
  );
};

export default PrecoMedioMensalExp;
