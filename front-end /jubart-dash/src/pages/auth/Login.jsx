import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/images/logo/LogoExtended.png';

function Login() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', {
        code,
        password
      });
      console.log('Login response:', response.data); // Adicionado para debug
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      navigate('/dashboard'); // Redirecionar para o dashboard
    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data : error);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="login-box">
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Código da Empresa" 
            className="login-input" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="login-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">Entrar</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        <a href="#" className="forgot-password">Precisa de ajuda?</a>
      </div>
    </div>
  );
}

export default Login;
