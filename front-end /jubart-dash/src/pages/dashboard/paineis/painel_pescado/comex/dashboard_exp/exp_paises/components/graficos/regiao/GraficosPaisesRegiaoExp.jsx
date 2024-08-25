import React from 'react';
import DistribuicaoVolume from './components/DistribuicaoVolume';
import DistribuicaoPreco from './components/DistribuicaoPreco';

function GraficosPaisesRegiaoExp({ exportData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-paises-exp regiao">
      <DistribuicaoVolume
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <DistribuicaoPreco
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
    </div>
  );
}

export default GraficosPaisesRegiaoExp;
