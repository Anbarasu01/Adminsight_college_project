import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectorLayout from '../../layouts/CollectorLayout';
// Import CollectorUsers utilities
import { getCollectorAssignedCustomers, getCollectorTasks } from '../../utils/collectorData';

const CollectorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    taskReminders: true,
    customerUpdates: true,
    departmentResponses: true,
    systemAlerts: true,
    paymentAlerts: true,
    overdueAlerts: true,
    emailNotifications: false,
    pushNotifications: true
  });
  const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'read'
  const navigate = useNavigate();

  // Mock collector ID (from auth context)
  const collectorId = 'collector_001';

  useEffect(() => {
    fetchPersonalNotifications();
    fetchCollectorCustomers(); // Get assigned customers for context
  }, []);

  const fetchPersonalNotifications = async () => {
    try {
      setLoading(true);
      
      // Mock data - ONLY collector's personal notifications
      const personalNotifications = [
        {
          id: 1,
          title: 'Task Reminder: Daily Collection',
          message: 'Your daily collection round in Area A is scheduled for 10:00 AM',
          type: 'task',
          priority: 'medium',
          isRead: false,
          createdAt: '2024-01-15T09:00:00Z',
          relatedTo: { type: 'task', id: 'TASK001' },
          action: { type: 'navigate', path: '/collector/tasks' }
        },
        {
          id: 2,
          title: 'Customer Update: Payment Received',
          message: 'Customer John Doe (Account #ACC123) has made a payment of $500',
          type: 'customer',
          priority: 'info',
          isRead: false,
          createdAt: '2024-01-15T08:30:00Z',
          relatedTo: { type: 'customer', id: 'C001' },
          action: { type: 'navigate', path: '/collector/users' }
        },
        {
          id: 3,
          title: 'Department Response: Legal Request',
          message: 'Your legal escalation request has been reviewed. Status: In Progress',
          type: 'department',
          priority: 'info',
          isRead: true,
          createdAt: '2024-01-14T16:45:00Z',
          relatedTo: { type: 'request', id: 'REQ001' },
          action: { type: 'navigate', path: '/collector/department' }
        },
        {
          id: 4,
          title: 'Overdue Alert',
          message: 'Customer Jane Smith (Account #ACC124) has overdue payment of 15 days',
          type: 'alert',
          priority: 'high',
          isRead: false,
          createdAt: '2024-01-14T14:20:00Z',
          relatedTo: { type: 'customer', id: 'C002' },
          action: { type: 'navigate', path: '/collector/users' }
        },
        {
          id: 5,
          title: 'New Task Assigned',
          message: 'New collection task assigned: Industrial Zone collection',
          type: 'task',
          priority: 'medium',
          isRead: true,
          createdAt: '2024-01-13T11:10:00Z',
          relatedTo: { type: 'task', id: 'TASK002' },
          action: { type: 'navigate', path: '/collector/tasks' }
        },
        {
          id: 6,
          title: 'Support Request Update',
          message: 'Your device issue ticket has been resolved. Device replaced.',
          type: 'department',
          priority: 'success',
          isRead: true,
          createdAt: '2024-01-12T13:25:00Z',
          relatedTo: { type: 'request', id: 'SUP001' },
          action: { type: 'navigate', path: '/collector/department' }
        },
        {
          id: 7,
          title: 'System Maintenance Alert',
          message: 'Mobile collection app will be unavailable tomorrow 2-4 AM for maintenance',
          type: 'system',
          priority: 'warning',
          isRead: false,
          createdAt: '2024-01-12T10:00:00Z',
          relatedTo: { type: 'system', id: 'SYS001' },
          action: null
        },
        {
          id: 8,
          title: 'Collection Target Achievement',
          message: 'Congratulations! You have achieved 95% of your weekly collection target',
          type: 'achievement',
          priority: 'success',
          isRead: true,
          createdAt: '2024-01-11T17:30:00Z',
          relatedTo: { type: 'performance', id: 'PERF001' },
          action: { type: 'navigate', path: '/collector/dashboard' }
        }
      ];

      // Filter notifications based on user preferences
      const filteredNotifications = personalNotifications.filter(notification => {
        switch(notification.type) {
          case 'task': return notificationPreferences.taskReminders;
          case 'customer': return notificationPreferences.customerUpdates;
          case 'department': return notificationPreferences.departmentResponses;
          case 'system': return notificationPreferences.systemAlerts;
          case 'alert': return notificationPreferences.overdueAlerts;
          default: return true;
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectorCustomers = async () => {
    try {
      // This would fetch collector's assigned customers for context
      // const customers = await getCollectorAssignedCustomers(collectorId);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
      
      // In real app, would make API call
      // await api.put(`/collector/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })));
      
      // In real app, would make API call
      // await api.put('/collector/notifications/mark-all-read');
      alert('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        alert('Notification deleted');
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Failed to delete notification');
      }
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate if action exists
    if (notification.action?.type === 'navigate') {
      navigate(notification.action.path);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = async () => {
    try {
      // In real app, would make API call
      // await api.put('/collector/notification-preferences', notificationPreferences);
      alert('Notification preferences saved successfully!');
      fetchPersonalNotifications(); // Refresh with new preferences
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      case 'info': return '🔵';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'task': return '✅';
      case 'customer': return '👥';
      case 'department': return '🏢';
      case 'system': return '⚙️';
      case 'alert': return '🚨';
      case 'achievement': return '🏆';
      default: return '📢';
    }
  };

  const getFilteredNotifications = () => {
    switch(filterType) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'read':
        return notifications.filter(n => n.isRead);
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <CollectorLayout 
      title="My Notifications" 
      description="View and manage your personal notifications"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats and Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{notifications.length - unreadCount}</div>
                <div className="text-sm text-gray-600">Read</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  unreadCount === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <span>📋</span>
                <span>Mark All Read</span>
              </button>
              
              <button 
                onClick={fetchPersonalNotifications}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 px-6 pt-4">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  filterType === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  filterType === 'unread' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilterType('read')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  filterType === 'read' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading your notifications...</p>
              </div>
            ) : getFilteredNotifications().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {filterType === 'all' ? 'No Notifications' : 
                   filterType === 'unread' ? 'No Unread Notifications' : 
                   'No Read Notifications'}
                </h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {filterType === 'all' ? 
                    'You will see task reminders, customer updates, and system alerts here.' :
                    'All caught up! Check back later for new notifications.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredNotifications().map(notification => (
                  <div 
                    key={notification.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow border border-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">{getTypeIcon(notification.type)}</span>
                            <span className="text-lg font-semibold text-gray-900">
                              {notification.title}
                            </span>
                            <span className="text-sm">{getPriorityIcon(notification.priority)}</span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>🕒</span>
                              <span>{new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <span>📌</span>
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete notification"
                          >
                            <span>🗑️</span>
                          </button>
                        </div>
                      </div>
                      
                      {notification.action && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.action.type === 'navigate') {
                                navigate(notification.action.path);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-2"
                          >
                            <span>🔗</span>
                            <span>View Details</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notification Preferences - NEW SECTION */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
            <p className="text-gray-600 text-sm mt-1">Customize what notifications you receive</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Notifications */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Task Notifications</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Task Reminders</p>
                    <p className="text-sm text-gray-500">Daily task schedules and reminders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationPreferences.taskReminders}
                      onChange={(e) => handlePreferenceChange('taskReminders', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Overdue Alerts</p>
                    <p className="text-sm text-gray-500">Alerts for overdue payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationPreferences.overdueAlerts}
                      onChange={(e) => handlePreferenceChange('overdueAlerts', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              {/* Customer & System Notifications */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Updates & Alerts</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Customer Updates</p>
                    <p className="text-sm text-gray-500">Payment receipts and customer changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationPreferences.customerUpdates}
                      onChange={(e) => handlePreferenceChange('customerUpdates', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">System Alerts</p>
                    <p className="text-sm text-gray-500">Maintenance and system updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationPreferences.systemAlerts}
                      onChange={(e) => handlePreferenceChange('systemAlerts', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Delivery Preferences */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Delivery Method</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-sm text-gray-500">In-app notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationPreferences.pushNotifications}
                      onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive emails for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationPreferences.emailNotifications}
                      onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={savePreferences}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Access Restrictions Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-yellow-800">Access Restrictions</h4>
              <p className="text-yellow-700 mt-1">
                As a Collector, you can only view and manage your personal notifications.
              </p>
              <div className="mt-3 text-sm text-yellow-600 space-y-1">
                <p>• <span className="font-medium">CANNOT</span> view system-wide notification broadcasts</p>
                <p>• <span className="font-medium">CANNOT</span> view admin announcements for other users</p>
                <p>• <span className="font-medium">CANNOT</span> access other users' notifications</p>
                <p>• <span className="font-medium">CANNOT</span> manage notification templates</p>
                <p>• <span className="font-medium">CAN</span> only manage your personal notification preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollectorLayout>
  );
};

export default CollectorNotifications;

