import React from 'react';
import CardsNCMImp from './components/cards/CardsNCMImp'; // Componente para exibir cards resumidos
import GraficosNCMImp from './components/graficos/GraficosNCMImp'; // Componente para gráficos
import TabelasNCMImp from './components/tabelas/TabelasNCMImp'; // Componente para tabelas

function ImpNCM({ importData }) {
  if (!importData || !importData.length) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="dashboard-importacao-ncm">
      <h1>Dados de Importação por NCM</h1>
      <CardsNCMImp importData={importData} />
      <GraficosNCMImp importData={importData} />
      <TabelasNCMImp importData={importData} />
    </div>
  );
}

export default ImpNCM;
