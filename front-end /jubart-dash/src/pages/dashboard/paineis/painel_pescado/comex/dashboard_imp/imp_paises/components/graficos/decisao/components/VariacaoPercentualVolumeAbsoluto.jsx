import React, { useEffect, useState, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const VariacaoPercentualVolumeAbsoluto = ({ importData, selectedCountry, isIndividual }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar a expansão

  useEffect(() => {
    const processData = (importData) => {
      let ufData = {};
      let scatterData = [];

      importData.forEach(item => {
        const year = parseInt(item.ano);
        const monthNumber = parseInt(item.mes);
        const volume = parseFloat(item.total_kg || 0);
        const uf = item.estado;
        const country = item.pais;

        if (isIndividual && country !== selectedCountry) return; // Filtra pelo país selecionado, se for visão individual

        if (year === 2024) { // Considera apenas dados de 2024
          if (!isNaN(year) && !isNaN(monthNumber) && !isNaN(volume)) {
            if (ufData.hasOwnProperty(uf)) {
              const previousVolume = ufData[uf].lastVolume;

              if (previousVolume > 0) { // Evitar divisão por zero
                const variacaoPercentual = ((volume - previousVolume) / previousVolume) * 100;
                scatterData.push({ x: volume, y: variacaoPercentual, label: uf });
              }
            }

            ufData[uf] = { lastVolume: volume };
          }
        }
      });

      return scatterData;
    };

    const scatterData = processData(importData);

    setData({
      datasets: [{
        label: `Variação Percentual x Volume Absoluto por UF - ${selectedCountry || 'Geral'}`,
        data: scatterData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 3 // Reduzir o tamanho das bolinhas
      }]
    });
  }, [importData, selectedCountry, isIndividual]);

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Volume Absoluto (kg)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Variação Percentual (%)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.label}: ${context.raw.x.toLocaleString()} kg, ${context.raw.y.toFixed(2)}%`
        }
      }
    }
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const clonedCanvas = document.createElement('canvas');
      const clonedCtx = clonedCanvas.getContext('2d');

      clonedCanvas.width = canvas.width;
      clonedCanvas.height = canvas.height;

      // Define fundo branco
      clonedCtx.fillStyle = 'white';
      clonedCtx.fillRect(0, 0, clonedCanvas.width, clonedCanvas.height);
      clonedCtx.drawImage(canvas, 0, 0);

      const imageURL = clonedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `VariacaoPercentualVolumeAbsoluto_${selectedCountry || 'Geral'}.png`;
      link.href = imageURL;
      link.click();
    }
  };

  return (
    <div className={`grafico ${isExpanded ? 'expanded' : ''}`}> {/* Classe condicional para controlar a expansão */}
      <h2>{isIndividual ? `Análise de Variação Percentual e Volume Absoluto por UF - ${selectedCountry}` : 'Análise de Variação Percentual e Volume Absoluto por UF - Geral'}</h2>
      {data ? (
        <>
          <Scatter ref={chartRef} data={data} options={options} />
          <div className="grafico-buttons">
            <button onClick={downloadChart} style={{ marginTop: '10px' }}>Baixar Gráfico</button>
            <button onClick={() => setIsExpanded(!isExpanded)} style={{ marginTop: '10px' }}>
              {isExpanded ? 'Fechar' : 'Expandir'}
            </button>
          </div>
        </>
      ) : <div>Carregando...</div>}
    </div>
  );
};

export default VariacaoPercentualVolumeAbsoluto;
