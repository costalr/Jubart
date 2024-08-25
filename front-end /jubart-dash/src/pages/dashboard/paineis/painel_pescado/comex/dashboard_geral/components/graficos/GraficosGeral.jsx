import React, { useState } from 'react';
import BalancaComercialGeral from './components/BalancaComercialGeral';
import PrecoMedioGeral from './components/PrecoMedioGeral';
import VolumeGeral from './components/VolumeGeral';
import './GraficosGeral.css';

const minYear = 1997;
const maxYear = new Date().getFullYear();
const monthOptions = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

function GraficosGeral({ importData, exportData, error }) {
  const currentYear = new Date().getFullYear();
  const [selectedStartYear, setSelectedStartYear] = useState(2010);
  const [selectedEndYear, setSelectedEndYear] = useState(currentYear);
  const [selectedStartMonth, setSelectedStartMonth] = useState('01');
  const [selectedEndMonth, setSelectedEndMonth] = useState('12');

  const getYears = (start, end) => {
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year);
    }
    return years;
  };

  if (error) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <div className="container-graficos-geral">
      <div className="controls">
        <div>
          <label>Ano Inicial</label>
          <select
            value={selectedStartYear}
            onChange={(e) => setSelectedStartYear(parseInt(e.target.value))}
          >
            {getYears(minYear, maxYear).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Ano Final</label>
          <select
            value={selectedEndYear}
            onChange={(e) => setSelectedEndYear(parseInt(e.target.value))}
          >
            {getYears(minYear, maxYear).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Mês Inicial</label>
          <select
            value={selectedStartMonth}
            onChange={(e) => setSelectedStartMonth(e.target.value)}
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Mês Final</label>
          <select
            value={selectedEndMonth}
            onChange={(e) => setSelectedEndMonth(e.target.value)}
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="chart-container">
        <BalancaComercialGeral
          selectedStartYear={selectedStartYear}
          selectedEndYear={selectedEndYear}
          selectedStartMonth={selectedStartMonth}
          selectedEndMonth={selectedEndMonth}
          importData={importData}
          exportData={exportData}
        />
      </div>

      <div className="chart-container">
        <VolumeGeral
          selectedStartYear={selectedStartYear}
          selectedEndYear={selectedEndYear}
          selectedStartMonth={selectedStartMonth}
          selectedEndMonth={selectedEndMonth}
          importData={importData}
          exportData={exportData}
        />
      </div>
      
      <div className="chart-container">
        <PrecoMedioGeral
          selectedStartYear={selectedStartYear}
          selectedEndYear={selectedEndYear}
          selectedStartMonth={selectedStartMonth}
          selectedEndMonth={selectedEndMonth}
          importData={importData}
          exportData={exportData}
        />
      </div>

    </div>
  );
}

export default GraficosGeral;
