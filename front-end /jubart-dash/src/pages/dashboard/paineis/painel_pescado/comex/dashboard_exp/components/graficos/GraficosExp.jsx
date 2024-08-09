import React, { useState } from 'react';
import GraficosPrecoMedioExp from '../graficos/preco_medio/GraficosPrecoMedioExp';
import GraficosVolumeExp from '../graficos/volume/GraficosVolumeExp';
import GraficosRegiaoExp from '../graficos/regiao/GraficosRegiaoExp';
import GraficosDecisaoExp from '../graficos/decisao/GraficosDecisaoExp';

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
  { value: '12', label: 'Dezembro' }
];

function GraficosExp({ exportData }) {
  const [selectedStartYear, setSelectedStartYear] = useState(2010);
  const [selectedEndYear, setSelectedEndYear] = useState(maxYear);
  const [selectedStartMonth, setSelectedStartMonth] = useState('01');
  const [selectedEndMonth, setSelectedEndMonth] = useState('12');
  console.log("Dados de exportação no componente GraficosExp: ", exportData);

  return (
    
    <div className="container-graficos-exp">
      <div className="controls">
        <div>
          <label>Ano Inicial</label>
          <select
            value={selectedStartYear}
            onChange={(e) => setSelectedStartYear(parseInt(e.target.value))}
          >
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Ano Final</label>
          <select
            value={selectedEndYear}
            onChange={(e) => setSelectedEndYear(parseInt(e.target.value))}
          >
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Mês Inicial</label>
          <select
            value={selectedStartMonth}
            onChange={(e) => setSelectedStartMonth(e.target.value)}
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Mês Final</label>
          <select
            value={selectedEndMonth}
            onChange={(e) => setSelectedEndMonth(e.target.value)}
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="chart-container">
        <GraficosPrecoMedioExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={exportData}
        />
        <GraficosVolumeExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={exportData}
        />
        <GraficosRegiaoExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={exportData}
        />
        <GraficosDecisaoExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={exportData}
        />
      </div>
    </div>
  );
}

export default GraficosExp;
