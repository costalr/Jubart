import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import Pages from './pages/Pages'
import './assets/styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Pages />
      </div>
    </Router>
  );
}

export default App;
