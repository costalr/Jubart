import React from 'react';
import DistribuicaoPrecoImp from './components/DistribuicaoPreco';
import DistribuicaoVolumeImp from './components/DistribuicaoVolume';

function GraficosNCMRegiaoImp({ importData }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="graficos-ncm-imp regiao">
      <DistribuicaoPrecoImp
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        importData={importData}
      />
      <DistribuicaoVolumeImp
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        importData={importData}
      />
    </div>
  );
}

export default GraficosNCMRegiaoImp;
