import { useState } from "react";
import api from "../utils/api";

export default function ReportProblem() {
  const [data, setData] = useState({
    name: "",
    contact: "",
    department: "Revenue & Disaster Management",
    problem: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("report");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/public/report", data);
    alert("Problem submitted successfully!");
  };

  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard", badge: null },
    { id: "report", icon: "⚠️", label: "Report Problem", badge: 3 },
    { id: "notifications", icon: "🔔", label: "Notifications", badge: 12 },
    { id: "revenue", icon: "💰", label: "Revenue & Disaster", badge: null },
    { id: "users", icon: "👥", label: "User Management", badge: null },
    { id: "reports", icon: "📋", label: "Reports", badge: 7 },
    { id: "settings", icon: "⚙️", label: "Settings", badge: null },
    { id: "help", icon: "❓", label: "Help & Support", badge: null },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Modern Sidebar */}
      <div className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} relative`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ADMINSIGHT</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
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
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="text-xl transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              {sidebarOpen && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-xl ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AJ</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Report a Problem</h1>
            <p className="text-gray-600">Submit and track issues that need immediate attention</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Issues</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Resolved Today</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">2.4h</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 000-0000"
                      onChange={(e) => setData({ ...data, contact: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                    onChange={(e) => setData({ ...data, department: e.target.value })}
                  >
                    {[
                      "Revenue & Disaster Management",
                      "Health",
                      "Education",
                      "Agriculture",
                      "Police",
                      "Rural Development",
                      "Public Works (PWD)",
                      "Transport",
                      "Social Welfare",
                      "Electricity & Water",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Problem Description *
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Please describe the problem in detail..."
                    onChange={(e) => setData({ ...data, problem: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>🔒</span>
                    <span>Your report is secure and confidential</span>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Submit Problem
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-center">
              <span className="text-2xl mb-2 block">📞</span>
              <p className="font-semibold text-gray-800">Emergency Contact</p>
            </button>
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-center">
              <span className="text-2xl mb-2 block">📋</span>
              <p className="font-semibold text-gray-800">View Past Reports</p>
            </button>
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-center">
              <span className="text-2xl mb-2 block">🕒</span>
              <p className="font-semibold text-gray-800">Check Status</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}