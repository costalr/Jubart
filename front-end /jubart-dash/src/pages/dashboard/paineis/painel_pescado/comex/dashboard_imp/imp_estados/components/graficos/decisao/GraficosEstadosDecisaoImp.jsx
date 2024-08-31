import React from 'react';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosEstadosDecisaoImp({ importData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-estados-imp decisao">
      <ReducaoPrecoMedio
        importData={importData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <CrescimentoPrecoMedio
        importData={importData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <VariacaoPercentualVolumeAbsoluto
        importData={importData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
    </div>
  );
}

export default GraficosEstadosDecisaoImp;
