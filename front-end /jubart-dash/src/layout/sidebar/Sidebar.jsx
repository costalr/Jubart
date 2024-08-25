import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import profilePic from '../../assets/images/profile.jpg';
import Selectors from '../../components/selectors/Selectors';
import { fetchImportData, fetchExportData } from '../../api/fetchApi';
import { getGroupedItem } from '../../api/indexedDBGrouped';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isExpanded, onSectionChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState({});
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [specificReportRequest, setSpecificReportRequest] = useState(false);

  const [selectorData, setSelectorData] = useState({
    paises: null,
    categorias: null,
    especies: null,
    ncm: null,
    estados: null,
  });

  const navigate = useNavigate();
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    if (!dataLoadedRef.current) {
      console.log("Fetching data...");
      const loadData = async () => {
        const [importData, exportData] = await Promise.all([fetchImportData(), fetchExportData()]);
        console.log("Data fetched:", { importData, exportData });

        const paises = await getGroupedItem('paises') || extractUniqueValues(importData, 'pais');
        const categorias = await getGroupedItem('categorias') || extractUniqueValues(importData, 'categoria');
        const especies = await getGroupedItem('especies') || extractUniqueValues(importData, 'especie');
        const ncm = await getGroupedItem('ncm') || extractUniqueValues(importData, 'ncm');
        const estados = await getGroupedItem('estados') || extractUniqueValues(importData, 'estado');

        setSelectorData({ paises, categorias, especies, ncm, estados });
      };
      loadData();
      dataLoadedRef.current = true;
    }
  }, []);

  const extractUniqueValues = (data, group) => {
    if (!data || !data[`por_${group}`]) {
        console.error(`No data found for group: ${group}`);
        return [];
    }

    if (group === 'ncm') {
        return [...new Set(Object.values(data[`por_${group}`]).flat().map(item => item.coNcm))]
            .map(coNcm => ({ value: coNcm, label: coNcm }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    return Object.keys(data[`por_${group}`])
        .map(key => ({ value: key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
  };

  const setSelectedCountry = (country) => {
    setSelectorData(prevState => ({ ...prevState, selectedCountry: country }));
  };

  const setSelectedCategory = (category) => {
    setSelectorData(prevState => ({ ...prevState, selectedCategory: category }));
  };

  const setSelectedSpecies = (species) => {
    setSelectorData(prevState => ({ ...prevState, selectedSpecies: species }));
  };

  const setSelectedNcm = (ncm) => {
    setSelectorData(prevState => ({ ...prevState, selectedNcm: ncm }));
  };

  const setSelectedState = (state) => {
    setSelectorData(prevState => ({ ...prevState, selectedState: state }));
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu((prevActiveMenu) => (prevActiveMenu === menuName ? null : menuName));
    setActiveSubMenu({});
  };

  const handleSubMenuClick = (menu, submenu) => {
    console.log(`Toggling submenu for menu: ${menu}, submenu: ${submenu}`);
    setActiveSubMenu((prevState) => ({
      ...prevState,
      [menu]: prevState[menu] === submenu ? submenu : submenu,
    }));
  };

  const handleReportTypeChange = (type) => {
    console.log(`Report Type Changed: ${type}`);
    setSelectedReportType(type);
    setSpecificReportRequest(false);
    setActiveSubMenu((prevState) => ({
      ...prevState,
      comex: prevState['comex'],
    }));

    // Navegação baseada no tipo de relatório selecionado
    if (type === 'geral') {
      navigate('/dashboard/geral');
    } else if (type === 'importacao') {
      navigate('/dashboard/importacao/paises');
    } else if (type === 'exportacao') {
      navigate('/dashboard/exportacao/paises');
    }
  };


  const handleSpecificReportRequestChange = (value) => {
    console.log(`Specific Report Request Changed: ${value}`);
    setSpecificReportRequest(value);
    setActiveSubMenu((prevState) => ({
      ...prevState,
      comex: prevState['comex'],
    }));
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const reportTypeDescriptions = {
    paises: 'um país específico?',
    estados: 'um estado específico?',
    categorias: 'uma categoria específica?',
    especies: 'uma espécie específica?',
    ncm: 'um NCM específico?',
  };

  const navigateToPage = (reportType, submenuType) => {
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
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <ul className="sidebar-menu">
        <li className="menu-item">
          <div className="menu-item-content home-menu-item" onClick={() => onSectionChange('inicio')}>
            <i className="bi bi-house-door menu-icon"></i>
            {isExpanded && <span>Início</span>}
          </div>
        </li>
        <li className={`dashboard-menu-item ${activeMenu === 'paineis' ? 'active' : ''}`} onClick={() => handleMenuClick('paineis')}>
          <div className="dashboard-menu-item-content">
            <i className="bi bi-bar-chart menu-icon"></i>
            {isExpanded && <span>Paineis</span>}
            {isExpanded && <i className={`bi ${activeMenu === 'paineis' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>}
          </div>
          {isExpanded && activeMenu === 'paineis' && (
            <ul className="pannels-submenu">
              <li className={`submenu-item comex-menu-item ${activeSubMenu['paineis'] === 'comex' ? 'open' : ''}`} onClick={(e) => {
                e.stopPropagation();
                handleSubMenuClick('paineis', 'comex');
              }}>
                Comex
                {isExpanded && (
                  <i className={`bi ${activeSubMenu['paineis'] === 'comex' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
                )}
                {isExpanded && activeSubMenu['paineis'] === 'comex' && (
                  <ul className="comex-submenu">
                    <li className="comex-submenu-item" onClick={(e) => e.stopPropagation()}>
                      <label>
                        <input
                          type="radio"
                          name="report_type"
                          value="geral"
                          checked={selectedReportType === 'geral'}
                          onChange={() => handleReportTypeChange('geral')}
                        />
                        Geral
                      </label>
                    </li>
                    {['importacao', 'exportacao'].map((reportType) => (
                      <li className="comex-submenu-item" key={reportType} onClick={(e) => {
                        e.stopPropagation();
                        handleSubMenuClick('comex', reportType);
                      }}>
                        <label>
                          <input
                            type="radio"
                            name="report_type"
                            value={reportType}
                            checked={selectedReportType === reportType}
                            onChange={() => handleReportTypeChange(reportType)}
                          />
                          {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
                        </label>
                        {activeSubMenu['comex'] === reportType && (
                          <ul className="report-options">
                            {['paises', 'estados', 'categorias', 'especies', 'ncm'].map((option) => (
                              <li className="comex-submenu-item" key={option} onClick={(e) => {
                                e.stopPropagation();
                                handleReportTypeChange(option);
                                navigateToPage(option, reportType);
                              }}>
                                <label>
                                  <input
                                    type="radio"
                                    name={`${reportType}_report`}
                                    checked={selectedReportType === option}
                                    onChange={() => handleReportTypeChange(option)}
                                  />
                                  {option.charAt(0).toUpperCase() + option.slice(1)}
                                </label>
                              </li>
                            ))}
                            {selectedReportType && reportTypeDescriptions[selectedReportType] && (
                              <div>
                                <span className='relatory-container'>Você gostaria de um relatório sobre {reportTypeDescriptions[selectedReportType]}</span>
                                <label>
                                  <input
                                    type="radio"
                                    name="specific_report"
                                    checked={specificReportRequest === true}
                                    onChange={() => handleSpecificReportRequestChange(true)}
                                  /> Sim
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name="specific_report"
                                    checked={specificReportRequest === false}
                                    onChange={() => handleSpecificReportRequestChange(false)}
                                  /> Não
                                </label>
                              </div>
                            )}
                            {specificReportRequest && (
                              <div className="selector-group">
                                <Selectors
                                  selectedReportType={selectedReportType}
                                  onCountryChange={setSelectedCountry}
                                  onCategoryChange={setSelectedCategory}
                                  onSpeciesChange={setSelectedSpecies}
                                  onNcmChange={setSelectedNcm}
                                  onStateChange={setSelectedState}
                                  selectorData={selectorData}
                                />
                              </div>
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
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
            {isExpanded && <i className={`bi ${activeMenu === 'perfil' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>}
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
            {isExpanded && <i className={`bi ${activeMenu === 'configuracoes' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>}
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
            {isExpanded && <i className={`bi ${activeMenu === 'suporte' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>}
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
