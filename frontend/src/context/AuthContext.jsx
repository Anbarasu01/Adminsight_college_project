import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext({});

// VITE uses import.meta.env, not process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Debug: Check if API_URL is correct
  console.log('🔧 Frontend API URL:', API_URL);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Try to get user based on token
          // We'll try multiple endpoints based on possible user types
          const endpoints = [
            `${API_URL}/auth/me`,           // For staff/admin users
            `${API_URL}/public/profile`,    // For public users
          ];

          let userData = null;
          
          for (const endpoint of endpoints) {
            try {
              const res = await axios.get(endpoint);
              if (res.data.success && res.data.user) {
                userData = res.data.user;
                console.log(`✅ User loaded from ${endpoint}:`, userData);
                break;
              }
            } catch (err) {
              console.log(`⚠️ Failed to load from ${endpoint}:`, err.message);
              continue;
            }
          }

          if (userData) {
            setUser(userData);
          } else {
            console.log('❌ No user found, logging out');
            logout();
          }
        } catch (err) {
          console.error('Failed to load user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Generic login function for all user types
  const login = async (email, password, userType = 'staff') => {
    try {
      let endpoint;
      
      // Determine which endpoint to use based on user type
      switch(userType) {
        case 'public':
          endpoint = `${API_URL}/public/login`;
          break;
        case 'collector':
          endpoint = `${API_URL}/auth/collector/login`;
          break;
        case 'departmentHead':
          endpoint = `${API_URL}/auth/department-head/login`;
          break;
        default:
          endpoint = `${API_URL}/auth/login`;
      }
      
      console.log('📤 Sending login request to:', endpoint);
      
      const res = await axios.post(endpoint, {
        email,
        password
      });

      console.log('✅ Login response:', res.data);

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Provide user-friendly error messages
      let errorMessage = error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials.';
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        if (errorMessage.includes('verify your email')) {
          errorMessage = 'Please verify your email before logging in. Check your inbox for the verification link.';
        } else {
          errorMessage = 'Invalid email or password. Please try again.';
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  // Public registration function
  const registerPublic = async (userData) => {
    try {
      console.log('📤 Sending public registration request to:', `${API_URL}/public/register`);
      
      const res = await axios.post(`${API_URL}/public/register`, userData);

      console.log('✅ Public registration response:', res.data);

      if (res.data.success) {
        // Store token and user
        setToken(res.data.token);
        setUser(res.data.user);
        
        // If user is verified, we can log them in automatically
        if (res.data.user.isVerified) {
          console.log('✅ Public user registered and verified - auto login');
        } else {
          console.log('⚠️ Public user registered but needs verification');
        }
        
        return res.data.user;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Public registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Better error messages for public registration
      let errorMessage = error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.';
      
      // Handle specific errors
      if (error.response?.data?.message?.includes('already exists')) {
        errorMessage = 'This email is already registered. Please try logging in or use a different email.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Staff/admin registration function
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update profile function (works for both user types)
  const updateProfile = async (profileData) => {
    try {
      let endpoint;
      
      // Determine endpoint based on user role
      if (user?.role === 'public') {
        endpoint = `${API_URL}/public/profile`;
      } else {
        endpoint = `${API_URL}/auth/profile`;
      }
      
      const res = await axios.put(endpoint, profileData);
      
      if (res.data.success) {
        setUser(res.data.user || res.data.data);
        return res.data.user || res.data.data;
      } else {
        throw new Error(res.data.message || 'Profile update failed');
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Profile update failed'
      );
    }
  };

  // Update password function (works for both user types)
  const updatePassword = async (passwordData) => {
    try {
      let endpoint;
      
      // Determine endpoint based on user role
      if (user?.role === 'public') {
        endpoint = `${API_URL}/public/password`;
      } else {
        endpoint = `${API_URL}/auth/password`;
      }
      
      const res = await axios.put(endpoint, passwordData);
      
      if (res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data.message || 'Password update failed');
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Password update failed'
      );
    }
  };

  // Forgot password function
  const forgotPassword = async (email, userType = 'staff') => {
    try {
      let endpoint;
      
      if (userType === 'public') {
        endpoint = `${API_URL}/public/forgot-password`;
      } else {
        endpoint = `${API_URL}/auth/forgot-password`;
      }
      
      const res = await axios.post(endpoint, { email });
      
      if (res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data.message || 'Password reset request failed');
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Password reset request failed'
      );
    }
  };

  // Reset password function
  const resetPassword = async (token, password, userType = 'staff') => {
    try {
      let endpoint;
      
      if (userType === 'public') {
        endpoint = `${API_URL}/public/reset-password/${token}`;
      } else {
        endpoint = `${API_URL}/auth/reset-password/${token}`;
      }
      
      const res = await axios.post(endpoint, { password });
      
      if (res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data.message || 'Password reset failed');
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Password reset failed'
      );
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the given roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    token,
    loading,
    // Authentication functions
    login,
    register,           // For staff/admin
    registerPublic,     // For public users
    logout,
    // Profile functions
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    // Role checking functions
    hasRole,
    hasAnyRole,
    // Convenience functions
    isAuthenticated: !!user,
    isPublicUser: user?.role === 'public',
    isStaffUser: user?.role === 'staff',
    isCollector: user?.role === 'collector',
    isDepartmentHead: user?.role === 'departmentHead'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export default as well for backward compatibility
export default AuthContext;