import React from 'react';
import PrecoMedioCumulativo from './components/PrecoMedioCumulativo';
import PrecoMedioMensal from './components/PrecoMedioMensal';

function GraficosPaisesPrecoMedioImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-imp preco-medio">
      <PrecoMedioCumulativo
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <PrecoMedioMensal
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
    </div>
  );
}

export default GraficosPaisesPrecoMedioImp;
