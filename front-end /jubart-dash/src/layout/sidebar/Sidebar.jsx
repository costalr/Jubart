import React, { useState } from 'react';
import './Sidebar.css';
import profilePic from '../../assets/images/profile.jpg'; 
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarVisible }) => {
  const [activeMenu, setActiveMenu] = useState(null); // Controla qual menu principal está aberto
  const [activeSubMenu, setActiveSubMenu] = useState({ comex: true, importacao: false, exportacao: false, perfil: false, configuracoes: false, suporte: false }); // Controla quais submenus estão abertos
  const [selectedSubMenu, setSelectedSubMenu] = useState(null); // Controla qual submenu foi clicado
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Controla o dropdown do perfil
  const [selectedMenuItem, setSelectedMenuItem] = useState('Início'); // Para destacar o item clicado

  const navigate = useNavigate();

  // Controla o menu principal clicado
  const handleMenuClick = (menuName) => {
    setActiveMenu(prevMenu => prevMenu === menuName ? null : menuName); // Expande ou colapsa o menu
    setSelectedMenuItem(menuName); // Define o item selecionado para colorir de azul
  };

  // Controla a seleção do item
  const handleItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem); // Define o item selecionado e mantém o estilo ativo
    navigate(`/${menuItem.toLowerCase()}`); // Faz a navegação
  };

  // Controla o submenu clicado
  const handleSubMenuClick = (menu) => {
    setSelectedSubMenu(menu); // Define qual submenu foi clicado
    setTimeout(() => {
      setSelectedSubMenu(null); // Remove a seleção após um tempo para o efeito visual de azul
    }, 300); // Duração do efeito
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen); 
  };

  const toggleReportTypeSubMenu = (type) => {
    setActiveSubMenu((prevState) => ({
      ...prevState,
      [type]: !prevState[type], // Alterna entre expandir e recolher "Importação" e "Exportação"
    }));
  };

  // Controla a navegação para a página inicial
  const handleHomeClick = () => {
    handleItemClick('Início'); // Marca o menu "Início" como selecionado
    navigate('/dashboard');
  };

  // Controla a navegação dos submenus
  const navigateToPage = (submenuType, reportType, e) => {
    e.stopPropagation(); 
    
    const routes = {
      importacao: {
        paises: '/dashboard/importacao/paises',
        estados: '/dashboard/importacao/estados',
        categorias: '/dashboard/importacao/categorias',
        especies: '/dashboard/importacao/especies',
        ncm: '/dashboard/importacao/ncm',
      },
      exportacao: {
        paises: '/dashboard/exportacao/paises',
        estados: '/dashboard/exportacao/estados',
        categorias: '/dashboard/exportacao/categorias',
        especies: '/dashboard/exportacao/especies',
        ncm: '/dashboard/exportacao/ncm',
      },
    };

    navigate(routes[submenuType][reportType]);

    setActiveSubMenu((prevState) => ({
      ...prevState,
      comex: true, // Garante que o submenu COMEX permaneça aberto
    }));
  };

  return (
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <ul className="sidebar-menu">
        <li className="menu-category">Dashboard</li>
        <li 
          className={`menu-item ${selectedMenuItem === 'Início' ? 'selected' : ''}`} 
          onClick={handleHomeClick}
        >
          <div className="menu-item-content home-menu-item">
            <i className="bi bi-house-door menu-icon"></i>
            <span>Início</span>
          </div>
        </li>

        <li 
          className={`menu-item ${selectedMenuItem === 'Paineis' ? 'selected' : ''}`} 
          onClick={() => handleMenuClick('Paineis')}
        >
          <div className="menu-item-content">
            <i className="bi bi-bar-chart menu-icon"></i>
            <span>Paineis</span>
            <i className={`bi ${activeMenu === 'Paineis' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
          </div>
          {activeMenu === 'Paineis' && (
            <ul className="pannel-submenu">
              <li className={`submenu-item comex-menu-item ${activeSubMenu['comex'] ? 'open' : ''} ${selectedSubMenu === 'comex' ? 'selected' : ''}`} onClick={(e) => {
                e.stopPropagation();
                handleSubMenuClick('comex');
              }}>
                <div className="submenu-title">
                  COMEX
                  <i className={`bi ${activeSubMenu['comex'] ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
                </div>
                {activeSubMenu['comex'] && (
                  <ul className="comex-submenu">
                    <li 
                      className={`comex-submenu-item ${activeSubMenu['importacao'] ? 'open' : ''}`} 
                      onClick={() => toggleReportTypeSubMenu('importacao')}
                    >
                      <span>Importação</span>
                      <i className={`bi ${activeSubMenu['importacao'] ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
                    </li>
                    {activeSubMenu['importacao'] && (
                      <ul>
                        {['paises', 'estados', 'categorias', 'especies', 'ncm'].map((option) => (
                          <li className={`comex-submenu-item ${selectedSubMenu === option ? 'selected' : ''}`} key={option} onClick={(e) => {
                            navigateToPage('importacao', option, e);
                            handleSubMenuClick(option);
                          }}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </li>
                        ))}
                      </ul>
                    )}
                    <li 
                      className={`comex-submenu-item ${activeSubMenu['exportacao'] ? 'open' : ''}`} 
                      onClick={() => toggleReportTypeSubMenu('exportacao')}
                    >
                      <span>Exportação</span>
                      <i className={`bi ${activeSubMenu['exportacao'] ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
                    </li>
                    {activeSubMenu['exportacao'] && (
                      <ul>
                        {['paises', 'estados', 'categorias', 'especies', 'ncm'].map((option) => (
                          <li className={`comex-submenu-item ${selectedSubMenu === option ? 'selected' : ''}`} key={option} onClick={(e) => {
                            navigateToPage('exportacao', option, e);
                            handleSubMenuClick(option);
                          }}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        <li className="menu-category">Aplicação</li>
        <li 
          className={`menu-item ${selectedMenuItem === 'Perfil' ? 'selected' : ''}`} 
          onClick={() => handleMenuClick('Perfil')}
        >
          <div className="menu-item-content">
            <i className="bi bi-person profile-icon menu-icon"></i>
            <span>Perfil</span>
            <i className={`bi ${activeMenu === 'Perfil' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
          </div>
          {activeMenu === 'Perfil' && (
            <ul className="profile-submenu">
              <li className={`profile-submenu-item ${selectedSubMenu === 'Ver perfil' ? 'selected' : ''}`} onClick={() => handleSubMenuClick('Ver perfil')}>Ver perfil</li>
              <li className={`profile-submenu-item ${selectedSubMenu === 'Editar perfil' ? 'selected' : ''}`} onClick={() => handleSubMenuClick('Editar perfil')}>Editar perfil</li>
            </ul>
          )}
        </li>

        <li 
          className={`menu-item ${selectedMenuItem === 'Configurações' ? 'selected' : ''}`} 
          onClick={() => handleMenuClick('Configurações')}
        >
          <div className="menu-item-content">
            <i className="bi bi-gear settings-icon menu-icon"></i>
            <span>Configurações</span>
            <i className={`bi ${activeMenu === 'Configurações' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
          </div>
          {activeMenu === 'Configurações' && (
            <ul className="settings-submenu">
              <li className={`settings-submenu-item ${selectedSubMenu === 'Conta' ? 'selected' : ''}`} onClick={() => handleSubMenuClick('Conta')}>Conta</li>
            </ul>
          )}
        </li>

        <li className="menu-category">Suporte</li>
        <li 
          className={`menu-item ${selectedMenuItem === 'Suporte' ? 'selected' : ''}`} 
          onClick={() => handleMenuClick('Suporte')}
        >
          <div className="menu-item-content">
            <i className="bi bi-question-circle suport-icon menu-icon"></i>
            <span>Suporte</span>
            <i className={`bi ${activeMenu === 'Suporte' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
          </div>
          {activeMenu === 'Suporte' && (
            <ul className="suport-submenu">
              <li className={`suport-submenu-item ${selectedSubMenu === 'Documentação' ? 'selected' : ''}`} onClick={() => handleSubMenuClick('Documentação')}>Documentação</li>
              <li className={`suport-submenu-item ${selectedSubMenu === 'Fale Conosco' ? 'selected' : ''}`} onClick={() => handleSubMenuClick('Fale Conosco')}>Fale Conosco</li>
              <li className={`suport-submenu-item ${selectedSubMenu === 'Feedback' ? 'selected' : ''}`} onClick={() => handleSubMenuClick('Feedback')}>Feedback</li>
            </ul>
          )}
        </li>
      </ul>

      <div className="profile-box" onClick={toggleProfileDropdown}>
        <img src={profilePic} alt="Profile" />
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
