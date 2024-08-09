import React, { useState } from 'react';
import './Sidebar.css';
import profilePic from '../../assets/images/profile.jpg'; // Atualize o caminho da imagem conforme necessário

const Sidebar = ({ isExpanded, onSectionChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <ul className="sidebar-menu">
        <li className="menu-item">
          <div className="menu-item-content home-menu-item">
            <i className="bi bi-house-door menu-icon"></i>
            {isExpanded && <span>Início</span>}
          </div>
        </li>
        <li className={`dashboard-menu-item ${activeMenu === 'paineis' ? 'active' : ''}`} onClick={() => handleMenuClick('paineis')}>
          <div className="dashboard-menu-item-content">
            <i className="bi bi-bar-chart menu-icon"></i>
            {isExpanded && <span>Paineis</span>}
            {isExpanded && <i className="bi bi-chevron-down arrow-icon"></i>}
          </div>
          {isExpanded && activeMenu === 'paineis' && (
            <ul className="pannels-submenu">
              <li className="comex-submenu-container">
                <div className="submenu-item-content">
                  Comex
                  {isExpanded && <i className="bi bi-chevron-down arrow-icon"></i>}
                </div>
                <ul className="comex-submenu">
                  <li className="comex-submenu-item" onClick={() => onSectionChange('geral')}>Geral</li>
                  <li className="comex-submenu-item" onClick={() => onSectionChange('import')}>Importação</li>
                  <li className="comex-submenu-item" onClick={() => onSectionChange('export')}>Exportação</li>
                </ul>
              </li>
              <li className="fao-submenu-item" onClick={() => onSectionChange('fao')}>FAO</li>
              <li className="ibge-submenu-item" onClick={() => onSectionChange('ibge')}>IBGE</li>
            </ul>
          )}
        </li>
        <li className={`menu-item ${activeMenu === 'perfil' ? 'active' : ''}`} onClick={() => handleMenuClick('perfil')}>
          <div className="menu-item-content">
            <i className="bi bi-person menu-icon"></i>
            {isExpanded && <span>Perfil</span>}
            {isExpanded && <i className="bi bi-chevron-down arrow-icon"></i>}
          </div>
          {isExpanded && activeMenu === 'perfil' && (
            <ul className="profile-submenu">
              <li className="profile-submenu-item">Ver perfil</li>
              <li className="profile-submenu-item">Editar perfil</li>
            </ul>
          )}
        </li>
        <li className={`menu-item ${activeMenu === 'configuracoes' ? 'active' : ''}`} onClick={() => handleMenuClick('configuracoes')}>
          <div className="menu-item-content">
            <i className="bi bi-gear menu-icon"></i>
            {isExpanded && <span>Configurações</span>}
            {isExpanded && <i className="bi bi-chevron-down arrow-icon"></i>}
          </div>
          {isExpanded && activeMenu === 'configuracoes' && (
            <ul className="configuracoes-submenu">
              <li className="configuracoes-submenu-item">Conta</li>
            </ul>
          )}
        </li>
        <li className={`menu-item ${activeMenu === 'suporte' ? 'active' : ''}`} onClick={() => handleMenuClick('suporte')}>
          <div className="menu-item-content">
            <i className="bi bi-question-circle menu-icon"></i>
            {isExpanded && <span>Suporte</span>}
            {isExpanded && <i className="bi bi-chevron-down arrow-icon"></i>}
          </div>
          {isExpanded && activeMenu === 'suporte' && (
            <ul className="suporte-submenu">
              <li className="suporte-submenu-item">Documentação</li>
              <li className="suporte-submenu-item">Fale Conosco</li>
              <li className="suporte-submenu-item">Feedback</li>
            </ul>
          )}
        </li>
      </ul>
      <div className="profile-box" onClick={toggleProfileDropdown}>
        <img src={profilePic} alt="Profile" />
        {isExpanded && (
          <div className="profile-details">
            <span className="profile-name">Lara Costa</span>
            <span className="profile-role">Desenvolvedora</span>
          </div>
        )}
        <div className={`dropdown ${profileDropdownOpen ? 'active' : ''}`}>
          {isExpanded && <i className="bi bi-chevron-down"></i>}
        </div>
        {profileDropdownOpen && (
          <div className="sidebar-profile-dropdown">
            <div className="profile-dropdown-item">Sair</div>
            <div className="profile-dropdown-item">Perfil</div>
            <div className="profile-dropdown-item">Conta</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
