import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CardsGeral from './components/cards/CardsGeral';
import GraficosGeral from './components/graficos/GraficosGeral';

function DashGeral() {
  // Recebe os dados do Outlet
  const { importData, exportData, error, referenceMonth, referenceYear } = useOutletContext();


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
