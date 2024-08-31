import React, { useState } from 'react';
import GraficosCategoriasVolumeImp from './volume/GraficosCategoriasVolumeImp'
import GraficosCategoriasPrecoMedioImp from './preco_medio/GraficosCategoriasPrecoMedioImp';
import GraficosCategoriasRegiaoImp from './regiao/GraficosCategoriasRegiaoImp';
import GraficosCategoriasDecisaoImp from './decisao/GraficosCategoriasDecisaoImp';

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

function GraficosCategoriasImp({ importData, referenceMonth, referenceYear }) {
  const [selectedStartMonth, setSelectedStartMonth] = useState(referenceMonth ? String(referenceMonth).padStart(2, '0') : '01');
  const [selectedEndMonth, setSelectedEndMonth] = useState(referenceMonth ? String(referenceMonth).padStart(2, '0') : '12');

  const filteredData = importData.filter(item => {
    const itemYear = parseInt(item.ano);
    const itemMonth = parseInt(item.mes);
    return itemYear <= maxYear &&
           itemMonth >= parseInt(selectedStartMonth) && itemMonth <= parseInt(selectedEndMonth);
  });

  return (
    <div className="container-graficos-imp">
      <div className="controls">
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
        <GraficosCategoriasPrecoMedioImp
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          importData={filteredData}
        />
        <GraficosCategoriasVolumeImp
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          importData={filteredData}
        />
        <GraficosCategoriasRegiaoImp
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          importData={filteredData}
        />
        <GraficosCategoriasDecisaoImp
          startMonth={parseInt(selectedStartMonth)}
          endMonth={parseInt(selectedEndMonth)}
          importData={filteredData}
        />
      </div>
    </div>
  );
}

export default GraficosCategoriasImp;
