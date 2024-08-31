import React from 'react';
import DistribuicaoVolume from './components/DistribuicaoVolume';
import DistribuicaoPreco from './components/DistribuicaoPreco';

function GraficosCategoriasRegiaoImp({ importData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-categorias-exp regiao">
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

export default GraficosCategoriasRegiaoImp;
