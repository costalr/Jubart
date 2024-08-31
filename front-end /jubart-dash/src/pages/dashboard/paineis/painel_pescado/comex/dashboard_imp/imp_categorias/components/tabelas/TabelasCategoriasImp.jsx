import React, { useEffect, useState } from 'react';

function TabelasCategoriasImp({ importData }) {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const processData = () => {
      let dataByCategory = {};

      importData.forEach(item => {
        const { categoria, total_usd, total_kg } = item;
        
        if (!dataByCategory[categoria]) {
          dataByCategory[categoria] = { totalFOB: 0, totalKG: 0 };
        }

        dataByCategory[categoria].totalFOB += parseFloat(total_usd);
        dataByCategory[categoria].totalKG += parseFloat(total_kg);
      });

      const processedData = Object.keys(dataByCategory).map(category => ({
        categoria: category,
        totalFOB: dataByCategory[category].totalFOB.toFixed(2),
        totalKG: dataByCategory[category].totalKG.toFixed(2) + ' kg',
      }));

      setCategoryData(processedData);
    };

    processData();
  }, [importData]);

  return (
    <div className="tabela-categorias-imp">
      <h2>Valores por Categoria</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Total FOB (US$)</th>
            <th>Total KG</th>
          </tr>
        </thead>
        <tbody>
          {categoryData.map((row, index) => (
            <tr key={index}>
              <td>{row.categoria}</td>
              <td>{row.totalFOB}</td>
              <td>{row.totalKG}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelasCategoriasImp;
