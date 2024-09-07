import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PrecoMedioCumulativo = ({ importData, startYear, endYear, isIndividual = false }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar a expansão

  useEffect(() => {
    const loadData = () => {
      const filterStartYear = isIndividual ? 2010 : startYear;
      const filterEndYear = isIndividual ? 2024 : endYear;

      const filteredData = importData.filter(item =>
        parseInt(item.ano) >= filterStartYear &&
        parseInt(item.ano) <= filterEndYear
      );

      const yearlyData = filteredData.reduce((acc, curr) => {
        const year = curr.ano;
        if (!acc[year]) {
          acc[year] = { totalVolume: 0, totalValue: 0 };
        }
        acc[year].totalVolume += parseFloat(curr.total_kg || 0);
        acc[year].totalValue += parseFloat(curr.total_usd || 0);
        return acc;
      }, {});

      const years = isIndividual
        ? Array.from({ length: 15 }, (_, i) => (2010 + i).toString())
        : Object.keys(yearlyData).sort();

      const volumes = years.map(year => yearlyData[year]?.totalVolume || 0);
      const values = years.map(year => yearlyData[year]?.totalValue || 0);
      const prices = years.map(year => yearlyData[year]?.totalVolume ? yearlyData[year].totalValue / yearlyData[year].totalVolume : 0);

      setData({
        labels: years,
        datasets: [
          {
            type: 'bar',
            label: 'Kg',
            data: volumes,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
            data: prices,
            borderColor: 'rgba(53, 162, 235, 1)',
            yAxisID: 'y2',
            pointRadius: 3,
          }
        ]
      });
    };

    loadData();
  }, [startYear, endYear, importData, isIndividual]);

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height + 50;

      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);

      clonedCtx.font = '16px Arial';
      clonedCtx.fillStyle = 'black';
      clonedCtx.textAlign = 'center';
      clonedCtx.fillText('Preço Médio Cumulativo de Importação', clonedCanvas.width / 2, 30);

      clonedCtx.drawImage(canvas, 0, 50);

      const url = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'PrecoMedioCumulativoImportacao.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div className={`grafico ${isExpanded ? 'expanded' : ''}`}>
      <h2>Preço Médio Cumulativo de Importação</h2>
      {data ? (
        <>
          <Bar ref={chartRef} data={data} options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Ano' },
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Valor (US$)' },
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Kg' },
                grid: { drawOnChartArea: false },
              },
              y2: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Preço Médio (US$/kg)' },
                grid: { drawOnChartArea: false },
              },
            },
            plugins: {
              legend: { position: 'top' },
              tooltip: { callbacks: { label: context => `${context.dataset.label}: ${context.raw}` } },
            },
          }} />
          <div className="grafico-buttons">
            <button onClick={downloadChart}>Download do Gráfico</button>
            <button onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Fechar' : 'Expandir'}</button>
          </div>
        </>
      ) : <p>Carregando...</p>}
    </div>
  );
};

export default PrecoMedioCumulativo;
