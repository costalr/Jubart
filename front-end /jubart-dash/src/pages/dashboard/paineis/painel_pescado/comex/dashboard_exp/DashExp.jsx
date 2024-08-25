import React from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import ExpPaises from '../dashboard_exp/exp_paises/ExpPaises';
import ExpNCM from '../dashboard_exp/exp_ncm/ExpNCM';
import ExpEstados from '../dashboard_exp/exp_estados/ExpEstados';
import ExpEspecies from '../dashboard_exp/exp_especies/ExpEspecies';
import ExpCategorias from '../dashboard_exp/exp_categorias/ExpCategorias';

function DashExp() {
  const { exportData, referenceMonth, referenceYear } = useOutletContext();

  return (
    <div className="dashboard-exportacao">
      <h1>Dashboard de Exportação</h1>
      <Routes>
        <Route 
          path="paises" 
          element={<ExpPaises exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="ncm" 
          element={<ExpNCM exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="estados" 
          element={<ExpEstados exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="especies" 
          element={<ExpEspecies exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route 
          path="categorias" 
          element={<ExpCategorias exportData={exportData} referenceMonth={referenceMonth} referenceYear={referenceYear} />} 
        />
        <Route path="/" element={<Navigate to="paises" />} />
      </Routes>
    </div>
  );
}

export default DashExp;
