import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
      Logout
    </button>
  );
}

export default Logout;
