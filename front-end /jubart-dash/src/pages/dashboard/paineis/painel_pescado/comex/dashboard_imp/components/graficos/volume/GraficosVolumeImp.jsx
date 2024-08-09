import React from 'react';
import ToneladasCumulativasImp from './components/ToneladasCumulativoImp';
import ToneladasMensalImp from './components/ToneladasMensalImp';

function GraficosVolumeImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-imp volume">
      <ToneladasCumulativasImp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
      <ToneladasMensalImp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        importData={importData}
      />
    </div>
  );
}

export default GraficosVolumeImp;
