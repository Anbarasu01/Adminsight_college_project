import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION APIs ====================
export const login = (email, password, role) => {
  return api.post('/auth/login', { email, password, role });
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const logout = () => {
  return api.post('/auth/logout');
};

// ==================== COLLECTOR APIs ====================
export const getAssignedReports = () => {
  return api.get('/collector/reports');
};

export const updateReportStatus = (reportId, statusData) => {
  return api.put(`/collector/reports/${reportId}/status`, statusData);
};

export const getCollectorStats = () => {
  return api.get('/collector/stats');
};

export const getCollectorProblems = () => {
  return api.get('/collector/problems');
};

export const assignDepartment = (problemId, departmentData) => {
  return api.put(`/collector/problems/${problemId}/assign`, departmentData);
};

// User Management (Collector)
export const getAllUsers = () => {
  return api.get('/users');
};

export const updateUserRole = (userId, roleData) => {
  return api.put(`/users/${userId}/role`, roleData);
};

export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`);
};

// Department Management (Collector)
export const getDepartments = () => {
  return api.get('/departments');
};

export const createDepartment = (departmentData) => {
  return api.post('/departments', departmentData);
};

export const assignDepartmentHead = (departmentId, headData) => {
  return api.put(`/departments/${departmentId}/head`, headData);
};

export const deleteDepartment = (departmentId) => {
  return api.delete(`/departments/${departmentId}`);
};

// Report Management (Collector)
export const getAllReports = () => {
  return api.get('/reports');
};

export const deleteReport = (reportId) => {
  return api.delete(`/reports/${reportId}`);
};

export const assignCollector = (reportId, assignmentData) => {
  return api.put(`/reports/${reportId}/assign-collector`, assignmentData);
};

// ==================== DEPARTMENT HEAD APIs ====================
export const getDepartmentReports = () => {
  return api.get('/department/reports');
};

export const assignStaff = (reportId, staffData) => {
  return api.put(`/department/reports/${reportId}/assign-staff`, staffData);
};

export const getDepartmentStaff = () => {
  return api.get('/department/staff');
};

export const getDepartmentStats = () => {
  return api.get('/department/stats');
};

export const updateReportStatusDept = (reportId, statusData) => {
  return api.put(`/department/reports/${reportId}/status`, statusData);
};

export const getRecentActivities = () => {
  return api.get('/department/activities');
};

export const assignTask = (staffId, taskData) => {
  return api.post(`/department/staff/${staffId}/tasks`, taskData);
};

// ==================== STAFF APIs ====================
export const getStaffTasks = () => {
  return api.get('/staff/tasks');
};

export const updateTaskStatus = (taskId, statusData) => {
  return api.put(`/staff/tasks/${taskId}/status`, statusData);
};

export const getStaffStats = () => {
  return api.get('/staff/stats');
};

export const getAssignedTasks = () => {
  return api.get('/staff/assigned-tasks');
};

export const getStaffReports = () => {
  return api.get('/staff/reports');
};

// ==================== PUBLIC USER APIs ====================
export const submitReport = (reportData) => {
  return api.post('/reports', reportData);
};

export const getPublicStats = () => {
  return api.get('/public/stats');
};

export const getUserReports = () => {
  return api.get('/public/reports');
};

export const deleteUserReport = (reportId) => {
  return api.delete(`/public/reports/${reportId}`);
};

export const getPublicNotifications = () => {
  return api.get('/public/notifications');
};

// ==================== NOTIFICATION APIs ====================
export const getNotifications = () => {
  return api.get('/notifications');
};

export const markNotificationAsRead = (notificationId) => {
  return api.put(`/notifications/${notificationId}/read`);
};

export const createNotification = (notificationData) => {
  return api.post('/notifications', notificationData);
};

export const deleteNotification = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

export const getUnreadNotifications = () => {
  return api.get('/notifications/unread');
};

// ==================== DASHBOARD & ANALYTICS APIs ====================
export const getDashboardStats = (role) => {
  return api.get(`/dashboard/stats?role=${role}`);
};

export const getRecentReports = () => {
  return api.get('/reports/recent');
};

export const getSystemAnalytics = () => {
  return api.get('/analytics/system');
};

// ==================== PROBLEM/REPORT APIs ====================
export const getProblemDetails = (problemId) => {
  return api.get(`/problems/${problemId}`);
};

export const updateProblemPriority = (problemId, priorityData) => {
  return api.put(`/problems/${problemId}/priority`, priorityData);
};

export const getReportCategories = () => {
  return api.get('/reports/categories');
};

export const getReportStatuses = () => {
  return api.get('/reports/statuses');
};

// ==================== PROFILE & SETTINGS APIs ====================
export const updateUserProfile = (userId, profileData) => {
  return api.put(`/users/${userId}/profile`, profileData);
};

export const changePassword = (passwordData) => {
  return api.put('/auth/change-password', passwordData);
};

export const getProfile = () => {
  return api.get('/users/profile');
};

// ==================== FILE UPLOAD APIs ====================
export const uploadFile = (fileData) => {
  const formData = new FormData();
  formData.append('file', fileData);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteFile = (fileId) => {
  return api.delete(`/upload/${fileId}`);
};

// ==================== DEPARTMENT APIs ====================
export const getDepartmentList = () => {
  return api.get('/departments/list');
};

export const getDepartmentDetails = (departmentId) => {
  return api.get(`/departments/${departmentId}`);
};

export const updateDepartment = (departmentId, departmentData) => {
  return api.put(`/departments/${departmentId}`, departmentData);
};

// ==================== ACTIVITY LOG APIs ====================
export const getActivityLogs = (filters = {}) => {
  return api.get('/activities', { params: filters });
};

export const getMyActivities = () => {
  return api.get('/activities/my');
};

// ==================== SEARCH APIs ====================
export const searchReports = (query) => {
  return api.get(`/search/reports?q=${query}`);
};

export const searchUsers = (query) => {
  return api.get(`/search/users?q=${query}`);
};

// ==================== EXPORT APIs ====================
export const exportReports = (filters = {}) => {
  return api.get('/export/reports', { 
    params: filters,
    responseType: 'blob'
  });
};

export const exportUsers = () => {
  return api.get('/export/users', { responseType: 'blob' });
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Default export for backward compatibility
export default api;