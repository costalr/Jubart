import React from 'react';
import CrescimentoPrecoMedioExp from './components/CrescimentoPrecoMedioExp';
import ReducaoPrecoMedioExp from './components/ReducaoPrecoMedioExp';
import VariacaoPercentualVolumeAbsolutoExp from './components/VariacaoPercentualVolumeAbsolutoExp';

function GraficosDecisaoExp({ startYear, endYear, startMonth, endMonth, exportData }) {
  return (
    <div className="graficos-exp decisao">
      <CrescimentoPrecoMedioExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
      <ReducaoPrecoMedioExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
      <VariacaoPercentualVolumeAbsolutoExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
    </div>
  );
}

export default GraficosDecisaoExp;
