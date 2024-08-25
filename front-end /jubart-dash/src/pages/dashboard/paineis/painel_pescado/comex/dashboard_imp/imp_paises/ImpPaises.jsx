import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CardsPaisesImp from './components/cards/CardsPaisesImp';
import GraficosPaisesImp from './components/graficos/GraficosPaisesImp';
import TabelasPaisesImp from './components/tabelas/TabelasPaisesImp';

function ImpPaises() {
  const { importData, referenceMonth, referenceYear } = useOutletContext();


  if (!importData || !importData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard dashboard-importacao-paises">
      <CardsPaisesImp importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />
      <GraficosPaisesImp importData={importData} />
      <TabelasPaisesImp importData={importData} />
    </div>
  );
}

export default ImpPaises;
