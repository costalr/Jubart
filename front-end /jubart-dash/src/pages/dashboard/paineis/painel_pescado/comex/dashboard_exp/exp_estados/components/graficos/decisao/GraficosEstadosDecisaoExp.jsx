import React from 'react';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosEstadosDecisaoExp({ exportData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-estados-exp decisao">
      <ReducaoPrecoMedio
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <CrescimentoPrecoMedio
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <VariacaoPercentualVolumeAbsoluto
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
    </div>
  );
}

export default GraficosEstadosDecisaoExp;
