import React from 'react';
import CardsPaisesImp from '../cards/CardsPaisesImp';
import GraficosPaisesImp from '../graficos/GraficosPaisesImp';
import TabelasPaisesImp from '../tabelas/TabelasPaisesImp';

function ImpPaisesIndividual({ importData, referenceMonth, referenceYear, selectedCountry, selectedReportOption }) {

  // Filtrar dados por país selecionado
  const filteredData = importData.filter(item => item.pais === selectedCountry);

  return (
    <div className="dashboard dashboard-importacao-paises-individual">      
      <CardsPaisesImp 
        importData={filteredData} // Usar os dados filtrados
        referenceMonth={referenceMonth}
        referenceYear={referenceYear}
        selectedCountry={selectedCountry}
        selectedReportOption={selectedReportOption}
      />

      <GraficosPaisesImp
        importData={filteredData} // Usar os dados filtrados
        referenceMonth={referenceMonth}
        referenceYear={referenceYear}
        selectedCountry={selectedCountry}  // Passando selectedCountry
        selectedReportOption={selectedReportOption}
        isIndividual={true}
      />

      <TabelasPaisesImp 
        importData={filteredData} // Usar os dados filtrados
        referenceMonth={referenceMonth}
        referenceYear={referenceYear}
        selectedCountry={selectedCountry}
        selectedReportOption={selectedReportOption}
        isIndividual={true}
      />

    </div>
  );
}

export default ImpPaisesIndividual;
