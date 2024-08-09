import React from 'react';
import DistribuicaoPrecoExp from './components/DistribuicaoPrecoExp';
import DistribuicaoVolumeExp from './components/DistribuicaoVolumeExp';

function GraficosRegiaoImp({ exportData }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="graficos-exp regiao">
      <DistribuicaoPrecoExp
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        exportData={exportData}
      />
      <DistribuicaoVolumeExp
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        exportData={exportData}
      />
    </div>
  );
}

export default GraficosRegiaoImp;
