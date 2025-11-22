import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import './StaffNotifications.css';

const StaffNotifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const [filter, setFilter] = useState('all');

  // Filter notifications for staff role and by type
  const staffNotifications = notifications.filter(notif => 
    notif.role === 'staff' || !notif.role // Include role-specific and general notifications
  );

  const filteredNotifications = staffNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = staffNotifications.filter(notif => !notif.read).length;

  const handleMarkAllRead = () => {
    const unreadIds = staffNotifications
      .filter(notif => !notif.read)
      .map(notif => notif.id);
    
    unreadIds.forEach(id => markAsRead(id));
  };

  return (
    <div className="staff-notifications">
      <div className="notifications-header">
        <div className="header-left">
          <h2>My Notifications</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        
        <div className="header-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="task">Tasks</option>
            <option value="report">Reports</option>
          </select>
          
          {unreadCount > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications found</p>
            <small>You're all caught up!</small>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type || 'info'}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  <h4>{notification.title}</h4>
                  <span className={`type-badge ${notification.type || 'info'}`}>
                    {notification.type || 'info'}
                  </span>
                </div>
                <p>{notification.message}</p>
                <div className="notification-meta">
                  <span className="timestamp">
                    {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : 'Recently'}
                  </span>
                  {notification.priority === 'high' && (
                    <span className="priority-high">High Priority</span>
                  )}
                </div>
              </div>
              
              {!notification.read && (
                <button 
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffNotifications;