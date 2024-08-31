import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import profilePic from '../../assets/images/profile.jpg';
import Selectors from '../../components/selectors/Selectors';
import { fetchImportData, fetchExportData } from '../../api/fetchApi';
import { getGroupedItem, setGroupedItem } from '../../api/indexedDBGrouped';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isExpanded, onSectionChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState({});
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [specificReportRequest, setSpecificReportRequest] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState(null);
  const [isReportOptionsVisible, setReportOptionsVisible] = useState(false);

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
      const loadData = async () => {
        const [importData, exportData] = await Promise.all([fetchImportData(), fetchExportData()]);

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

    const filteredOptions = Object.keys(data[`por_${group}`])
      .filter(key => {
        // Filtra os países com dados válidos (onde total_kg e total_usd são maiores que 0)
        return data[`por_${group}`][key].some(item => parseFloat(item.total_kg) > 0 && parseFloat(item.total_usd) > 0);
      })
      .map(key => ({ value: key, label: key }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return filteredOptions;
  };

  const setSelectedCountry = (country) => {
    setSelectorData(prevState => ({ ...prevState, selectedCountry: country }));

    if (specificReportRequest && selectedReportOption) {
        navigate(`/dashboard/importacao/paises/${country}/${selectedReportOption}`);
    } else if (specificReportRequest) {
        navigate(`/dashboard/importacao/paises/${country}/estados`);
    } else {
        navigate(`/dashboard/importacao/paises/${country}`);
    }
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
    // Evita fechar o submenu ao clicar em opções específicas
    if (menu === 'comex' && activeSubMenu[menu] === submenu) {
      return;
    }

    setActiveSubMenu((prevState) => ({
      ...prevState,
      [menu]: prevState[menu] === submenu ? null : submenu,
    }));
  };

  const handleReportTypeChange = (type) => {
    setSelectedReportType(type);
    setSpecificReportRequest(false);
    setReportOptionsVisible(false); // Reseta a visibilidade das opções específicas

    // Mantém o submenu "Comex" aberto enquanto o tipo de relatório é alterado
    setActiveSubMenu((prevState) => ({
      ...prevState,
      comex: 'importacao' === type || 'exportacao' === type ? 'comex' : prevState.comex,
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

  const handleSpecificReportRequestChange = async (value) => {
    setSpecificReportRequest(value);
    setReportOptionsVisible(value);

    if (value && selectedReportType && selectorData[selectedReportType]?.length > 0) {
        const firstItem = selectorData[selectedReportType][0]?.value;

        if (firstItem) {
            const subcategoryMap = {
                paises: 'estados',
                categorias: 'subcategoria',
                especies: 'subespecie',
                ncm: 'subncm'
            };

            const subcategory = subcategoryMap[selectedReportType];

            if (subcategory) {
                navigate(`/dashboard/importacao/${selectedReportType}/${firstItem}/${subcategory}`);
            } else {
                navigate(`/dashboard/importacao/${selectedReportType}/${firstItem}`);
            }
        }
    }
  };

  const filteredReportOptions = ['paises', 'estados', 'categorias', 'especies', 'ncm'].filter(
    (option) => option !== selectedReportType
  );

  const handleReportOptionChange = (option) => {
    setSelectedReportOption(option);

    if (specificReportRequest && selectorData.selectedCountry) {
      navigate(`/dashboard/importacao/paises/${selectorData.selectedCountry}/${option}`);
    }
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

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <ul className="sidebar-menu">
        <li className="menu-item">
          <div className="menu-item-content home-menu-item" onClick={handleHomeClick}>
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
                COMEX
                {isExpanded && (
                  <i className={`bi ${activeSubMenu['paineis'] === 'COMEX' ? 'bi-chevron-up' : 'bi-chevron-down'} arrow-icon`}></i>
                )}
                {isExpanded && activeSubMenu['paineis'] === 'comex' && (
                  <ul className={`comex-submenu ${isReportOptionsVisible ? 'expanded' : ''}`}>
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
                            {isReportOptionsVisible && (
                              <div className="specific-report-container">
                                <Selectors
                                  selectedReportType={selectedReportType}
                                  onCountryChange={setSelectedCountry}
                                  onCategoryChange={setSelectedCategory}
                                  onSpeciesChange={setSelectedSpecies}
                                  onNcmChange={setSelectedNcm}
                                  onStateChange={setSelectedState}
                                  selectorData={selectorData}
                                />
                                <div className="report-options">
                                  <span className="relatory-container">Como você gostaria do seu relatório?</span>
                                  <div className="report-options-container">
                                    {filteredReportOptions.map((option) => (
                                      <div key={option}>
                                        <label>
                                          <input
                                            type="radio"
                                            name="report_option"
                                            value={option}
                                            checked={selectedReportOption === option}
                                            onChange={() => handleReportOptionChange(option)}
                                          />
                                          {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
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
