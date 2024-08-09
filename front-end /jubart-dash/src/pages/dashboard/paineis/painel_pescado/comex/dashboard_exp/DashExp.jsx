import React from 'react';
import CardsExp from './components/cards/CardsExp';
import GraficosExp from './components/graficos/GraficosExp';
import TabelasExp from './components/tabelas/TabelasExp';

function DashExp({ exportData, referenceMonth, referenceYear }) {
  console.log("DashExp - Data:", { exportData, referenceMonth, referenceYear });

  if (!exportData || !exportData.length || referenceMonth === null || referenceYear === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard dashboard-exportacao">
      <CardsExp exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />
      <GraficosExp exportData={exportData} />
      <TabelasExp exportData={exportData} />
    </div>
  );
}

export default DashExp;
