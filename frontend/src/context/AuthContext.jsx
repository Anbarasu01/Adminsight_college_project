import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Loaded user from storage:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', email, password);
      
      // For demo purposes - simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different roles based on email
      let role = 'public';
      if (email.includes('collector')) role = 'collector';
      else if (email.includes('department')) role = 'departmentHead';
      else if (email.includes('staff')) role = 'staff';
      
      const userData = { 
        id: Date.now().toString(),
        email, 
        name: email.split('@')[0],
        role: role,
        phoneNumber: '1234567890',
        departmentId: role !== 'public' ? 'dept-001' : null
      };
      
      console.log('User logged in:', userData);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (formData) => {
    try {
      console.log('Register attempt:', formData);
      
      // For demo purposes - simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = { 
        id: Date.now().toString(),
        email: formData.email, 
        name: formData.name,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        departmentId: formData.departmentId
      };
      
      console.log('User registered:', userData);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};