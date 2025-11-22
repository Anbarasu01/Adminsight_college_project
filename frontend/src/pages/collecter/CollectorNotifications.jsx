import React, { useState, useEffect } from 'react';
import { getNotifications, createNotification, deleteNotification } from '../../utils/api';

const CollectorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetUsers: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNotification(formData);
      setFormData({ title: '', message: '', type: 'info', targetUsers: 'all' });
      setShowForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(notificationId);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Failed to delete notification');
      }
    }
  };

  const getTypeStyles = (type) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (type) {
      case 'info': return `${baseStyles} bg-blue-100 text-blue-800`;
      case 'warning': return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case 'urgent': return `${baseStyles} bg-red-100 text-red-800`;
      case 'success': return `${baseStyles} bg-green-100 text-green-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getCardBorderColor = (type) => {
    switch (type) {
      case 'info': return 'border-l-blue-500';
      case 'warning': return 'border-l-yellow-500';
      case 'urgent': return 'border-l-red-500';
      case 'success': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTargetStyles = (target) => {
    const baseStyles = "px-2 py-1 rounded-lg text-xs font-medium";
    switch (target) {
      case 'all': return `${baseStyles} bg-purple-100 text-purple-800`;
      case 'staff': return `${baseStyles} bg-indigo-100 text-indigo-800`;
      case 'collectors': return `${baseStyles} bg-cyan-100 text-cyan-800`;
      case 'department_heads': return `${baseStyles} bg-orange-100 text-orange-800`;
      case 'public': return `${baseStyles} bg-teal-100 text-teal-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getTargetLabel = (target) => {
    switch (target) {
      case 'all': return 'All Users';
      case 'staff': return 'Staff Only';
      case 'collectors': return 'Collectors Only';
      case 'public': return 'Public Only';
      case 'department_heads': return 'Department Heads Only';
      default: return target;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetUsers: 'all'
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notification Management
              </h1>
              <p className="text-gray-600 text-lg">
                Create and manage system-wide notifications for different user groups
              </p>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              disabled={loading}
              className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Notification</span>
            </button>
          </div>
        </div>

        {/* Create Notification Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Notification</h3>
                  <p className="text-gray-600 text-sm mt-1">Send a notification to selected user groups</p>
                </div>
                <button 
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateNotification} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter a clear and concise title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Provide detailed information for the notification"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="info">📋 Information</option>
                      <option value="warning">⚠️ Warning</option>
                      <option value="urgent">🚨 Urgent</option>
                      <option value="success">✅ Success</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      name="targetUsers"
                      value={formData.targetUsers}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="all">👥 All Users</option>
                      <option value="staff">💼 Staff Only</option>
                      <option value="collectors">🗑️ Collectors Only</option>
                      <option value="department_heads">👨‍💼 Department Heads Only</option>
                      <option value="public">🌍 Public Users Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span>{loading ? 'Creating...' : 'Create Notification'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Notifications Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                  System Notifications ({notifications.length})
                </h3>
                <button 
                  onClick={fetchNotifications}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  title="Refresh notifications"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Notifications Content */}
            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create your first notification to communicate with users across the system.
                  </p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create First Notification</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id || notification._id} 
                      className={`bg-white border-l-4 ${getCardBorderColor(notification.type)} rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden`}
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-2">
                              {notification.title}
                            </h3>
                            <div className={getTypeStyles(notification.type)}>
                              {notification.type.toUpperCase()}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteNotification(notification.id || notification._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-lg hover:bg-red-50 ml-2"
                            title="Delete notification"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Message */}
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        {/* Meta Information */}
                        <div className="space-y-2 border-t border-gray-100 pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">Target:</span>
                            <span className={getTargetStyles(notification.targetUsers)}>
                              {getTargetLabel(notification.targetUsers)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">Created:</span>
                            <span className="text-sm text-gray-600">
                              {new Date(notification.createdAt || notification.date).toLocaleDateString()}
                            </span>
                          </div>

                          {notification.createdBy && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 font-medium">By:</span>
                              <span className="text-sm text-gray-600 font-medium">
                                {notification.createdBy}
                              </span>
                            </div>
                          )}

                          {notification.isActive !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 font-medium">Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                notification.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {notification.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorNotifications;