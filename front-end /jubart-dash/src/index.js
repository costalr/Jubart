import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/global.css'
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider, createTheme } from '@mui/material/styles';

// Aqui você cria o tema do Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Cor principal do tema
    },
    secondary: {
      main: '#dc004e', // Cor secundária do tema
    },
    // Adicione outras customizações aqui
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
