import React from 'react';
import DistribuicaoVolume from './components/DistribuicaoVolume';
import DistribuicaoPreco from './components/DistribuicaoPreco';

function GraficosEstadosRegiaoExp({ exportData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-estados-exp regiao">
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

export default GraficosEstadosRegiaoExp;
