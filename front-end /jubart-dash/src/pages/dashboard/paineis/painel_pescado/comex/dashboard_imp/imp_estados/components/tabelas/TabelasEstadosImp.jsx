import React, { useEffect, useState } from 'react';

function TabelasEstadosImp({ importData }) {
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    const processData = () => {
      let dataByState = {};

      importData.forEach(item => {
        const { estado, total_usd, total_kg } = item;
        
        if (!dataByState[estado]) {
          dataByState[estado] = { totalFOB: 0, totalKG: 0 };
        }

        dataByState[estado].totalFOB += parseFloat(total_usd);
        dataByState[estado].totalKG += parseFloat(total_kg);
      });

      const processedData = Object.keys(dataByState).map(state => ({
        estado: state,
        totalFOB: dataByState[state].totalFOB.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' }),
        totalKG: `${dataByState[state].totalKG.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg`,
      }));

      setStateData(processedData);
    };

    processData();
  }, [importData]);

  return (
    <div className="tabela-estados-exp">
      <h2>Valores por Estado</h2>
      <table>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Total FOB (US$)</th>
            <th>Total KG</th>
          </tr>
        </thead>
        <tbody>
          {stateData.map((row, index) => (
            <tr key={index}>
              <td>{row.estado}</td>
              <td>{row.totalFOB}</td>
              <td>{row.totalKG}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelasEstadosImp;
