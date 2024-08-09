import React from 'react';
import PrecoMedioCumulativoExp from '../preco_medio/components/PrecoMedioCumulativoExp';
import PrecoMedioMensalExp from '../preco_medio/components/PrecoMedioMensalExp';

function GraficosPrecoMedioExp({ startYear, endYear, startMonth, endMonth, exportData }) {
  return (
    <div className="graficos-exp preco-medio">
      <PrecoMedioCumulativoExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
      <PrecoMedioMensalExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
    </div>
  );
}

export default GraficosPrecoMedioExp;
