import React from 'react';
import DistribuicaoPrecoImp from './components/DistribuicaoPrecoImp';
import DistribuicaoVolumeImp from './components/DistribuicaoVolumeImp';

function GraficosRegiaoImp({ importData }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="graficos-imp regiao">
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

export default GraficosRegiaoImp;
