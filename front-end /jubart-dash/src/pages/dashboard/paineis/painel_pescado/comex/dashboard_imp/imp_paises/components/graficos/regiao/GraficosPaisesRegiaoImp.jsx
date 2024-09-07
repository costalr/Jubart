import React from 'react';
import DistribuicaoPreco from './components/DistribuicaoPreco';
import DistribuicaoVolume from './components/DistribuicaoVolume';

function GraficosPaisesRegiaoImp({ importData, selectedCountry, isIndividual }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="graficos-container">
      {/* Gráfico de Distribuição por Preço */}
      <div className="grafico-pizza">
        <DistribuicaoPreco
          startYear={currentYear}
          endYear={currentYear}
          startMonth={1}
          endMonth={12}
          importData={importData}
          selectedCountry={selectedCountry}
          isIndividual={isIndividual}
        />
      </div>
      {/* Gráfico de Distribuição por Volume */}
      <div className="grafico-pizza">
        <DistribuicaoVolume
          startYear={currentYear}
          endYear={currentYear}
          startMonth={1}
          endMonth={12}
          importData={importData}
          selectedCountry={selectedCountry}
          isIndividual={isIndividual}
        />
      </div>
    </div>
  );
}

export default GraficosPaisesRegiaoImp;
