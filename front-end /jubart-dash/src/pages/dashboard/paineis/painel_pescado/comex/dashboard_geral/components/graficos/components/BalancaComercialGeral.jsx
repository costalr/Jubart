import React, { useRef, useEffect, useState } from 'react'; // Importar React e os hooks
import { Line } from 'react-chartjs-2'; // Importar o componente Line de react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Importar componentes do Chart.js

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BalancaComercialGeral = ({ selectedStartYear, selectedEndYear, importData, exportData }) => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const aggregateDataByYear = (data) => {
      return data.reduce((acc, item) => {
        const year = parseInt(item.year);
        if (year >= selectedStartYear && year <= selectedEndYear) {
          if (!acc[year]) {
            acc[year] = { totalFOB: 0 };
          }
          acc[year].totalFOB += parseFloat(item.metricFOB);
        }
        return acc;
      }, {});
    };

    const importAggregated = aggregateDataByYear(importData);
    const exportAggregated = aggregateDataByYear(exportData);

    const years = Object.keys(importAggregated).concat(Object.keys(exportAggregated))
                       .filter((value, index, self) => self.indexOf(value) === index)
                       .sort();

    const importVolumes = years.map(year => importAggregated[year]?.totalFOB || 0);
    const exportVolumes = years.map(year => exportAggregated[year]?.totalFOB || 0);
    const balance = years.map((year, index) => exportVolumes[index] - importVolumes[index]);

    setData({
      labels: years,
      datasets: [
        {
          label: 'Importação (US$)',
          data: importVolumes,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Exportação (US$)',
          data: exportVolumes,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          label: 'Balança Comercial (US$)',
          data: balance,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }
      ]
    });
  }, [selectedStartYear, selectedEndYear, importData, exportData]);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'US$'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Ano'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const a = document.createElement('a');
      a.href = canvas.toDataURL();
      a.download = "HistoricoBalancaComercial.png";
      a.click();
    }
  };

  return (
    <div>
      <h2>Histórico da Balança Comercial</h2>
      {data ? <Line ref={chartRef} data={data} options={options} /> : <div>Carregando...</div>}
      <button onClick={downloadChart}>Clique aqui para baixar o gráfico</button>
    </div>
  );
};

export default BalancaComercialGeral;
