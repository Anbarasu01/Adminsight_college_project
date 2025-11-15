import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";
import DashboardCard from "../components/DashboardCard";
import DepartmentReports from "../components/DepartmentReports";
import ReportList from "../components/ReportList";
import StaffTasks from "../components/StaffTasks";
import NotificationCard from "../components/NotificationCard";
import ProblemForm from "../components/ProblemForm";

const CollectorDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const location = useLocation();

  const menuItems = [
    { path: "/collector-dashboard", icon: "📊", label: "Dashboard", section: "dashboard" },
    { path: "/departments", icon: "🏢", label: "Departments", section: "departments" },
    { path: "/problems", icon: "⚠️", label: "Problems", section: "problems" },
    { path: "/reports", icon: "📋", label: "Reports", section: "reports" },
    { path: "/tasks", icon: "✅", label: "Tasks", section: "tasks" },
    { path: "/notifications", icon: "🔔", label: "Notifications", section: "notifications" },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [problemsRes, statsRes] = await Promise.all([
        api.get("/collector/problems"),
        api.get("/collector/stats")
      ]);
      
      setProblems(problemsRes.data.problems || []);
      setStats(statsRes.data.stats || {
        totalProblems: problemsRes.data.problems?.length || 0,
        pending: problemsRes.data.problems?.filter(p => p.status === 'Pending').length || 0,
        inProgress: problemsRes.data.problems?.filter(p => p.status === 'In Progress').length || 0,
        resolved: problemsRes.data.problems?.filter(p => p.status === 'Resolved').length || 0
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setProblems([]);
      setStats({
        totalProblems: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const assignDepartment = async (problemId, department) => {
    try {
      await api.put(`/collector/problems/${problemId}/assign`, { department });
      alert(`Problem successfully assigned to ${department}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Failed to assign department. Please try again.");
    }
  };

  const updateProblemStatus = async (problemId, status) => {
    try {
      await api.put(`/collector/problems/${problemId}/status`, { status });
      alert(`Problem status updated to ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Render different sections based on activeSection
  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "departments":
        return <DepartmentReports />;
      case "reports":
        return <ReportList />;
      case "tasks":
        return <StaffTasks />;
      case "notifications":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
            <div className="space-y-4">
              <NotificationCard 
                title="New Problem Reported"
                message="A new waste management issue has been reported in your area."
                type="info"
                time="2 hours ago"
              />
              <NotificationCard 
                title="Department Assignment"
                message="You have been assigned to handle a new department report."
                type="warning"
                time="5 hours ago"
              />
              <NotificationCard 
                title="Task Completed"
                message="Your recent task has been marked as completed."
                type="success"
                time="1 day ago"
              />
            </div>
          </div>
        );
      case "problems":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Report New Problem</h2>
            <ProblemForm onSubmit={fetchDashboardData} />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="p-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Problems"
          value={stats.totalProblems}
          icon="📋"
          color="blue"
          gradient="from-blue-500 to-cyan-500"
        />
        <DashboardCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="yellow"
          gradient="from-yellow-500 to-orange-500"
        />
        <DashboardCard
          title="In Progress"
          value={stats.inProgress}
          icon="🔄"
          color="purple"
          gradient="from-purple-500 to-pink-500"
        />
        <DashboardCard
          title="Resolved"
          value={stats.resolved}
          icon="✅"
          color="green"
          gradient="from-green-500 to-teal-500"
        />
      </div>

      {/* Problems Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 overflow-hidden mb-8">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Reported Problems</h2>
              <p className="text-blue-100 mt-1">Assign departments to handle reported problems</p>
            </div>
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {problems.length} issues
            </span>
          </div>
        </div>

        <div className="p-8">
          {problems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-4xl">📭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Problems Reported</h3>
              <p className="text-gray-500">When problems are reported, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {problems.map((problem) => (
                <div key={problem._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{problem.problemTitle}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(problem.status)}`}>
                            {problem.status || 'Pending'}
                          </span>
                          {problem.priority && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(problem.priority)}`}>
                              {problem.priority} Priority
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{problem.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {problem.location && (
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                              <span className="text-blue-500">📍</span>
                              <span>{problem.location}</span>
                            </div>
                          )}
                          {problem.createdAt && (
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                              <span className="text-green-500">📅</span>
                              <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {problem.name && (
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                              <span className="text-purple-500">👤</span>
                              <span>Reported by {problem.name}</span>
                            </div>
                          )}
                          {problem.trackingId && (
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
                              <span className="text-orange-500">🔍</span>
                              <span>ID: {problem.trackingId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Assignment Section */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to Department:
                          </label>
                          <select
                            onChange={(e) => assignDepartment(problem._id, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                            defaultValue={problem.assignedDepartment || ""}
                          >
                            <option value="" disabled>Select Department</option>
                            <option value="Revenue & Disaster Management">Revenue & Disaster Management</option>
                            <option value="Health Department">Health Department</option>
                            <option value="Education Department">Education Department</option>
                            <option value="Agriculture Department">Agriculture Department</option>
                            <option value="Police Department">Police Department</option>
                            <option value="Rural Development">Rural Development</option>
                            <option value="Public Works (PWD)">Public Works (PWD)</option>
                            <option value="Transport Department">Transport Department</option>
                            <option value="Social Welfare">Social Welfare</option>
                            <option value="Electricity & Water Board">Electricity & Water Board</option>
                          </select>
                        </div>
                        
                        {/* Status Update */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Status:
                          </label>
                          <select
                            onChange={(e) => updateProblemStatus(problem._id, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                            defaultValue={problem.status || "Pending"}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        {problem.assignedDepartment && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm">
                            <p className="text-sm text-green-800 font-medium flex items-center space-x-2">
                              <span className="text-green-600">✅</span>
                              <span>Assigned to: {problem.assignedDepartment}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={fetchDashboardData}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">🔄</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Refresh Data</h3>
              <p className="text-blue-100 text-sm">Update dashboard information</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveSection("notifications")}
          className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">🔔</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-green-100 text-sm">Check latest updates</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveSection("reports")}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Reports</h3>
              <p className="text-purple-100 text-sm">View analytics</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Enhanced Sidebar */}
      <div className={`bg-white/90 backdrop-blur-lg shadow-2xl border-r border-blue-100 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} relative z-20`}>
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
            <button
              key={item.section}
              onClick={() => setActiveSection(item.section)}
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
                <span className="font-medium flex-1 text-left">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">DC</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">District Collector</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </div>
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
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === "dashboard" && "Manage and assign problems to departments"}
                  {activeSection === "departments" && "View and manage department reports"}
                  {activeSection === "reports" && "View assigned reports and update status"}
                  {activeSection === "tasks" && "Manage your assigned tasks"}
                  {activeSection === "notifications" && "View system notifications"}
                  {activeSection === "problems" && "Report new problems"}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-semibold text-gray-800">District Collector</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    DC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render Active Section */}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default CollectorDashboard;