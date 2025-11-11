

// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 👈 For redirect

  // 🟢 Register user
  const register = async (formData) => {
    try {
      const res = await api.post("/auth/register", formData);
      alert(res.data.message || "Registration successful!");
      console.log("✅ Registered:", res.data);
    } catch (error) {
      console.error("❌ Register Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // 🟢 Login user
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);

      // ✅ Role-based Redirect
      switch (data.user.role) {
        case "collector":
          navigate("/collector-dashboard");
          break;
        case "department":
          navigate("/department-dashboard");
          break;
        case "staff":
          navigate("/staff-dashboard");
          break;
        default:
          navigate("/public-dashboard");
      }
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
