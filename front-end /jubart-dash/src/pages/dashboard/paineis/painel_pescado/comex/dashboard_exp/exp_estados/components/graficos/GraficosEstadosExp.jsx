import React, { useState } from 'react';
import GraficosEstadosVolumeExp from './volume/GraficosEstadosVolumeExp'
import GraficosEstadosPrecoMedioExp from './preco_medio/GraficosEstadosPrecoMedioExp';
import GraficosEstadosRegiaoExp from './regiao/GraficosEstadosRegiaoExp';
import GraficosEstadosDecisaoExp from './decisao/GraficosEstadosDecisaoExp';

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

function GraficosEstadosExp({ exportData, referenceMonth, referenceYear }) {
  const [selectedStartYear, setSelectedStartYear] = useState(referenceYear || 2010);
  const [selectedEndYear, setSelectedEndYear] = useState(referenceYear || maxYear);
  const [selectedStartMonth, setSelectedStartMonth] = useState(referenceMonth ? String(referenceMonth).padStart(2, '0') : '01');
  const [selectedEndMonth, setSelectedEndMonth] = useState(referenceMonth ? String(referenceMonth).padStart(2, '0') : '12');



  const filteredData = exportData.filter(item => {
    const itemYear = parseInt(item.ano);
    const itemMonth = parseInt(item.mes);
    return itemYear >= selectedStartYear && itemYear <= selectedEndYear &&
           itemMonth >= parseInt(selectedStartMonth) && itemMonth <= parseInt(selectedEndMonth);
  });


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
        <GraficosEstadosPrecoMedioExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={filteredData}
        />
        <GraficosEstadosVolumeExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={filteredData}
        />
        <GraficosEstadosRegiaoExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={filteredData}
        />
        <GraficosEstadosDecisaoExp
          startYear={selectedStartYear}
          endYear={selectedEndYear}
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          exportData={filteredData}
        />
      </div>
    </div>
  );
}

export default GraficosEstadosExp;
