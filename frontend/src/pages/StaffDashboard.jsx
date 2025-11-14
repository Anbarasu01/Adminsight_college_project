import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const staffId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [staffId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/staff/${staffId}`);
      const tasksData = response.data;
      
      setTasks(tasksData);
      calculateStats(tasksData);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasksData) => {
    const stats = {
      total: tasksData.length,
      pending: tasksData.filter(task => task.status === 'pending').length,
      inProgress: tasksData.filter(task => task.status === 'inProgress').length,
      completed: tasksData.filter(task => task.status === 'completed' || task.status === 'resolved').length
    };
    setStats(stats);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inProgress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleReportProblem = () => {
    navigate("/report-problem");
  };

  const handleViewNotifications = () => {
    navigate("/notifications");
  };

  const filteredTasks = tasks.filter(task => {
    switch (activeTab) {
      case 'pending': return task.status === 'pending';
      case 'inProgress': return task.status === 'inProgress';
      case 'completed': return task.status === 'completed' || task.status === 'resolved';
      default: return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex">
      {/* Left Sidebar - Modern Design */}
      <div className="w-80 bg-gradient-to-b from-green-600 to-blue-700 text-white shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-green-500">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <i className="fas fa-user-cog text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">ADMINSIGHT</h1>
              <p className="text-green-200 text-sm">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-green-500">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
              <i className="fas fa-user text-2xl"></i>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Staff Member</h2>
              <p className="text-green-200 text-sm">Department Staff</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-200 text-xs">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                activeTab === "all" 
                  ? "bg-white/20 backdrop-blur-sm text-white shadow-lg" 
                  : "text-green-100 hover:bg-white/10 hover:backdrop-blur-sm"
              }`}
            >
              <i className="fas fa-th-large w-5"></i>
              <span className="font-medium">All Tasks</span>
              <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-xs">
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                activeTab === "pending" 
                  ? "bg-white/20 backdrop-blur-sm text-white shadow-lg" 
                  : "text-green-100 hover:bg-white/10 hover:backdrop-blur-sm"
              }`}
            >
              <i className="fas fa-clock w-5"></i>
              <span className="font-medium">Pending</span>
              <span className="ml-auto bg-yellow-500 px-2 py-1 rounded-full text-xs">
                {stats.pending}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("inProgress")}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                activeTab === "inProgress" 
                  ? "bg-white/20 backdrop-blur-sm text-white shadow-lg" 
                  : "text-green-100 hover:bg-white/10 hover:backdrop-blur-sm"
              }`}
            >
              <i className="fas fa-spinner w-5"></i>
              <span className="font-medium">In Progress</span>
              <span className="ml-auto bg-blue-500 px-2 py-1 rounded-full text-xs">
                {stats.inProgress}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                activeTab === "completed" 
                  ? "bg-white/20 backdrop-blur-sm text-white shadow-lg" 
                  : "text-green-100 hover:bg-white/10 hover:backdrop-blur-sm"
              }`}
            >
              <i className="fas fa-check-circle w-5"></i>
              <span className="font-medium">Completed</span>
              <span className="ml-auto bg-green-500 px-2 py-1 rounded-full text-xs">
                {stats.completed}
              </span>
            </button>
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-green-500">
          <h3 className="text-green-200 text-sm font-semibold mb-3 px-2">QUICK ACTIONS</h3>
          <div className="space-y-2">
            <button
              onClick={handleReportProblem}
              className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm text-green-100 hover:bg-white/20 transition-all duration-200 group"
            >
              <i className="fas fa-plus-circle group-hover:scale-110 transition-transform duration-200"></i>
              <span>Report Problem</span>
            </button>

            <button
              onClick={handleViewNotifications}
              className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm text-green-100 hover:bg-white/20 transition-all duration-200 group"
            >
              <i className="fas fa-bell group-hover:scale-110 transition-transform duration-200"></i>
              <span>Notifications</span>
              <span className="ml-auto bg-red-500 px-2 py-1 rounded-full text-xs">3</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-green-500 mt-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-200 text-sm">Performance</span>
              <span className="text-white font-bold">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-green-200 text-xs mt-2 text-center">
              Task Completion Rate
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-green-200">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Staff Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your assigned tasks and responsibilities</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                  <i className="fas fa-sync-alt"></i>
                  <span>Refresh</span>
                </button>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  S
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Tasks"
              value={stats.total}
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
              title="Completed"
              value={stats.completed}
              icon="fas fa-check-circle"
              color="green"
              gradient="from-green-500 to-teal-500"
            />
          </div>

          {/* Tasks Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeTab === 'all' ? 'All Tasks' : 
                   activeTab === 'pending' ? 'Pending Tasks' :
                   activeTab === 'inProgress' ? 'Tasks In Progress' : 'Completed Tasks'}
                </h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredTasks.length} tasks
                </span>
              </div>
            </div>

            <div className="p-6">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-gray-400 text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tasks Found</h3>
                  <p className="text-gray-500">
                    {activeTab === 'all' 
                      ? "You're all caught up! New tasks will appear here when assigned."
                      : `No ${activeTab} tasks at the moment.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredTasks.map((task) => (
                    <div key={task._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                                {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                              </span>
                              {task.priority && (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                                  {task.priority} Priority
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4">{task.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              {task.department && (
                                <div className="flex items-center space-x-1">
                                  <i className="fas fa-building"></i>
                                  <span>{task.department}</span>
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="flex items-center space-x-1">
                                  <i className="fas fa-calendar-alt"></i>
                                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => updateTaskStatus(task._id, 'inProgress')}
                                disabled={task.status === 'inProgress' || task.status === 'completed'}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-200 ${
                                  task.status === 'inProgress' || task.status === 'completed'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                <i className="fas fa-play mr-2"></i>
                                Start Task
                              </button>
                              <button
                                onClick={() => updateTaskStatus(task._id, 'completed')}
                                disabled={task.status === 'completed'}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-200 ${
                                  task.status === 'completed'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                <i className="fas fa-check mr-2"></i>
                                Mark Complete
                              </button>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              <i className="fas fa-clock mr-1"></i>
                              Updated {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default StaffDashboard;