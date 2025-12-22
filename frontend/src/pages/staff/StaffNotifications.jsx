// src/pages/staff/StaffNotifications.jsx
import React, { useState } from 'react';
import './StaffNotifications.css';

const StaffNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'task', title: 'New Task Assigned', message: 'You have been assigned "Client Documentation Update"', time: '10 minutes ago', read: false, priority: 'high' },
    { id: 2, type: 'system', title: 'System Update', message: 'System maintenance scheduled for tonight at 2 AM', time: '1 hour ago', read: false, priority: 'medium' },
    { id: 3, type: 'team', title: 'Team Message', message: 'Mike Johnson commented on your report', time: '3 hours ago', read: true, priority: 'low' },
    { id: 4, type: 'deadline', title: 'Deadline Approaching', message: 'Quarterly report submission due in 2 days', time: '5 hours ago', read: false, priority: 'high' },
    { id: 5, type: 'achievement', title: 'Achievement Unlocked', message: 'You completed 10 tasks this week!', time: '1 day ago', read: true, priority: 'low' },
    { id: 6, type: 'task', title: 'Task Completed', message: '"Bug Fix" task marked as completed', time: '2 days ago', read: true, priority: 'medium' },
    { id: 7, type: 'system', title: 'New Feature', message: 'New reporting feature now available', time: '3 days ago', read: true, priority: 'low' },
    { id: 8, type: 'team', title: 'Team Update', message: 'Team meeting rescheduled to 3 PM', time: '4 days ago', read: true, priority: 'medium' },
  ]);

  const [filter, setFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type) => {
    const icons = {
      task: '✅',
      system: '⚙️',
      team: '👥',
      deadline: '⏰',
      achievement: '🏆'
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#64748b';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="staff-notifications-container">
      <div className="notifications-header">
        <div>
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-subtitle">Stay updated with your tasks and team activities</p>
        </div>
        <div className="notifications-actions">
          <button className="btn-primary" onClick={markAllAsRead}>
            Mark All as Read
          </button>
          <button className="btn-secondary" onClick={clearAll}>
            Clear All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-icon unread">🔔</div>
          <div className="stat-content">
            <h3>{unreadCount}</h3>
            <p>Unread Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-content">
            <h3>{notifications.length}</h3>
            <p>Total Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon priority">⚠️</div>
          <div className="stat-content">
            <h3>{notifications.filter(n => n.priority === 'high').length}</h3>
            <p>High Priority</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Notifications
        </button>
        <button 
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-tab ${filter === 'high' ? 'active' : ''}`}
          onClick={() => setFilter('high')}
        >
          High Priority
        </button>
        <button 
          className={`filter-tab ${filter === 'task' ? 'active' : ''}`}
          onClick={() => setFilter('task')}
        >
          Tasks
        </button>
        <button 
          className={`filter-tab ${filter === 'team' ? 'active' : ''}`}
          onClick={() => setFilter('team')}
        >
          Team
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                <span className="type-icon">{getTypeIcon(notification.type)}</span>
                {!notification.read && <span className="unread-dot"></span>}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(notification.priority) + '20', color: getPriorityColor(notification.priority) }}
                  >
                    {notification.priority} priority
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="action-btn read-btn"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notifications found</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        )}
      </div>

      {/* Settings & Preferences */}
      <div className="notifications-settings">
        <h3 className="settings-title">Notification Preferences</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <input type="checkbox" id="email-alerts" defaultChecked />
            <label htmlFor="email-alerts">Email notifications</label>
          </div>
          <div className="setting-item">
            <input type="checkbox" id="task-updates" defaultChecked />
            <label htmlFor="task-updates">Task updates</label>
          </div>
          <div className="setting-item">
            <input type="checkbox" id="team-messages" defaultChecked />
            <label htmlFor="team-messages">Team messages</label>
          </div>
          <div className="setting-item">
            <input type="checkbox" id="system-alerts" defaultChecked />
            <label htmlFor="system-alerts">System alerts</label>
          </div>
          <div className="setting-item">
            <input type="checkbox" id="deadline-reminders" defaultChecked />
            <label htmlFor="deadline-reminders">Deadline reminders</label>
          </div>
          <div className="setting-item">
            <input type="checkbox" id="achievement-alerts" defaultChecked />
            <label htmlFor="achievement-alerts">Achievement alerts</label>
          </div>
        </div>
        <button className="save-settings-btn">Save Preferences</button>
      </div>
    </div>
  );
};

export default StaffNotifications;