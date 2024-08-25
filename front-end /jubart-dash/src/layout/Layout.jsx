import React, { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import Comex from '../pages/dashboard/paineis/painel_pescado/comex/Comex';
import { fetchImportData, fetchExportData } from '../api/fetchApi';
import './Layout.css';

function Layout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState('geral');

  // Estados para armazenar dados normalizados
  const [importData, setImportData] = useState({});
  const [exportData, setExportData] = useState({});

  // Função para alternar a barra lateral
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Função para alterar a seção selecionada
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // Carregar dados de importação e exportação
  useEffect(() => {
    const loadData = async () => {
      try {
        const importDataResult = await fetchImportData();
        const exportDataResult = await fetchExportData();
        setImportData(importDataResult);
        setExportData(exportDataResult);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
  
    loadData();
  }, []);
  
  return (
    <div className="app-layout">
      <Navbar toggleSidebar={toggleSidebar} isSidebarExpanded={isSidebarExpanded} />
      <div className="main-layout">
        <Sidebar
          isExpanded={isSidebarExpanded}
          onSectionChange={handleSectionChange}
          countries={importData.dataByCountry}
          categories={importData.dataByCategory}
          ncm={importData.dataByNCM}
          states={importData.dataByState}
        />
        <div className={`content ${isSidebarExpanded ? 'content-expanded' : 'content-collapsed'}`}>
          <div className="main-content">
            <Comex selectedSection={selectedSection} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
