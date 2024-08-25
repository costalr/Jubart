import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Comex from './comex/Comex';
import Fao from './fao/Fao';
import Ibge from './ibge/Ibge';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="painel-primario painel-pescado">
      <Routes>
        <Route path="comex/*" element={<Comex />} />
        <Route path="fao" element={<Fao />} />
        <Route path="ibge" element={<Ibge />} />
        <Route path="/" element={<Navigate to="comex/geral" />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
