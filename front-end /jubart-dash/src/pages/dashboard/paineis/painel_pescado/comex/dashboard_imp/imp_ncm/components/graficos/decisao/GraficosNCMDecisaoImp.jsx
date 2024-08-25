import React from 'react';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosDecisaoImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-ncm-imp decisao">
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

export default GraficosDecisaoImp;
