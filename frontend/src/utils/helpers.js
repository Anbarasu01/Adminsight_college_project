import { REPORT_STATUS, REPORT_PRIORITY, USER_ROLES } from './constants';

/**
 * Format date to readable string
 */
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Get status color for badges
 */
export const getStatusColor = (status) => {
  const colors = {
    [REPORT_STATUS.PENDING]: 'orange',
    [REPORT_STATUS.IN_PROGRESS]: 'blue',
    [REPORT_STATUS.RESOLVED]: 'green',
    [REPORT_STATUS.CLOSED]: 'gray',
    [REPORT_STATUS.REJECTED]: 'red',
    [TASK_STATUS.PENDING]: 'orange',
    [TASK_STATUS.IN_PROGRESS]: 'blue',
    [TASK_STATUS.COMPLETED]: 'green',
    [TASK_STATUS.CANCELLED]: 'red'
  };
  
  return colors[status] || 'gray';
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority) => {
  const colors = {
    [REPORT_PRIORITY.LOW]: 'green',
    [REPORT_PRIORITY.MEDIUM]: 'orange',
    [REPORT_PRIORITY.HIGH]: 'red',
    [REPORT_PRIORITY.URGENT]: 'purple'
  };
  
  return colors[priority] || 'gray';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if user has required role
 */
export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  return user.role === requiredRole;
};

/**
 * Check if user has any of the required roles
 */
export const hasAnyRole = (user, requiredRoles = []) => {
  if (!user || !user.role) return false;
  return requiredRoles.includes(user.role);
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get initial from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};