import React from 'react';
import NotificationItem from './NotificationItem';
import './NotificationList.css';

const notifications = [
  { icon: '🎂', title: 'Lorem ipsum dolor sit amet.', time: '3:00 AM', description: 'Consectetur adipiscing elit.' },
  { icon: '💬', title: 'Vivamus luctus urna sed urna.', time: '6:00 PM', description: '5 August' },
  { icon: '⚙️', title: 'Curabitur fringilla, mauris vel.', time: '2:45 PM', description: '7 hours ago' },
  { icon: '📅', title: 'Suspendisse non urna enim.', time: '9:10 PM', description: 'Daily scrum meeting time' },
];

const NotificationList = () => {
  return (
    <div className="notification-list">
      <div className="notification-header">
        <span>Notificações</span>
        <span className="notification-clear">✔</span>
      </div>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={index}
          icon={notification.icon}
          title={notification.title}
          time={notification.time}
          description={notification.description}
        />
      ))}
      <div className="notification-view-all">Ver tudo</div>
    </div>
  );
};

export default NotificationList;
