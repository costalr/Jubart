import React from 'react';
import ToneladasCumulativo from './components/ToneladasCumulativo';
import ToneladasMensal from './components/ToneladasMensal';

function GraficosPaisesVolumeExp({ exportData, startYear, endYear, startMonth, endMonth }) {
  return (
    <div className="graficos-paises-exp volume">
      <ToneladasCumulativo
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
      <ToneladasMensal
        exportData={exportData}
        startYear={startYear}
        endYear={endYear}
        startMonth={startMonth}
        endMonth={endMonth}
      />
    </div>
  );
}

export default GraficosPaisesVolumeExp;
