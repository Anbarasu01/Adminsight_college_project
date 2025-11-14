import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // For demo purposes - in real app, this would be an API call
    console.log('Login attempt:', email, password);
    
    // Simulate different roles based on email
    let role = 'public';
    if (email.includes('collector')) role = 'collector';
    else if (email.includes('department')) role = 'departmentHead';
    else if (email.includes('staff')) role = 'staff';
    
    const userData = { 
      email, 
      name: email.split('@')[0],
      role: role
    };
    
    console.log('User logged in:', userData);
    setUser(userData);
    return userData; // Return user data for redirection
  };

  const register = (formData) => {
    // For demo purposes - in real app, this would be an API call
    console.log('Register attempt:', formData);
    const userData = { 
      email: formData.email, 
      name: formData.name,
      role: formData.role,
      phoneNumber: formData.phoneNumber,
      departmentId: formData.departmentId
    };
    
    setUser(userData);
    return userData; // Return user data for redirection
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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