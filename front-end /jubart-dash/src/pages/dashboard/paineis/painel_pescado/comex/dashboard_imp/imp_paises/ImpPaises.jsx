import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ImpPaisesIndividual from './components/paginas/ImpPaisesIndividual';
import ImpPaisesGeral from './components/paginas/ImpPaisesGeral';

function ImpPaises() {
  const { importData, referenceMonth, referenceYear, selectedReportOption, selectedCountry } = useOutletContext();
  const { pais } = useParams();

  if (!importData || !importData.length) {
    return <div>Loading...</div>;
  }

  // Usando o `pais` dos parâmetros da URL como `selectedCountry` ou mantendo o `selectedCountry` do contexto.
  const countryToUse = pais || selectedCountry;

  return (
    <div className="dashboard dashboard-importacao-paises">
      {countryToUse ? (
        <ImpPaisesIndividual
          importData={importData}
          referenceMonth={referenceMonth}
          referenceYear={referenceYear}
          selectedCountry={countryToUse}
          selectedReportOption={selectedReportOption}
        />
      ) : (
        <ImpPaisesGeral
          importData={importData}
          referenceMonth={referenceMonth}
          referenceYear={referenceYear}
          selectedCountry={countryToUse}
        />
      )}
    </div>
  );
}


export default ImpPaises;
