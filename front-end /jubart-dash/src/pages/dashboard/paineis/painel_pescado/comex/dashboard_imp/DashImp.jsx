import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ImpPaises from '../dashboard_imp/imp_paises/ImpPaises';

function DashImp({ importData, referenceMonth, referenceYear, specificReportRequest, selectedReportOption, selectedCountry }) {
  
  useEffect(() => {
    // A lógica de efeito foi mantida caso você precise adicionar qualquer lógica de efeito no futuro
  }, [importData, referenceMonth, referenceYear, specificReportRequest, selectedReportOption, selectedCountry]);

  return (
    <div className="dashboard-importacao">
      <h1>Dashboard de Importação</h1>
      <Routes>
        <Route 
          path="paises/:pais/:reportOption" 
          element={
            <ImpPaises 
              importData={importData} 
              referenceMonth={referenceMonth} 
              referenceYear={referenceYear} 
              specificReportRequest={specificReportRequest}
              selectedReportOption={selectedReportOption}
              selectedCountry={selectedCountry}  
            />
          } 
        />
        <Route 
          path="paises" 
          element={
            <ImpPaises 
              importData={importData} 
              referenceMonth={referenceMonth} 
              referenceYear={referenceYear} 
              specificReportRequest={specificReportRequest}
              selectedReportOption={selectedReportOption}
              selectedCountry={null} 
            />
          } 
        />
        <Route path="/" element={<Navigate to="paises" />} />
      </Routes>
    </div>
  );
}

export default DashImp;
