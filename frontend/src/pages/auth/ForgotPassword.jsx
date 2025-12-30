// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AuthCommon.css';

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine user type from URL
  const getCurrentUserType = () => {
    const path = location.pathname;
    if (path.includes('/public/')) return 'public';
    if (path.includes('/staff/')) return 'staff';
    if (path.includes('/collector/')) return 'collector';
    if (path.includes('/department-head/')) return 'departmentHead';
    return 'public'; // default
  };

  const userType = getCurrentUserType();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const userTypeConfig = {
    public: {
      title: 'Public User Password Reset',
      description: 'Enter your email to reset your public account password',
      loginRoute: '/public/login',
      apiEndpoint: '/api/public/forgot-password',
      helpText: 'For staff/admin password reset, please contact your administrator'
    },
    staff: {
      title: 'Staff Password Reset',
      description: 'Enter your staff email to reset your password',
      loginRoute: '/auth/login',
      apiEndpoint: '/api/staff/forgot-password',
      helpText: 'Two-factor authentication may be required after reset'
    },
    collector: {
      title: 'Collector Password Reset',
      description: 'Enter your collector account email',
      loginRoute: '/auth/login',
      apiEndpoint: '/api/collector/forgot-password',
      helpText: 'Your department head will be notified of this reset'
    },
    departmentHead: {
      title: 'Department Head Password Reset',
      description: 'Enter your department head email',
      loginRoute: '/auth/login',
      apiEndpoint: '/api/department-head/forgot-password',
      helpText: 'Please contact IT support for urgent password resets'
    }
  };

  const config = userTypeConfig[userType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // API call specific to user type
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType })
      });

      if (!response.ok) throw new Error('Failed to send reset link');
      
      setMessage(`Password reset instructions have been sent to ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{config.title}</h2>
          <p>{config.description}</p>
          
          {/* Show user type badge */}
          <div className="user-type-badge">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Account
          </div>
        </div>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Enter your ${userType} email`}
              required
              disabled={isLoading}
            />
            <small className="form-help">{config.helpText}</small>
          </div>

          <button type="submit" className="auth-btn primary-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-links">
            <Link to={config.loginRoute} className="auth-link">
              ← Back to Login
            </Link>
            
            {/* Show different links based on user type */}
            {userType === 'public' && (
              <>
                <span className="divider">•</span>
                <Link to="/auth/login" className="auth-link">
                  Staff Login
                </Link>
              </>
            )}
            
            {userType !== 'public' && (
              <>
                <span className="divider">•</span>
                <Link to="/public/login" className="auth-link">
                  Public User Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;