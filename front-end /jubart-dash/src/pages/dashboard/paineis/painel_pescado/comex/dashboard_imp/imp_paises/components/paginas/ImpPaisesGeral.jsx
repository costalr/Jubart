import React from 'react';
import CardsPaisesImp from '../../components/cards/CardsPaisesImp';
import GraficosPaisesImp from '../../components/graficos/GraficosPaisesImp';
import TabelasPaisesImp from '../../components/tabelas/TabelasPaisesImp';

function ImpPaisesGeral({ importData, referenceMonth, referenceYear }) {

  return (
    <div className="dashboard dashboard-importacao-paises">
      <CardsPaisesImp 
        importData={importData} 
        referenceMonth={referenceMonth} 
        referenceYear={referenceYear} 
      />
      
      <GraficosPaisesImp 
        importData={importData}
        startYear={2010} // Example year range
        endYear={2024} 
        startMonth={1}
        endMonth={referenceMonth}
        isIndividual={false} // Set this to false for general report
      />

      <TabelasPaisesImp 
        importData={importData} 
        startYear={2010} // Example year range
        endYear={2024} 
        startMonth={1}
        endMonth={referenceMonth}
        isIndividual={false} // Set this to false for general report
      />
    </div>
  );
}

export default ImpPaisesGeral;
