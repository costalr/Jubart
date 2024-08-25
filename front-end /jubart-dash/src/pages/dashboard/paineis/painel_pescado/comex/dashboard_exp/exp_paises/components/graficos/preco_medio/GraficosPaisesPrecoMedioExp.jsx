import React from 'react';
import PrecoMedioCumulativo from './components/PrecoMedioCumulativo';
import PrecoMedioMensal from './components/PrecoMedioMensal';

function GraficosPaisesPrecoMedioExp({ startYear, endYear, startMonth, endMonth, exportData }) {
  return (
    <div className="graficos-exp preco-medio">
      <PrecoMedioCumulativo
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
      <PrecoMedioMensal
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
    </div>
  );
}

export default GraficosPaisesPrecoMedioExp;
