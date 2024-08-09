import React from 'react';
import './ProfileItem.css';

const ProfileItem = ({ icon, text }) => {
  return (
    <div className="profile-item">
      <div className="profile-icon">{icon}</div>
      <div className="profile-text">{text}</div>
    </div>
  );
};

export default ProfileItem;
