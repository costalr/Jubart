import React from 'react';
import DistribuicaoPreco from './components/DistribuicaoPreco';
import DistribuicaoVolume from './components/DistribuicaoVolume';

function GraficosRegiaoImp({ importData }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="graficos-paises-imp regiao">
      <DistribuicaoPreco
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        importData={importData}
      />
      <DistribuicaoVolume
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        importData={importData}
      />
    </div>
  );
}

export default GraficosRegiaoImp;
