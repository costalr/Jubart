import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logoExpanded from '../../assets/images/logo/LogoShrunk.png';
import logoCollapsed from '../../assets/images/logo/LogoCompacted.png';
import profilePic from '../../assets/images/profile.jpg';
import NotificationList from './components/notification/NotificationList';
import ProfileDropdown from './components/profile/ProfileDrodpown';

const Navbar = ({ toggleSidebar, isSidebarExpanded }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

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
          {isSidebarExpanded ? (
            <img src={logoExpanded} alt="Logo" className="navbar-logo expanded-logo" />
          ) : (
            <img src={logoCollapsed} alt="Logo" className="navbar-logo collapsed-logo" />
          )}
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
