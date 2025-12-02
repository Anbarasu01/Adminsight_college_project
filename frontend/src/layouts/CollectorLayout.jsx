// src/layouts/CollectorLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CollectorLayout = ({ children, title, description }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes('/collector/department')) return 'departments';
    if (path.includes('/collector/tasks')) return 'tasks';
    if (path.includes('/collector/reports')) return 'reports';
    if (path.includes('/collector/notifications')) return 'notifications';
    if (path.includes('/collector/profile')) return 'profile';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  const menuItems = [
    {
      path: "/collector/dashboard",
      icon: "📊",
      label: "Dashboard",
      section: "dashboard",
    },
    {
      path: "/collector/department",
      icon: "🏢",
      label: "Departments",
      section: "departments",
    },
    {
      path: "/collector/tasks",
      icon: "✅",
      label: "Tasks",
      section: "tasks",
    },
    {
      path: "/collector/reports",
      icon: "📋",
      label: "Reports",
      section: "reports",
    },
    {
      path: "/collector/notifications",
      icon: "🔔",
      label: "Notifications",
      section: "notifications",
    },
    {
      path: "/collector/profile",
      icon: "👤",
      label: "Profile",
      section: "profile",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Sidebar */}
      <div
        className={`bg-white/90 backdrop-blur-lg shadow-2xl border-r border-blue-100 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } relative z-20`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ADMINSIGHT</h1>
                <p className="text-xs text-gray-500">Collector Portal</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.section}
              to={item.path}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.section
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="text-xl transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="font-medium flex-1 text-left">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/collector/profile">
            <div
              className={`flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-colors ${
                !sidebarOpen && "justify-center"
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">DC</span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    District Collector
                  </p>
                  <p className="text-xs text-gray-500 truncate">Administrator</p>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-blue-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {description}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-semibold text-gray-800">
                      District Collector
                    </p>
                  </div>
                  <Link to="/collector/profile">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                      DC
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollectorLayout;