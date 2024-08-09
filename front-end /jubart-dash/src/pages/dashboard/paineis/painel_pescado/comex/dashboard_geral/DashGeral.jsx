// DashGeral.js
import React from 'react';
import CardsGeral from './components/cards/CardsGeral';
import GraficosGeral from './components/graficos/GraficosGeral';

function DashGeral({ importData, exportData, error, referenceMonth, referenceYear }) {
  return (
    <div className="dashboard dashboard-geral">
      <CardsGeral 
        importData={importData} 
        exportData={exportData} 
        error={error} 
        referenceMonth={referenceMonth} 
        referenceYear={referenceYear}
      />
      <GraficosGeral 
        importData={importData} 
        exportData={exportData} 
        selectedStartYear={referenceYear} 
        selectedEndYear={referenceYear}
        selectedStartMonth={1} 
        selectedEndMonth={referenceMonth}
      />
    </div>
  );
}

export default DashGeral;
