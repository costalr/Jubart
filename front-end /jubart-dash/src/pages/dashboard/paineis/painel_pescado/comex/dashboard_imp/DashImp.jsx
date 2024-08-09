import React from 'react';
import CardsImp from './components/cards/CardsImp';
import GraficosImp from './components/graficos/GraficosImp';
import TabelasImp from './components/tabelas/TabelasImp';

function DashImp({ importData, referenceMonth, referenceYear }) {
  console.log("DashImp - Data:", { importData, referenceMonth, referenceYear });

  if (!importData || !importData.length || referenceMonth === null || referenceYear === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard dashboard-importacao">
      <CardsImp importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />
      <GraficosImp importData={importData} />
      <TabelasImp importData={importData} />
    </div>
  );
}


export default DashImp;
