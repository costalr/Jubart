import React from 'react';
import ToneladasCumulativasExp from './components/ToneladasCumulativoExp';
import ToneladasMensalExp from './components/ToneladasMensalExp';

function GraficosVolumeExp({ startYear, endYear, startMonth, endMonth, exportData }) {
  return (
    <div className="graficos-exp volume">
      <ToneladasCumulativasExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
      <ToneladasMensalExp
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
        exportData={exportData}
      />
    </div>
  );
}

export default GraficosVolumeExp;
