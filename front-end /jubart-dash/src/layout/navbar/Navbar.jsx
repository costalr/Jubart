import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logoCollapsedDark from '../../assets/images/logo/LogoShrunk-Dark.png';
import logoCollapsedLight from '../../assets/images/logo/LogoShrunk-Light.png';
import logoCompacted from '../../assets/images/logo/LogoCompacted.png';
import profilePic from '../../assets/images/profile.jpg';
import NotificationList from './components/notification/NotificationList';
import ProfileDropdown from './components/profile/ProfileDrodpown';

const Navbar = ({ toggleSidebar, isSidebarVisible }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(logoCollapsedLight); // Default logo
  const [theme, setTheme] = useState('light'); // Default theme is light

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const updateLogo = () => {
      if (!isSidebarVisible) {
        setCurrentLogo(logoCompacted);
      } else {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
          setCurrentLogo(logoCollapsedLight);
        } else {
          setCurrentLogo(logoCollapsedDark);
        }
      }
    };

    // Update the logo based on the theme and sidebar state
    updateLogo();

    // Observer to detect changes to the `data-theme` attribute
    const observer = new MutationObserver(() => {
      updateLogo();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Cleanup the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [isSidebarVisible]);

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      notificationRef.current && !notificationRef.current.contains(event.target) &&
      profileRef.current && !profileRef.current.contains(event.target)
    ) {
      setIsNotificationOpen(false);
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <img src={currentLogo} alt="Logo" className={`navbar-logo ${isSidebarVisible ? 'expanded-logo' : 'collapsed-logo'}`} />
        </div>
        <button className="menu-button" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <span className="nav-title">Painel do Pescado</span>
        <div className="search-container">
          <input type="text" placeholder="Pesquisar" className="search-input" />
        </div>
      </div>
      <div className="navbar-right">
        <div className="theme-toggle-container">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
        <div ref={notificationRef} className="notification-container" onClick={toggleNotificationDropdown}>
          <i className="bi bi-bell navbar-icon">
            <span className="notification-count">2</span>
          </i>
          {isNotificationOpen && <NotificationList />}
        </div>
        <i className="bi bi-gear navbar-icon"></i>
        <div ref={profileRef} className="profile-container" onClick={toggleProfileDropdown}>
          <img src={profilePic} alt="Profile" className="navbar-profile-pic" />
          <span className="navbar-profile-name">Lara Costa</span>
          {isProfileDropdownOpen && <ProfileDropdown />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
