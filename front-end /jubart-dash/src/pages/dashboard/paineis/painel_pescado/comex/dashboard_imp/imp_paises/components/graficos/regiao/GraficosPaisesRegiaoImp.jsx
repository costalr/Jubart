import React from 'react';
import DistribuicaoPreco from './components/DistribuicaoPreco';
import DistribuicaoVolume from './components/DistribuicaoVolume';

function GraficosPaisesRegiaoImp({ importData, selectedCountry, isIndividual }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="graficos-paises-imp regiao">
      <DistribuicaoPreco
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        importData={importData}
        selectedCountry={selectedCountry}  // Passando selectedCountry
        isIndividual={isIndividual}        // Passando isIndividual
      />
      <DistribuicaoVolume
        startYear={currentYear}
        endYear={currentYear}
        startMonth={1} // Janeiro
        endMonth={12} // Dezembro
        importData={importData}
        selectedCountry={selectedCountry}  // Passando selectedCountry
        isIndividual={isIndividual}        // Passando isIndividual
      />
    </div>
  );
}

export default GraficosPaisesRegiaoImp;
