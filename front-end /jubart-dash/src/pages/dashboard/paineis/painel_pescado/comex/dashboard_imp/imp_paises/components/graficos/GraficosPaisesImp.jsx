import React, { useState, useEffect } from 'react';
import GraficosPrecoMedioImp from './preco_medio/GraficosPaisesPrecoMedioImp';
import GraficosVolumeImp from './volume/GraficosPaisesVolumeImp';
import GraficosRegiaoImp from './regiao/GraficosPaisesRegiaoImp';
import GraficosDecisaoImp from './decisao/GraficosPaisesDecisaoImp';
import '../../../../shared/Graficos.css'; // Importando o CSS global

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

function GraficosPaisesImp({ importData, referenceMonth, referenceYear, isIndividual, selectedCountry }) {
  const [selectedStartYear, setSelectedStartYear] = useState(isIndividual ? 2019 : referenceYear || 2010);
  const [selectedEndYear, setSelectedEndYear] = useState(isIndividual ? 2024 : referenceYear || maxYear);
  const [selectedStartMonth, setSelectedStartMonth] = useState(referenceMonth ? String(referenceMonth).padStart(2, '0') : '01');
  const [selectedEndMonth, setSelectedEndMonth] = useState(referenceMonth ? String(referenceMonth).padStart(2, '0') : '12');

  useEffect(() => {
    if (isIndividual) {
      // Se for individual, sempre fixa os anos de 2019 a 2024
      setSelectedStartYear(2019);
      setSelectedEndYear(2024);
    }
  }, [isIndividual]);

  return (
    <div className="container-graficos-imp">
      {!isIndividual && (
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
      )}
      <div className="chart-container"> {/* Organizar gráficos lado a lado */}
        <div className="grafico-row">
          <GraficosPrecoMedioImp
            startYear={selectedStartYear}
            endYear={selectedEndYear}
            startMonth={parseInt(selectedStartMonth)}
            endMonth={parseInt(selectedEndMonth)}
            importData={importData}
            isIndividual={isIndividual}
            selectedCountry={selectedCountry}
          />
          <GraficosVolumeImp
            startYear={selectedStartYear}
            endYear={selectedEndYear}
            startMonth={parseInt(selectedStartMonth)}
            endMonth={parseInt(selectedEndMonth)}
            importData={importData}
            isIndividual={isIndividual}
            selectedCountry={selectedCountry}
          />
        </div>
        <div className="grafico-row">
          <GraficosRegiaoImp
            startYear={selectedStartYear}
            endYear={selectedEndYear}
            startMonth={parseInt(selectedStartMonth)}
            endMonth={parseInt(selectedEndMonth)}
            importData={importData}
            isIndividual={isIndividual}
            selectedCountry={selectedCountry}
          />
          <GraficosDecisaoImp
            startYear={selectedStartYear}
            endYear={selectedEndYear}
            startMonth={parseInt(selectedStartMonth)}
            endMonth={parseInt(selectedEndMonth)}
            importData={importData}
            isIndividual={isIndividual}
            selectedCountry={selectedCountry}
          />
        </div>
      </div>
    </div>
  );
}

export default GraficosPaisesImp;
