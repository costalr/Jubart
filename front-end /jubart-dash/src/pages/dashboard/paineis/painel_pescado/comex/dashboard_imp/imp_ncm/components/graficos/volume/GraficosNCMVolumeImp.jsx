import React from 'react';
import ToneladasCumulativas from './components/ToneladasCumulativoImp';
import ToneladasMensal from './components/ToneladasMensal';

function GraficosNCMVolumeImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-ncm-imp volume">
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

export default GraficosNCMVolumeImp;
