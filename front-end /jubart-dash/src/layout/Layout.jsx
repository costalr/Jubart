import React, { useState } from 'react';
import Navbar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import Comex from '../pages/dashboard/paineis/painel_pescado/comex/Comex';
import './Layout.css';

function Layout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState('geral');

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="app-layout">
      <Navbar toggleSidebar={toggleSidebar} isSidebarExpanded={isSidebarExpanded} />
      <div className="main-layout">
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          onSectionChange={handleSectionChange}
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
