import React from 'react';
import CrescimentoPrecoMedioImp from './components/CrescimentoPrecoMedioImp';
import ReducaoPrecoMedioImp from './components/ReducaoPrecoMedioImp';
import VariacaoPercentualVolumeAbsolutoImp from './components/VariacaoPercentualVolumeAbsolutoImp';

function GraficosDecisaoImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-imp decisao">
      <CrescimentoPrecoMedioImp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <ReducaoPrecoMedioImp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <VariacaoPercentualVolumeAbsolutoImp
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
