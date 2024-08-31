import React from 'react';
import DistribuicaoVolume from './components/DistribuicaoVolume';
import DistribuicaoPreco from './components/DistribuicaoPreco';

function GraficosEstadosRegiaoImp({ importData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-estados-imp regiao">
      <DistribuicaoVolume
        importData={importData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <DistribuicaoPreco
        importData={importData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
    </div>
  );
}

export default GraficosEstadosRegiaoImp;
