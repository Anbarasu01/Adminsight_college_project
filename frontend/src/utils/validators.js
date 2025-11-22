import { REPORT_CATEGORIES, REPORT_PRIORITY } from './constants';

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return 'Email is required';
  }
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return '';
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  
  return '';
};

/**
 * Validate report form
 */
export const validateReport = (reportData) => {
  const errors = {};

  // Title validation
  const titleError = validateRequired(reportData.title, 'Title');
  if (titleError) errors.title = titleError;

  // Description validation
  const descriptionError = validateRequired(reportData.description, 'Description');
  if (descriptionError) errors.description = descriptionError;

  // Category validation
  if (!reportData.category || !Object.values(REPORT_CATEGORIES).includes(reportData.category)) {
    errors.category = 'Please select a valid category';
  }

  // Priority validation
  if (!reportData.priority || !Object.values(REPORT_PRIORITY).includes(reportData.priority)) {
    errors.priority = 'Please select a valid priority';
  }

  // Location validation
  const locationError = validateRequired(reportData.location, 'Location');
  if (locationError) errors.location = locationError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate login form
 */
export const validateLogin = (loginData) => {
  const errors = {};

  const emailError = validateEmail(loginData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(loginData.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate registration form
 */
export const validateRegistration = (registerData) => {
  const errors = {};

  // Name validation
  const nameError = validateRequired(registerData.name, 'Full name');
  if (nameError) errors.name = nameError;

  // Email validation
  const emailError = validateEmail(registerData.email);
  if (emailError) errors.email = emailError;

  // Password validation
  const passwordError = validatePassword(registerData.password);
  if (passwordError) errors.password = passwordError;

  // Confirm password
  if (registerData.password !== registerData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Phone validation (optional)
  if (registerData.phone) {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(registerData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return ''; // Phone is optional
  
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  const cleanedPhone = phone.replace(/\s/g, '');
  
  if (!phoneRegex.test(cleanedPhone)) {
    return 'Please enter a valid phone number';
  }
  
  return '';
};