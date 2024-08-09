// components/profile/ProfileDropdown.jsx
import React from 'react';
import './ProfileDropdown.css';
import profilePic from '../../../../assets/images/profile.jpg'; // Atualize o caminho conforme necessário

const ProfileDropdown = () => {
  return (
    <div className="navbar-profile-dropdown">
      <div className="profile-header">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <span className="profile-name">Lara Costa</span>
          <span className="profile-role">Desenvolvedora</span>
        </div>
      </div>
      <div className="profile-item">
        <i className="bi bi-person profile-icon"></i>
        <span className="profile-text">Perfil</span>
      </div>
      <div className="profile-item">
        <i className="bi bi-pencil profile-icon"></i>
        <span className="profile-text">Editar Perfil</span>
      </div>
      <div className="profile-item">
        <i className="bi bi-gear profile-icon"></i>
        <span className="profile-text">Configurações</span>
      </div>
      <div className="profile-item">
        <i className="bi bi-wallet2 profile-icon"></i>
        <span className="profile-text">Pagamento</span>
      </div>
      <div className="profile-item">
        <i className="bi bi-box-arrow-right profile-icon"></i>
        <span className="profile-text">Sair</span>
      </div>
    </div>
  );
};

export default ProfileDropdown;
