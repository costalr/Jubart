import React from 'react';
import ToneladasCumulativas from './components/ToneladasCumulativo';
import ToneladasMensal from './components/ToneladasMensal';

function GraficosPaisesVolumeImp({ startYear, endYear, startMonth, endMonth, importData }) {
  return (
    <div className="graficos-paises-imp volume">
      <div className="graficos-container">
        <div className="grafico-container">
          <ToneladasCumulativas
            startYear={startYear}
            endYear={endYear}
            startMonth={startMonth}
            endMonth={endMonth}
            importData={importData}
          />
        </div>
        <div className="grafico-container">
          <ToneladasMensal
            startYear={startYear}
            endYear={endYear}
            startMonth={startMonth}
            endMonth={endMonth}
            importData={importData}
          />
        </div>
      </div>
    </div>
  );
}

export default GraficosPaisesVolumeImp;
