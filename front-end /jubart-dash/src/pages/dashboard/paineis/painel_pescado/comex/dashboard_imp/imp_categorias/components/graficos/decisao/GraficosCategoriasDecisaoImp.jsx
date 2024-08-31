import React from 'react';
import CrescimentoPrecoMedio from './components/CrescimentoPrecoMedio';
import ReducaoPrecoMedio from './components/ReducaoPrecoMedio';
import VariacaoPercentualVolumeAbsoluto from './components/VariacaoPercentualVolumeAbsoluto';

function GraficosCategoriasDecisaoImp({ importData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-categorias-decisao">
      <CrescimentoPrecoMedio
        importData={importData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <ReducaoPrecoMedio
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

export default GraficosCategoriasDecisaoImp;
