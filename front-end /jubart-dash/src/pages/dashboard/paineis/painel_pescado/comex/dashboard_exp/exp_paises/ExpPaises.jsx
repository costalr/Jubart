import React from 'react';
import TabelasPaisesExp from './components/tabelas/TabelasPaisesExp';
import CardsPaisesExp from './components/cards/CardsPaisesExp';
import GraficosPaisesExp from './components/graficos/GraficosPaisesExp';

function ExpPaises({ exportData, referenceMonth, referenceYear }) {

  if (!exportData || !exportData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard dashboard-exportacao-paises">
      <CardsPaisesExp exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />
      <GraficosPaisesExp exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />
      <TabelasPaisesExp exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />
    </div>
  );
}

export default ExpPaises;
