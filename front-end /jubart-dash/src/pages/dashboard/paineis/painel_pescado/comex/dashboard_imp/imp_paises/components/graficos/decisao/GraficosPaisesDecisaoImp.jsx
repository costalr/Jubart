import React from 'react';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosPaisesDecisaoImp({ startYear, endYear, startMonth, endMonth, importData, selectedCountry }) {
  return (
    <div className="graficos-imp decisao">
      <CrescimentoPrecoMedio
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
        selectedCountry={selectedCountry}  // Passando selectedCountry para o filho
      />
      <ReducaoPrecoMedio
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
        selectedCountry={selectedCountry}  // Passando selectedCountry para o filho
      />
      <VariacaoPercentualVolumeAbsoluto
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
        selectedCountry={selectedCountry}  // Passando selectedCountry para o filho
      />
    </div>
  );
}

export default GraficosPaisesDecisaoImp;
