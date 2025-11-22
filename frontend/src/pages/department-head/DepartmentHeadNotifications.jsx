import React, { useState, useEffect } from 'react';

const DepartmentHeadNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with loading state
    const fetchNotifications = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockNotifications = [
        {
          id: 1,
          title: 'New Report Submitted',
          message: 'A new maintenance report has been submitted for Building B. Please review and assign appropriate staff.',
          type: 'report',
          priority: 'high',
          timestamp: '2024-01-10T14:30:00Z',
          read: false,
          department: 'Maintenance'
        },
        {
          id: 2,
          title: 'Staff Assignment Required',
          message: 'You have been assigned to review and approve department reports for this week.',
          type: 'assignment',
          priority: 'medium',
          timestamp: '2024-01-10T10:15:00Z',
          read: true,
          department: 'Administration'
        },
        {
          id: 3,
          title: 'Budget Approval Needed',
          message: 'Q1 department budget requires your approval before the deadline.',
          type: 'alert',
          priority: 'high',
          timestamp: '2024-01-09T16:45:00Z',
          read: false,
          department: 'Finance'
        },
        {
          id: 4,
          title: 'Team Meeting Scheduled',
          message: 'Monthly department head meeting scheduled for Friday at 2:00 PM.',
          type: 'info',
          priority: 'low',
          timestamp: '2024-01-09T09:20:00Z',
          read: true,
          department: 'All Departments'
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || notif.type === filter
  );

  const getPriorityStyles = (priority) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold border";
    switch (priority) {
      case 'high': return `${baseStyles} bg-red-100 text-red-800 border-red-200`;
      case 'medium': return `${baseStyles} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case 'low': return `${baseStyles} bg-green-100 text-green-800 border-green-200`;
      default: return `${baseStyles} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  const getTypeStyles = (type) => {
    const baseStyles = "px-2 py-1 rounded-lg text-xs font-medium";
    switch (type) {
      case 'report': return `${baseStyles} bg-blue-100 text-blue-800`;
      case 'assignment': return `${baseStyles} bg-purple-100 text-purple-800`;
      case 'alert': return `${baseStyles} bg-orange-100 text-orange-800`;
      case 'info': return `${baseStyles} bg-gray-100 text-gray-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'report':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'assignment':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeDisplayName = (type) => {
    switch (type) {
      case 'report': return 'Report';
      case 'assignment': return 'Assignment';
      case 'alert': return 'Alert';
      case 'info': return 'Information';
      default: return type;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600 text-lg">
                Stay updated with department activities and assignments
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark All Read</span>
                </button>
              )}
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="all">All Notifications</option>
                <option value="report">Reports</option>
                <option value="assignment">Assignments</option>
                <option value="alert">Alerts</option>
                <option value="info">Information</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{notifications.length}</div>
            <div className="text-xs text-gray-600 font-medium">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {notifications.filter(n => n.priority === 'high').length}
            </div>
            <div className="text-xs text-gray-600 font-medium">High Priority</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{unreadCount}</div>
            <div className="text-xs text-gray-600 font-medium">Unread</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {notifications.filter(n => n.read).length}
            </div>
            <div className="text-xs text-gray-600 font-medium">Read</div>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'all' 
                ? "You're all caught up! No new notifications." 
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={getPriorityStyles(notification.priority)}>
                            {notification.priority}
                          </span>
                          <span className={getTypeStyles(notification.type)}>
                            {getTypeDisplayName(notification.type)}
                          </span>
                        </div>
                      </div>

                      {/* Notification Metadata */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          {notification.department && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="font-medium text-gray-700">{notification.department}</span>
                            </>
                          )}
                        </div>

                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Mark Read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentHeadNotifications;