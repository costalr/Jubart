import React from 'react';
import CardsImp from '../../../shared/CardsImp';
import GraficosPaisesImp from '../../components/graficos/GraficosPaisesImp';
import TabelasPaisesImp from '../../components/tabelas/TabelasPaisesImp';

function ImpPaisesGeral({ importData, referenceMonth, referenceYear }) {

  return (
    <div className="dashboard dashboard-importacao-paises">
      {/* Substituído CardsPaisesImp por CardsImp */}
      <CardsImp 
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
