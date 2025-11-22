// User Roles
export const USER_ROLES = {
  PUBLIC: 'public',
  STAFF: 'staff',
  COLLECTOR: 'collector',
  DEPARTMENT_HEAD: 'departmentHead',
  ADMIN: 'admin'
};

// Report Status
export const REPORT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected'
};

// Report Priority
export const REPORT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Report Categories
export const REPORT_CATEGORIES = {
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning',
  SECURITY: 'security',
  IT: 'it',
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  OTHER: 'other'
};

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  REPORT_SUBMITTED: 'report_submitted',
  REPORT_UPDATED: 'report_updated',
  TASK_ASSIGNED: 'task_assigned',
  SYSTEM_ALERT: 'system_alert',
  GENERAL: 'general'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  REPORTS: {
    BASE: '/api/reports',
    BY_STATUS: '/api/reports/status',
    BY_CATEGORY: '/api/reports/category'
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile'
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    MARK_READ: '/api/notifications/mark-read'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ssZ'
};