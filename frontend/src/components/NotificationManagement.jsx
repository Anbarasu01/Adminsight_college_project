import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import NotificationCard from './NotificationCard';
import '../css/NotificationManagement.css';

const NotificationManagement = () => {
  const { notifications, markAllAsRead, clearAll } = useNotification();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-management">
      <div className="notification-header">
        <h1>Notifications</h1>
        <div className="notification-actions">
          <button 
            className="btn btn-primary" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="notification-filters">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="report">Reports</option>
          <option value="task">Tasks</option>
          <option value="system">System</option>
        </select>
        <span className="notification-count">
          {filteredNotifications.length} notifications
          {unreadCount > 0 && ` (${unreadCount} unread)`}
        </span>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard 
              key={notification.id} 
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;