import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <Comex />
      <Fao />
      <Ibge />
    </div>
  );
}

export default Dashboard;
