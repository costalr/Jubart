import React from 'react';
import PrecoMedioCumulativoImp from '../preco_medio/components/PrecoMedioCumulativoImp';
import PrecoMedioMensalImp from '../preco_medio/components/PrecoMedioMensalImp';

function GraficosPrecoMedioImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-imp preco-medio">
      <PrecoMedioCumulativoImp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <PrecoMedioMensalImp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
    </div>
  );
}

export default GraficosPrecoMedioImp;
