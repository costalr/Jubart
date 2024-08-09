import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Comex from './dashboard/paineis/painel_pescado/comex/Comex';
import Login from './auth/Login'
import Layout from './../layout/Layout'
function Pages() {
  const isAuthenticated = !!localStorage.getItem('access');
  console.log('isAuthenticated:', isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/*"
        element={isAuthenticated ? <Layout><Comex /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default Pages;
