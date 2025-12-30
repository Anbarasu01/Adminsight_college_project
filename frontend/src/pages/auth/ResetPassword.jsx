// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import './AuthCommon.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  // Determine user type from URL
  const getUserTypeFromPath = () => {
    const path = location.pathname;
    if (path.includes('/public/')) return 'public';
    if (path.includes('/collector/')) return 'collector';
    if (path.includes('/department-head/')) return 'departmentHead';
    if (path.includes('/auth/')) return 'staff';
    return 'staff'; // default
  };

  const userType = getUserTypeFromPath();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const userTypeConfig = {
    public: {
      title: 'Reset Public Account Password',
      description: 'Create a new password for your public account',
      loginRoute: '/public/login',
      apiEndpoint: '/api/public/reset-password',
      successMessage: 'Password reset successful! Redirecting to login...'
    },
    staff: {
      title: 'Reset Staff Password',
      description: 'Create a new password for your staff account',
      loginRoute: '/auth/login',
      apiEndpoint: '/api/staff/reset-password',
      successMessage: 'Password reset successful! Redirecting to staff login...'
    },
    collector: {
      title: 'Reset Collector Password',
      description: 'Create a new password for your collector account',
      loginRoute: '/collector/login',
      apiEndpoint: '/api/collector/reset-password',
      successMessage: 'Password reset successful! Redirecting to collector login...'
    },
    departmentHead: {
      title: 'Reset Department Head Password',
      description: 'Create a new password for your department head account',
      loginRoute: '/department-head/login',
      apiEndpoint: '/api/department-head/reset-password',
      successMessage: 'Password reset successful! Redirecting to login...'
    }
  };

  const config = userTypeConfig[userType];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    if (!token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // API call to reset password
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setMessage(config.successMessage);
      
      // Clear form
      setFormData({
        password: '',
        confirmPassword: '',
        showPassword: false
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(config.loginRoute);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{config.title}</h2>
          <p>{config.description}</p>
          
          <div className="user-type-badge">
            {userType === 'public' ? 'Public User' : 
             userType === 'collector' ? 'Collector' :
             userType === 'departmentHead' ? 'Department Head' : 'Staff'} Account
          </div>
          
          {email && (
            <div className="email-display">
              <small>Resetting password for: <strong>{email}</strong></small>
            </div>
          )}
        </div>

        {!token && (
          <div className="auth-warning">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Invalid or expired reset link. Please request a new one.
          </div>
        )}

        {message && (
          <div className="auth-success">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className="auth-error">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={formData.showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (min. 8 characters)"
                required
                disabled={isLoading || !token}
                className="password-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                disabled={isLoading || !token}
              >
                {formData.showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <small className="form-help">
              Must be at least 8 characters with one uppercase letter and one number
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password *</label>
            <input
              type={formData.showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              disabled={isLoading || !token}
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="showPassword"
              name="showPassword"
              checked={formData.showPassword}
              onChange={handleChange}
              disabled={isLoading || !token}
            />
            <label htmlFor="showPassword">Show passwords</label>
          </div>

          <button 
            type="submit" 
            className="auth-btn primary-btn"
            disabled={isLoading || !token}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting Password...
              </>
            ) : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-links">
            <Link to={config.loginRoute} className="auth-link">
              ← Back to Login
            </Link>
            
            <span className="divider">•</span>
            
            <Link to={
              userType === 'public' ? '/public/forgot-password' :
              userType === 'collector' ? '/collector/forgot-password' :
              userType === 'departmentHead' ? '/department-head/forgot-password' :
              '/auth/forgot-password'
            } className="auth-link">
              Request New Link
            </Link>
          </div>
          
          <div className="password-strength-info">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                <svg className={`w-4 h-4 mr-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {formData.password.length >= 8 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                At least 8 characters
              </li>
              <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                <svg className={`w-4 h-4 mr-1 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {/(?=.*[A-Z])/.test(formData.password) ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                One uppercase letter
              </li>
              <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                <svg className={`w-4 h-4 mr-1 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {/(?=.*\d)/.test(formData.password) ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                One number
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;