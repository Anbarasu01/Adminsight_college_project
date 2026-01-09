import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import axios from "axios";

/* ================================
   CONTEXT SETUP
================================ */

// IMPORTANT: default must be null
const AuthContext = createContext(null);

// Vite env
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ================================
   CUSTOM HOOK
================================ */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/* ================================
   PROVIDER
================================ */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  /* ================================
     AXIOS TOKEN HANDLING
  ================================ */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }, [token]);

  /* ================================
     LOAD USER ON REFRESH
  ================================ */
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Use the auth/me endpoint - this should work for all roles
        const res = await axios.get(`${API_URL}/auth/me`);
        
        if (res.data?.success && res.data?.data?.user) {
          setUser(res.data.data.user);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("❌ Error loading user:", error);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  /* ================================
     LOGIN - UPDATED
  ================================ */
  const login = async (email, password) => {
    console.log("📤 Login request to:", `${API_URL}/auth/login`);
    
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password 
      });

      console.log("📥 Login response:", res.data);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Login failed");
      }

      setToken(res.data.token);
      setUser(res.data.user);

      return res.data.user;
    } catch (error) {
      console.error("💥 Login error:", error);
      
      // Provide better error messages
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };

  /* ================================
     REGISTER
  ================================ */
  const register = async (data) => {
    const res = await axios.post(`${API_URL}/auth/register`, data);

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Registration failed");
    }

    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const registerPublic = async (data) => {
    const res = await axios.post(`${API_URL}/public/register`, data);

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Registration failed");
    }

    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  /* ================================
     LOGOUT
  ================================ */
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  /* ================================
     PROFILE / PASSWORD
  ================================ */
  const updateProfile = async (data) => {
    const endpoint =
      user?.role === "public"
        ? `${API_URL}/public/profile`
        : `${API_URL}/auth/profile`;

    const res = await axios.put(endpoint, data);

    if (!res.data?.success) {
      throw new Error("Profile update failed");
    }

    setUser(res.data.user || res.data.data);
    return res.data.user || res.data.data;
  };

  const updatePassword = async (data) => {
    const endpoint =
      user?.role === "public"
        ? `${API_URL}/public/password`
        : `${API_URL}/auth/password`;

    const res = await axios.put(endpoint, data);

    if (!res.data?.success) {
      throw new Error("Password update failed");
    }

    return res.data;
  };

  /* ================================
     HELPERS
  ================================ */
  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);

  /* ================================
     CONTEXT VALUE
  ================================ */
  const value = {
    user,
    token,
    loading,

    // auth
    login,
    register,
    registerPublic,
    logout,

    // profile
    updateProfile,
    updatePassword,

    // role helpers
    hasRole,
    hasAnyRole,

    // flags - FIXED: department_head not departmentHead
    isAuthenticated: !!user,
    isPublicUser: user?.role === "public",
    isStaffUser: user?.role === "staff",
    isCollector: user?.role === "collector",
    isDepartmentHead: user?.role === "department_head", // Fixed this line
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;