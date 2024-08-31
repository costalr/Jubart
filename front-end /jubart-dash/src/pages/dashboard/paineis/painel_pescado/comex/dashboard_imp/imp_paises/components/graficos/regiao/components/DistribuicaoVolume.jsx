import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistribuicaoVolume = ({ importData, isIndividual = false, selectedCountry }) => {
  const [data, setData] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);  // Estado para armazenar o volume total
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // Ref para acessar o gráfico

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    try {
      const volumes = {};

;

      if (isIndividual && !selectedCountry) {
        console.error("Selected country is undefined or null while in individual mode.");
        return;
      }

      importData.forEach(item => {
        if (parseInt(item.ano) === currentYear) {
          if (isIndividual && item.pais === selectedCountry) {
            const uf = item.estado || "Outros";
            const volume = parseFloat(item.total_kg || 0);
            volumes[uf] = (volumes[uf] || 0) + volume;
          } else if (!isIndividual) {
            const country = item.pais || "Outros";
            const volume = parseFloat(item.total_kg || 0);
            volumes[country] = (volumes[country] || 0) + volume;
          }
        }
      });


      const total = Object.values(volumes).reduce((acc, curr) => acc + curr, 0);
      setTotalVolume(total); // Armazena o total para uso no tooltip

      const sortedKeys = Object.keys(volumes).sort((a, b) => volumes[b] - volumes[a]);
      const topKeys = sortedKeys.slice(0, 5);
      const otherVolume = sortedKeys.slice(5).reduce((acc, key) => acc + volumes[key], 0);

      const labels = [...topKeys, 'Outros'];
      const volumeData = topKeys.map(key => volumes[key]).concat(otherVolume);

    
      setData({
        labels,
        datasets: [{
          label: isIndividual ? `Distribuição por UF em Kg - ${selectedCountry}` : 'Distribuição por países em Kg',
          data: volumeData,
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
  }, [importData, isIndividual, selectedCountry]);

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
      link.download = 'grafico-volume-distribuicao.png';
      link.href = imageURL;
      link.click();
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: { 
        callbacks: { 
          label: tooltipItem => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            const percentage = ((value / totalVolume) * 100).toFixed(2) + '%';
            return `${label}: ${value.toLocaleString()} Kg (${percentage})`;
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
      <h2>{isIndividual ? `Distribuição por UF em Kg - ${selectedCountry}` : 'Distribuição por países em Kg'}</h2>
      {data ? <Pie ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
      <button onClick={downloadChart} style={{ marginTop: '10px' }}>Clique aqui para baixar o gráfico!</button>
    </div>
  );
};

export default DistribuicaoVolume;
