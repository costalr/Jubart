import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistribuicaoPreco = ({ startYear, endYear, startMonth, endMonth, importData, isIndividual = false, selectedCountry }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    try {
      const values = {};

      console.log("Selected Country:", selectedCountry);
      console.log("Is Individual:", isIndividual);

      importData.forEach(item => {
        const year = parseInt(item.ano, 10);
        const month = parseInt(item.mes, 10);

        if (year >= startYear && year <= endYear && month >= startMonth && month <= endMonth) {
          if (isIndividual && item.pais === selectedCountry) {
            const uf = item.estado || "Outros";
            const value = parseFloat(item.total_usd || 0);
            values[uf] = (values[uf] || 0) + value;
            console.log(`Processing UF: ${uf} with value: ${value}`);
          } else if (!isIndividual) {
            const country = item.pais || "Outros";
            const value = parseFloat(item.total_usd || 0);
            values[country] = (values[country] || 0) + value;
          }
        }
      });

      console.log("Values:", values);

      const total = Object.values(values).reduce((acc, curr) => acc + curr, 0);
      setTotalValue(total);

      const sortedKeys = Object.keys(values).sort((a, b) => values[b] - values[a]);
      const topKeys = sortedKeys.slice(0, 5);
      const otherValue = sortedKeys.slice(5).reduce((acc, key) => acc + values[key], 0);

      const labels = [...topKeys, 'Outros'];
      const valueData = topKeys.map(key => values[key]).concat(otherValue);

      console.log("Other Value:", otherValue);
      console.log("Labels:", labels);
      console.log("Value Data:", valueData);

      setData({
        labels,
        datasets: [{
          label: isIndividual ? `Distribuição por UF em US$ - ${selectedCountry}` : 'Distribuição por países em US$',
          data: valueData,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(201, 203, 207, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)', 'rgba(201, 203, 207, 1)'
          ],
          borderWidth: 1
        }]
      });
    } catch (err) {
      console.error('Erro ao processar os dados:', err);
      setError(err);
    }
  }, [startYear, endYear, startMonth, endMonth, importData, isIndividual, selectedCountry]);

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
      const imageURL = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'grafico-preco-distribuicao.png';
      link.href = imageURL;
      link.click();
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Distribuição por países em US$', align: 'start' },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const value = tooltipItem.raw;
            const percentage = ((value / totalValue) * 100).toFixed(2) + '%';
            return `${tooltipItem.label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })} (${percentage})`;
          }
        }
      }
    }
  };

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>{isIndividual ? `Distribuição por UF em US$ - ${selectedCountry}` : 'Distribuição por países em US$'}</h2>
      {data ? <Pie ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
      <button onClick={downloadChart} style={{ marginTop: '10px' }}>Clique aqui para baixar o gráfico!</button>
    </div>
  );
};

export default DistribuicaoPreco;
