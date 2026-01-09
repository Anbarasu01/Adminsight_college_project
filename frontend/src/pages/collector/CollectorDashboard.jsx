import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import DashboardCard from "../../components/DashboardCard";
import DepartmentReports from "../../components/DepartmentReports";
import ReportList from "../../components/ReportList";
import StaffTasks from "../../components/StaffTasks";
import NotificationCard from "../../components/NotificationCard";
import ProblemForm from "../../components/ProblemForm";

// Import CollectorUsers component
import CollectorUsers from "./CollectorUsers";
import axios from "axios";

// Define API URL - FIXED: Remove /api from the end
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CollectorDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Collector metrics state
  const [collectorMetrics, setCollectorMetrics] = useState({
    collectionRate: 0,
    successPercentage: 0,
    dailyTarget: 0,
    weeklyTarget: 0,
    dailyAchieved: 0,
    weeklyAchieved: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalCustomers: 0,
    overdueCustomers: 0,
    assignedArea: "District A",
    urgentAlerts: 0,
  });

  // Add state for department notifications
  const [departmentNotifications, setDepartmentNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [assignedRoute, setAssignedRoute] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCustomersPreview, setShowCustomersPreview] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active section from URL path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/collector/department")) return "departments";
    if (path.includes("/collector/tasks")) return "tasks";
    if (path.includes("/collector/reports")) return "reports";
    if (path.includes("/collector/notifications")) return "notifications";
    if (path.includes("/collector/profile")) return "profile";
    if (path.includes("/collector/users")) return "users";
    return "dashboard";
  };

  const [activeSection, setActiveSection] = useState(getActiveSection());

  // Update active section when URL changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location]);

  // Menu items
  const menuItems = [
    {
      path: "/collector/dashboard",
      icon: "📊",
      label: "Dashboard",
      section: "dashboard",
    },
    {
      path: "/collector/users",
      icon: "👥",
      label: "Customers",
      section: "users",
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
      path: "/collector/department",
      icon: "🏢",
      label: "Departments",
      section: "departments",
    },
    {
      path: "/collector/profile",
      icon: "👤",
      label: "Profile",
      section: "profile",
    },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchCollectorStats();
    fetchDepartments();
    fetchDepartmentNotifications();
  }, []);

  // Get token function
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [problemsRes, statsRes] = await Promise.all([
        api.get("/collector/problems"),
        api.get("/collector/stats"),
      ]);

      setProblems(problemsRes.data.problems || []);
      setStats(
        statsRes.data.stats || {
          totalProblems: problemsRes.data.problems?.length || 0,
          pending:
            problemsRes.data.problems?.filter((p) => p.status === "Pending" || p.status === "pending")
              .length || 0,
          inProgress:
            problemsRes.data.problems?.filter((p) => p.status === "In Progress" || p.status === "in-progress")
              .length || 0,
          resolved:
            problemsRes.data.problems?.filter((p) => p.status === "Resolved" || p.status === "resolved")
              .length || 0,
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setProblems([]);
      setStats({
        totalProblems: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_URL}/api/collector/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setDepartments(response.data.departments || response.data.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Fallback to static departments if API fails
      setDepartments([
        "Revenue & Disaster Management",
        "Health Department",
        "Education Department",
        "Agriculture Department",
        "Police Department",
        "Rural Development",
        "Public Works (PWD)",
        "Transport Department",
        "Social Welfare",
        "Electricity & Water Board"
      ]);
    }
  };

  // Fetch department notifications - UPDATED VERSION
  const fetchDepartmentNotifications = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        console.warn("No token found, skipping department notifications fetch");
        return;
      }

      // First try the new department notifications endpoint
      try {
        const response = await axios.get(
          `${API_URL}/api/notifications/departments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Department notifications API response:", response.data);
        
        // Process the response based on your backend structure
        let notifications = [];
        
        if (response.data.success && response.data.notifications) {
          notifications = response.data.notifications;
        } else if (Array.isArray(response.data)) {
          notifications = response.data;
        } else if (response.data.data) {
          notifications = response.data.data;
        }
        
        // Format for display
        const formattedNotifications = notifications.map(notification => ({
          id: notification._id || notification.id || Math.random().toString(36).substr(2, 9),
          department: notification.department || notification.recipient || 'Department',
          message: notification.message || notification.title || 'New notification',
          time: formatNotificationTime(notification.createdAt || notification.timestamp || notification.time),
          type: notification.type || 'notification',
          priority: notification.priority || 'medium'
        }));
        
        setDepartmentNotifications(formattedNotifications);
        return; // Success, exit function
        
      } catch (departmentError) {
        console.log("Department endpoint not available yet:", departmentError.message);
        
        // Fallback to existing notifications endpoint and filter
        await fetchAndFilterAllNotifications();
      }
      
    } catch (error) {
      console.error("Error in fetchDepartmentNotifications:", error);
      // Keep existing mock data for now
      setDepartmentNotifications([
        {
          id: 1,
          department: "Health Department",
          message: "New problem assigned: Waste management issue in Sector 5",
          time: "2 hours ago",
          type: "assignment"
        },
        {
          id: 2,
          department: "Public Works (PWD)",
          message: "Road repair completed in Main Street",
          time: "1 day ago",
          type: "completion"
        },
        {
          id: 3,
          department: "Police Department",
          message: "Safety issue reported near City Park",
          time: "3 days ago",
          type: "alert"
        }
      ]);
    }
  };

  // Fallback function to fetch all notifications and filter for department ones
  const fetchAndFilterAllNotifications = async () => {
    try {
      const token = getToken();
      
      // Try to get all notifications from existing endpoint
      const response = await axios.get(
        `${API_URL}/api/notifications/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("All notifications response:", response.data);
      
      // Extract notifications array
      let allNotifications = [];
      if (Array.isArray(response.data)) {
        allNotifications = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        allNotifications = response.data.data;
      } else if (response.data.notifications && Array.isArray(response.data.notifications)) {
        allNotifications = response.data.notifications;
      }
      
      // Filter for department-related notifications
      const departmentKeywords = [
        'department', 'Department', 'assigned', 'assignment', 
        'Health', 'Police', 'Education', 'Revenue', 'PWD',
        'Public Works', 'Transport', 'Agriculture', 'Social Welfare'
      ];
      
      const deptNotifications = allNotifications.filter(notification => {
        const message = (notification.message || '').toLowerCase();
        const title = (notification.title || '').toLowerCase();
        const type = (notification.type || '').toLowerCase();
        
        return departmentKeywords.some(keyword => 
          message.includes(keyword.toLowerCase()) ||
          title.includes(keyword.toLowerCase()) ||
          type.includes(keyword.toLowerCase())
        );
      });
      
      // Format for display
      const formattedNotifications = deptNotifications.map(notification => ({
        id: notification._id || notification.id || Math.random().toString(36).substr(2, 9),
        department: extractDepartmentFromNotification(notification),
        message: notification.message || notification.title || 'New notification',
        time: formatNotificationTime(notification.createdAt || notification.timestamp),
        type: notification.type || 'notification',
        priority: notification.priority || 'medium'
      }));
      
      setDepartmentNotifications(formattedNotifications);
      
    } catch (filterError) {
      console.error("Error filtering notifications:", filterError);
      // If all fails, show empty array
      setDepartmentNotifications([]);
    }
  };

  // Helper function to extract department from notification
  const extractDepartmentFromNotification = (notification) => {
    const departments = [
      "Revenue & Disaster Management",
      "Health Department",
      "Education Department",
      "Agriculture Department",
      "Police Department",
      "Rural Development",
      "Public Works (PWD)",
      "Transport Department",
      "Social Welfare",
      "Electricity & Water Board"
    ];
    
    // Check message for department names
    const message = notification.message || '';
    const title = notification.title || '';
    
    for (const dept of departments) {
      if (message.includes(dept) || title.includes(dept)) {
        return dept;
      }
    }
    
    // Check for partial matches
    if (message.includes('Health') || message.includes('Medical')) {
      return 'Health Department';
    }
    if (message.includes('Police') || message.includes('Security')) {
      return 'Police Department';
    }
    if (message.includes('Education') || message.includes('School')) {
      return 'Education Department';
    }
    if (message.includes('Road') || message.includes('PWD') || message.includes('Public Works')) {
      return 'Public Works (PWD)';
    }
    if (message.includes('Revenue') || message.includes('Tax')) {
      return 'Revenue & Disaster Management';
    }
    if (message.includes('Transport') || message.includes('Traffic')) {
      return 'Transport Department';
    }
    if (message.includes('Agriculture') || message.includes('Farm')) {
      return 'Agriculture Department';
    }
    
    return notification.recipient || 'General Department';
  };

  // Format notification time
  const formatNotificationTime = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  // Fetch collector-specific stats
  const fetchCollectorStats = async () => {
    try {
      const response = await api.get("/collector/stats");

      setCollectorMetrics({
        collectionRate: response.data?.collectionRate || 85,
        successPercentage: response.data?.successPercentage || 92,
        dailyTarget: response.data?.dailyTarget || 50,
        weeklyTarget: response.data?.weeklyTarget || 300,
        dailyAchieved: response.data?.dailyAchieved || 42,
        weeklyAchieved: response.data?.weeklyAchieved || 245,
        pendingTasks: response.data?.pendingTasks || 8,
        completedTasks: response.data?.completedTasks || 42,
        totalCustomers: response.data?.totalCustomers || 125,
        overdueCustomers: response.data?.overdueCustomers || 15,
        assignedArea: response.data?.assignedArea || "District A",
        urgentAlerts: response.data?.urgentAlerts || 3,
      });
    } catch (error) {
      console.error("Error fetching collector stats:", error);
      setCollectorMetrics({
        collectionRate: 85,
        successPercentage: 92,
        dailyTarget: 50,
        weeklyTarget: 300,
        dailyAchieved: 42,
        weeklyAchieved: 245,
        pendingTasks: 8,
        completedTasks: 42,
        totalCustomers: 125,
        overdueCustomers: 15,
        assignedArea: "District A",
        urgentAlerts: 3,
      });
    }
  };

  // Fetch assigned route/area map data
  const fetchAssignedRoute = async () => {
    try {
      setAssignedRoute([
        { lat: 12.9716, lng: 77.5946 },
        { lat: 13.0827, lng: 80.2707 },
      ]);

      setRecentActivities([
        {
          type: "collection",
          description: "Completed collection in North Zone",
          time: "2 hours ago",
          amount: "₹12,500",
        },
        {
          type: "visit",
          description: "Field visit to ABC Industries",
          time: "5 hours ago",
        },
        {
          type: "report",
          description: "Submitted weekly collection report",
          time: "1 day ago",
        },
        {
          type: "collection",
          description: "Collected from 15 customers",
          time: "2 days ago",
          amount: "₹8,750",
        },
      ]);
    } catch (error) {
      console.error("Error fetching route data:", error);
      setAssignedRoute([]);
    }
  };

  // Assign department function - FIXED
  const assignDepartment = async (problemId, departmentName) => {
    try {
      const token = getToken();
      
      if (!token) {
        alert('Please login again to continue');
        return;
      }

      console.log('Assigning department:', { problemId, departmentName });

      const response = await axios.put(
        `${API_URL}/api/collector/problems/${problemId}/assign`,
        { departmentName },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Show success message
      alert(`Successfully assigned to ${departmentName}`);
      
      // Fetch updated data
      fetchDashboardData();
      fetchDepartmentNotifications();
      
      return response.data;
    } catch (error) {
      console.error('Assign department error:', error.response || error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  // Update problem status function - FIXED
  const updateProblemStatus = async (problemId, status) => {
    try {
      const token = getToken();
      
      if (!token) {
        alert('Please login again to continue');
        return;
      }

      // Validate status
      const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
      const statusLower = status.toLowerCase();
      if (!validStatuses.includes(statusLower)) {
        alert(`Invalid status. Use: ${validStatuses.join(', ')}`);
        return;
      }

      console.log('Updating status:', { problemId, status: statusLower });

      const response = await axios.put(
        `${API_URL}/api/collector/problems/${problemId}/status`,
        { status: statusLower },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      alert(`Status updated to ${status}`);
      
      // Fetch updated data
      fetchDashboardData();
      fetchDepartmentNotifications();
      
      return response.data;
    } catch (error) {
      console.error('Update status error:', error.response || error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  // Start a new collection task
  const startNewTask = async () => {
    try {
      alert("New collection task would be started here.");
      navigate("/collector/tasks");
    } catch (error) {
      console.error("Error starting task:", error);
      alert("Failed to start task. Please try again.");
    }
  };

  // Log a field visit
  const logFieldVisit = () => {
    navigate("/collector/tasks?action=log-visit");
  };

  // Submit daily collection report
  const submitDailyReport = () => {
    navigate("/collector/reports?action=submit-daily");
  };

  // View assigned area map
  const viewAssignedArea = () => {
    alert(`Viewing assigned area: ${collectorMetrics.assignedArea}`);
  };

  // View department notifications
  const viewDepartmentNotifications = (departmentName) => {
    navigate(`/collector/notifications?department=${encodeURIComponent(departmentName)}`);
  };

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Render different sections based on activeSection
  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return <CollectorUsers />;
      case "departments":
        return <DepartmentReports />;
      case "reports":
        return <ReportList />;
      case "tasks":
        return <StaffTasks />;
      case "notifications":
        return renderNotifications();
      case "profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  // Render Notifications Section with Department Notifications
  const renderNotifications = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Notifications
      </h2>
      
      {/* Department Notifications Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Department Notifications
          </h3>
          <button
            onClick={fetchDepartmentNotifications}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
        
        {departmentNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              No Department Notifications
            </h4>
            <p className="text-gray-500">
              When departments are assigned to problems, notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {departmentNotifications.map((notification) => (
              <div
                key={notification.id || notification._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => viewDepartmentNotifications(notification.department)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    notification.type === 'assignment' ? 'bg-blue-100' :
                    notification.type === 'completion' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    <span className={`text-xl ${
                      notification.type === 'assignment' ? 'text-blue-600' :
                      notification.type === 'completion' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {notification.type === 'assignment' ? '📋' :
                       notification.type === 'completion' ? '✅' : '🚨'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {notification.department}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                        notification.type === 'completion' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {notification.type === 'assignment' ? 'New Assignment' :
                         notification.type === 'completion' ? 'Task Completed' : 'Alert'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Notifications */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          System Notifications
        </h3>
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
    </div>
  );

  // Render Profile Section
  const renderProfile = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Collector Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500">Name</label>
              <p className="text-gray-800">District Collector</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Email</label>
              <p className="text-gray-800">collector@admin.com</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Role</label>
              <p className="text-gray-800">District Collector</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">
                Assigned Area
              </label>
              <p className="text-gray-800">
                {collectorMetrics.assignedArea}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">
                Collection Rate
              </label>
              <p className="text-gray-800">
                {collectorMetrics.collectionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-8">
      {/* Collection Performance Metrics */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Collection Performance
            </h2>
            <p className="text-gray-600">
              Your personal collection metrics and targets
            </p>
          </div>
          <button
            onClick={viewAssignedArea}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-shadow"
          >
            <span>📍</span>
            <span>View Assigned Area</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <DashboardCard
            title="Collection Rate"
            value={`${collectorMetrics.collectionRate}%`}
            icon="📈"
            color="green"
            gradient="from-green-500 to-emerald-500"
            subtitle="Success rate"
          />
          <DashboardCard
            title="Daily Target"
            value={`${collectorMetrics.dailyAchieved}/${collectorMetrics.dailyTarget}`}
            icon="🎯"
            color="blue"
            gradient="from-blue-500 to-cyan-500"
            subtitle="Collections today"
          />
          <DashboardCard
            title="Pending Tasks"
            value={collectorMetrics.pendingTasks}
            icon="⏳"
            color="yellow"
            gradient="from-yellow-500 to-orange-500"
            subtitle="To be completed"
          />
          <DashboardCard
            title="Total Customers"
            value={collectorMetrics.totalCustomers}
            icon="👥"
            color="purple"
            gradient="from-purple-500 to-pink-500"
            subtitle="Assigned customers"
          />
          <DashboardCard
            title="Urgent Alerts"
            value={collectorMetrics.urgentAlerts}
            icon="🚨"
            color="red"
            gradient="from-red-500 to-pink-500"
            subtitle="Require attention"
          />
        </div>

        {/* Progress Bars for Targets */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Target Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Daily Target</span>
                <span className="font-semibold">
                  {Math.round(
                    (collectorMetrics.dailyAchieved /
                      collectorMetrics.dailyTarget) *
                      100
                  ) || 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (collectorMetrics.dailyAchieved /
                        collectorMetrics.dailyTarget) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Weekly Target</span>
                <span className="font-semibold">
                  {Math.round(
                    (collectorMetrics.weeklyAchieved /
                      collectorMetrics.weeklyTarget) *
                      100
                  ) || 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (collectorMetrics.weeklyAchieved /
                        collectorMetrics.weeklyTarget) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button
          onClick={startNewTask}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Start Task</h3>
              <p className="text-blue-100 text-sm">Begin collection round</p>
            </div>
          </div>
        </button>

        <button
          onClick={logFieldVisit}
          className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Log Visit</h3>
              <p className="text-green-100 text-sm">Record field visit</p>
            </div>
          </div>
        </button>

        <button
          onClick={submitDailyReport}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Submit Report</h3>
              <p className="text-purple-100 text-sm">Daily collection report</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate("/collector/users")}
          className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">View Customers</h3>
              <p className="text-orange-100 text-sm">Assigned customers</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Recent Activities
            </h3>
            <button
              onClick={() => {
                fetchCollectorStats();
                fetchAssignedRoute();
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activities found. Click Refresh to load sample data.
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {activity.type === "collection"
                      ? "💰"
                      : activity.type === "visit"
                      ? "📍"
                      : activity.type === "report"
                      ? "📄"
                      : "📋"}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {activity.amount || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Problems Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 overflow-hidden mb-8">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Reported Problems
              </h2>
              <p className="text-blue-100 mt-1">
                Assign departments to handle reported problems
              </p>
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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Problems Reported
              </h3>
              <p className="text-gray-500">
                When problems are reported, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {problems.map((problem) => (
                <div
                  key={problem._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {problem.problemTitle || problem.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              problem.status
                            )}`}
                          >
                            {problem.status || "Pending"}
                          </span>
                          {problem.priority && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                                problem.priority
                              )}`}
                            >
                              {problem.priority} Priority
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {problem.description}
                        </p>

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
                              <span>
                                {new Date(
                                  problem.createdAt
                                ).toLocaleDateString()}
                              </span>
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
                            onChange={(e) => {
                              if (e.target.value) {
                                assignDepartment(problem._id, e.target.value);
                              }
                            }}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                            defaultValue={problem.assignedDepartment || ""}
                          >
                            <option value="" disabled>
                              Select Department
                            </option>
                            {Array.isArray(departments) && departments.map((dept, index) => (
                              <option key={index} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Update */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Status:
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                updateProblemStatus(problem._id, e.target.value);
                              }
                            }}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                            defaultValue={problem.status || "pending"}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>

                        {problem.assignedDepartment && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm">
                            <p className="text-sm text-green-800 font-medium flex items-center space-x-2">
                              <span className="text-green-600">✅</span>
                              <span>
                                Assigned to: {problem.assignedDepartment}
                              </span>
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

      {/* Customer Preview Modal */}
      {showCustomersPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Assigned Customers Preview</h3>
              <button
                onClick={() => setShowCustomersPreview(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-auto">
              <CollectorUsers previewMode={true} limit={10} />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => navigate("/collector/users")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow"
              >
                View All Customers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Collector Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Enhanced Sidebar */}
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
                  <p className="text-xs text-gray-500 truncate">
                    Area: {collectorMetrics.assignedArea}
                  </p>
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
                  {activeSection.charAt(0).toUpperCase() +
                    activeSection.slice(1)}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === "dashboard" &&
                    "Manage collection tasks and view performance metrics"}
                  {activeSection === "users" &&
                    "Manage assigned customers and collection records"}
                  {activeSection === "departments" &&
                    "View and manage department reports"}
                  {activeSection === "reports" &&
                    "View collection reports and analytics"}
                  {activeSection === "tasks" &&
                    "Manage your assigned collection tasks"}
                  {activeSection === "notifications" &&
                    "View system and department notifications"}
                  {activeSection === "profile" &&
                    "Manage your collector profile"}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Collection Rate</p>
                    <p className="font-semibold text-gray-800">
                      {collectorMetrics.collectionRate}%
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

        {/* Render Active Section */}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default CollectorDashboard;