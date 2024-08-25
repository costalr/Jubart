import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashGeral from './dashboard/paineis/painel_pescado/comex/dashboard_geral/DashGeral';
import DashImp from './dashboard/paineis/painel_pescado/comex/dashboard_imp/DashImp';
import DashExp from './dashboard/paineis/painel_pescado/comex/dashboard_exp/DashExp';
import Login from './auth/Login';
import Layout from './../layout/Layout';

function Pages() {
  const isAuthenticated = !!localStorage.getItem('access');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="geral" />} />
        <Route path="geral" element={<DashGeral />} />
        <Route path="importacao/*" element={<DashImp />} />
        <Route path="exportacao/*" element={<DashExp />} />
      </Route>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default Pages;
