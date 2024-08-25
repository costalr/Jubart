import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ImpPaises from '../dashboard_imp/imp_paises/ImpPaises';
import ImpNCM from '../dashboard_imp/imp_ncm/ImpNCM';
import ImpEstados from '../dashboard_imp/imp_estados/ImpEstados';
import ImpEspecies from '../dashboard_imp/imp_especies/ImpEspecies';
import ImpCategorias from '../dashboard_imp/imp_categorias/ImpCategorias';

function DashImp({ importData, referenceMonth, referenceYear }) {
  return (
    <div className="dashboard-importacao">
      <h1>Dashboard de Importação</h1>
      <Routes>
        <Route 
          path="paises" 
          element={<ImpPaises importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="ncm" 
          element={<ImpNCM importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="estados" 
          element={<ImpEstados importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="especies" 
          element={<ImpEspecies importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="categorias" 
          element={<ImpCategorias importData={importData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route path="/" element={<Navigate to="paises" />} />
      </Routes>
    </div>
  );
}

export default DashImp;
