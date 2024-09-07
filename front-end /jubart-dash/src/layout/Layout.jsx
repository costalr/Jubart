import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Comex from '../pages/dashboard/paineis/painel_pescado/comex/Comex';
import { fetchImportData, fetchExportData } from '../api/fetchApi';
import './Layout.css';

function Layout({ children, isSidebarVisible }) {
  const [importData, setImportData] = useState({});
  const [exportData, setExportData] = useState({});

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedNcm, setSelectedNcm] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const importDataResult = await fetchImportData();
        const exportDataResult = await fetchExportData();
        setImportData(importDataResult);
        setExportData(exportDataResult);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="app-layout">
      <div className="main-layout">
        {isSidebarVisible && (
          <Sidebar
            countries={importData.dataByCountry}
            categories={importData.dataByCategory}
            ncm={importData.dataByNCM}
            states={importData.dataByState}
            onCountryChange={setSelectedCountry}
            onCategoryChange={setSelectedCategory}
            onStateChange={setSelectedState}
            onNcmChange={setSelectedNcm}
          />
        )}

        {/* Conteúdo Principal */}
        <div className={`content ${isSidebarVisible ? 'content-expanded' : 'content-hidden'}`}>
          <div className="main-content">
            <Comex
              selectedCountry={selectedCountry}
              selectedCategory={selectedCategory}
              selectedState={selectedState}
              selectedNcm={selectedNcm}
              importData={importData}
              exportData={exportData}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
