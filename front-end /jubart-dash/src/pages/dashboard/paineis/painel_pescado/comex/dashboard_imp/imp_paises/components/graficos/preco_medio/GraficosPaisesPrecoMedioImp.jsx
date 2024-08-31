import React from 'react';
import PrecoMedioCumulativo from './components/PrecoMedioCumulativo';
import PrecoMedioMensal from './components/PrecoMedioMensal';

function GraficosPaisesPrecoMedioImp({ startYear, endYear, startMonth, endMonth, importData, isIndividual = false }) {
  return (
    <div className="graficos-imp preco-medio">
      <PrecoMedioCumulativo
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
        isIndividual={isIndividual} 
      />
      <PrecoMedioMensal
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
        isIndividual={isIndividual} 
      />
    </div>
  );
}

export default GraficosPaisesPrecoMedioImp;
