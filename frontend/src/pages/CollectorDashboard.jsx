// src/pages/CollectorDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import DashboardCard from "../components/DashboardCard";
import NotificationCard from "../components/NotificationCard";

const CollectorDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [problemsRes, statsRes] = await Promise.all([
        api.get("/problems"),
        api.get("/dashboard/stats")
      ]);
      
      setProblems(problemsRes.data);
      setStats(statsRes.data || {
        totalProblems: problemsRes.data.length,
        pending: problemsRes.data.filter(p => p.status === 'pending').length,
        inProgress: problemsRes.data.filter(p => p.status === 'inProgress').length,
        resolved: problemsRes.data.filter(p => p.status === 'resolved').length
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignDepartment = async (problemId, department) => {
    try {
      await api.put(`/problems/${problemId}/assign`, { department });
      alert(`Problem successfully assigned to ${department}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Failed to assign department. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inProgress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Collector Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and assign problems to departments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-800">District Collector</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                DC
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Problems"
            value={stats.totalProblems}
            icon="fas fa-clipboard-list"
            color="blue"
            gradient="from-blue-500 to-cyan-500"
          />
          <DashboardCard
            title="Pending"
            value={stats.pending}
            icon="fas fa-clock"
            color="yellow"
            gradient="from-yellow-500 to-orange-500"
          />
          <DashboardCard
            title="In Progress"
            value={stats.inProgress}
            icon="fas fa-spinner"
            color="purple"
            gradient="from-purple-500 to-pink-500"
          />
          <DashboardCard
            title="Resolved"
            value={stats.resolved}
            icon="fas fa-check-circle"
            color="green"
            gradient="from-green-500 to-teal-500"
          />
        </div>

        {/* Problems Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Reported Problems</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {problems.length} issues
              </span>
            </div>
            <p className="text-gray-600 mt-1">Assign departments to handle reported problems</p>
          </div>

          <div className="p-6">
            {problems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-inbox text-gray-400 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Problems Reported</h3>
                <p className="text-gray-500">When problems are reported, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {problems.map((problem) => (
                  <div key={problem._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{problem.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(problem.status)}`}>
                              {problem.status?.charAt(0).toUpperCase() + problem.status?.slice(1) || 'Pending'}
                            </span>
                            {problem.priority && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(problem.priority)}`}>
                                {problem.priority} Priority
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{problem.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {problem.location && (
                              <div className="flex items-center space-x-1">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{problem.location}</span>
                              </div>
                            )}
                            {problem.createdAt && (
                              <div className="flex items-center space-x-1">
                                <i className="fas fa-calendar"></i>
                                <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {problem.reporter && (
                              <div className="flex items-center space-x-1">
                                <i className="fas fa-user"></i>
                                <span>Reported by {problem.reporter}</span>
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
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                              defaultValue=""
                            >
                              <option value="" disabled>Select Department</option>
                              <option value="Revenue & Disaster Management">Revenue & Disaster Management</option>
                              <option value="Health">Health Department</option>
                              <option value="Education">Education Department</option>
                              <option value="Agriculture">Agriculture Department</option>
                              <option value="Police">Police Department</option>
                              <option value="Rural Development">Rural Development</option>
                              <option value="Public Works (PWD)">Public Works (PWD)</option>
                              <option value="Transport">Transport Department</option>
                              <option value="Social Welfare">Social Welfare</option>
                              <option value="Electricity & Water">Electricity & Water Board</option>
                            </select>
                          </div>
                          {problem.assignedDepartment && (
                            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                              <p className="text-sm text-green-800 font-medium">
                                <i className="fas fa-check-circle mr-2"></i>
                                Assigned to: {problem.assignedDepartment}
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed reports</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bell text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-600">Check updates</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-cog text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Settings</h3>
                <p className="text-sm text-gray-600">Manage preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default CollectorDashboard;