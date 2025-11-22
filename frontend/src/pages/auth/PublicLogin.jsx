import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const PublicPortal = () => {
  const [activeTab, setActiveTab] = useState("report"); // report, status, notifications
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Revenue & Disaster Management",
    problemTitle: "",
    description: "",
    location: "",
  });

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
    "Electricity & Water Board",
  ];

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "update",
      message: "Your complaint #TRK123 has been assigned to Revenue Department",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "resolved",
      message: "Complaint #TRK456 has been resolved successfully",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "info",
      message: "New service announcement: Faster response times implemented",
      time: "2 days ago",
      read: true,
    },
  ];

  useEffect(() => {
    // Load notifications
    setNotifications(mockNotifications);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post("/public/report", formData);
      const generatedId = `TRK${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      setSubmitStatus("success");
      setTrackingId(generatedId);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "Revenue & Disaster Management",
        problemTitle: "",
        description: "",
        location: "",
      });

      // Add success notification
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "success",
          message: `Your complaint ${generatedId} has been submitted successfully`,
          time: "Just now",
          read: false,
        },
        ...prev,
      ]);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting problem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusCheck = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual API
      setTimeout(() => {
        const mockStatusData = {
          trackingId: trackingId,
          status: "In Progress",
          department: "Revenue & Disaster Management",
          submittedDate: new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
          updates: [
            {
              date: new Date().toISOString(),
              message: "Complaint received and logged",
            },
            {
              date: new Date().toISOString(),
              message: "Assigned to field officer for inspection",
            },
            {
              date: new Date().toISOString(),
              message: "Work in progress - estimated completion in 3 days",
            },
          ],
        };
        setStatusData(mockStatusData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error checking status:", error);
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "update":
        return "🔄";
      case "resolved":
        return "✅";
      case "success":
        return "🎉";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ADMINSIGHT
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Public Portal</span>
              <Link
                to="/login"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-4 sm:px-6 lg:px-8">
            {[
              { id: "report", name: "Report Problem", icon: "📝" },
              { id: "status", name: "Check Status", icon: "🔍" },
              { id: "notifications", name: "Notifications", icon: "🔔" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                {tab.id === "notifications" &&
                  notifications.filter((n) => !n.read).length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Report Problem Tab */}
        {activeTab === "report" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Report a <span className="text-blue-600">Problem</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Help us serve you better by reporting issues in your community.
                We're committed to resolving problems efficiently.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  value: "85%",
                  label: "Problems Resolved",
                  icon: "✅",
                  color: "green",
                },
                {
                  value: "2.4h",
                  label: "Avg Response Time",
                  icon: "⚡",
                  color: "blue",
                },
                {
                  value: "10+",
                  label: "Departments",
                  icon: "🏢",
                  color: "purple",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border text-center"
                >
                  <div
                    className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Problem Form */}
            <div className="bg-white rounded-2xl shadow-lg border">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white">
                  Problem Report Form
                </h2>
                <p className="text-blue-100">
                  Fill in the details below to report your issue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          Problem reported successfully!
                        </p>
                        <p className="text-green-600 text-sm">
                          Tracking ID: <strong>{trackingId}</strong> - Save this
                          for status checking
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        name="department"
                        required
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Problem Title *
                      </label>
                      <input
                        type="text"
                        name="problemTitle"
                        required
                        value={formData.problemTitle}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the problem"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Where is the problem located?"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Please provide a detailed description of the problem..."
                  />
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        department: "Revenue & Disaster Management",
                        problemTitle: "",
                        description: "",
                        location: "",
                      })
                    }
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>📨</span>
                        <span>Submit Problem</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Check Status Tab */}
        {activeTab === "status" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Check Complaint <span className="text-blue-600">Status</span>
              </h1>
              <p className="text-xl text-gray-600">
                Enter your tracking ID to check the current status of your
                complaint
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <form onSubmit={handleStatusCheck} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Tracking ID
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., TRK123456789"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !trackingId.trim()}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                >
                  {loading ? "Checking Status..." : "Check Status"}
                </button>
              </form>

              {statusData && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Status for: {statusData.trackingId}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        statusData.status
                      )}`}
                    >
                      {statusData.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{statusData.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium">
                        {new Date(statusData.lastUpdate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Updates</h4>
                    <div className="space-y-3">
                      {statusData.updates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm">{update.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(update.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your <span className="text-blue-600">Notifications</span>
              </h1>
              <p className="text-xl text-gray-600">
                Stay updated on your complaints and important announcements
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Recent Notifications
                  </h2>
                  <span className="text-sm text-gray-500">
                    {notifications.filter((n) => !n.read).length} unread
                  </span>
                </div>
              </div>

              <div className="divide-y">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`${
                              !notification.read
                                ? "font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPortal;
