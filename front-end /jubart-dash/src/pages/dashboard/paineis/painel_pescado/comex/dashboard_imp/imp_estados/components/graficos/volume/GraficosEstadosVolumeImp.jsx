import React from 'react';
import ToneladasCumulativas from './components/ToneladasCumulativo';
import ToneladasMensal from './components/ToneladasMensal';

function GraficosEstadosVolumeImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-paises-imp volume">
      <ToneladasCumulativas
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <ToneladasMensal
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
    </div>
  );
}

export default GraficosEstadosVolumeImp;
