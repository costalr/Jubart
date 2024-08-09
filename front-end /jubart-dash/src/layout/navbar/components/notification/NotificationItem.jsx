import React from 'react';
import './NotificationItem.css';

const NotificationItem = ({ icon, title, time, description }) => {
  return (
    <div className="notification-item">
      <div className="notification-icon">{icon}</div>
      <div className="notification-content">
        <div className="notification-title">
          <span>{title}</span>
          <span className="notification-time">{time}</span>
        </div>
        <div className="notification-description">{description}</div>
      </div>
    </div>
  );
};

export default NotificationItem;
