import React from 'react';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosPaisesDecisaoImp ({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-imp decisao">
      <CrescimentoPrecoMedio
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <ReducaoPrecoMedio
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <VariacaoPercentualVolumeAbsoluto
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
    </div>
  );
}

export default GraficosPaisesDecisaoImp ;
