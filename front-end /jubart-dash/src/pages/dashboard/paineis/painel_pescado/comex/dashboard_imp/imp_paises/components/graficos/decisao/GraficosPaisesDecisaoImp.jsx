import React from 'react';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosPaisesDecisaoImp({ startYear, endYear, startMonth, endMonth, importData, selectedCountry }) {
  return (
    <div className="graficos-imp decisao">
      <div className="graficos-container">
        <div className="grafico-container">
          <CrescimentoPrecoMedio
            startYear={startYear}
            endYear={endYear}
            startMonth={startMonth}
            endMonth={endMonth}
            importData={importData}
            selectedCountry={selectedCountry}
          />
        </div>
        <div className="grafico-container">
          <ReducaoPrecoMedio
            startYear={startYear}
            endYear={endYear}
            startMonth={startMonth}
            endMonth={endMonth}
            importData={importData}
            selectedCountry={selectedCountry}
          />
        </div>
        <div className="grafico-container">
          <VariacaoPercentualVolumeAbsoluto
            startYear={startYear}
            endYear={endYear}
            startMonth={startMonth}
            endMonth={endMonth}
            importData={importData}
            selectedCountry={selectedCountry}
          />
        </div>
      </div>
    </div>
  );
}

export default GraficosPaisesDecisaoImp;
