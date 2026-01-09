import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CollectorLayout from "../../layouts/CollectorLayout";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const CollectorDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [requestForm, setRequestForm] = useState({
    department: "",
    type: "",
    subject: "",
    description: "",
    priority: "Medium",
    attachment: null,
    customerId: "",
  });

  const navigate = useNavigate();
  // const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Get collector ID from localStorage or auth context
  const getCollectorId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id || user?.id || "collector_001"; // Fallback
  };

  // Request types for each department (could also fetch from API)
  const requestTypes = {
    "Legal Department": [
      "Escalation Request",
      "Legal Consultation",
      "Document Review",
    ],
    "Accounts Department": [
      "Payment Verification",
      "Receipt Generation",
      "Account Inquiry",
    ],
    "Support Department": [
      "Technical Issue",
      "Device Problem",
      "System Access",
    ],
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments from backend
  // ✅ FIXED departments fetch
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();

      // ✅ BACKEND sends departments inside result.data
      setDepartments(result.data || []);
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
      alert("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  // Generate and download PDF (kept as is, works with real data)
  const generateAndDownloadPDF = (request) => {
    try {
      const doc = new jsPDF();
      doc.setProperties({
        title: `Request_${request.referenceNumber}`,
        subject: request.subject,
        author: "District Collector Portal",
        keywords: "request, department, collector",
        creator: "ADMINSIGHT Platform",
      });

      doc.setFontSize(20);
      doc.setTextColor(40, 53, 147);
      doc.text("ADMINSIGHT", 105, 20, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Department Request Details", 105, 30, { align: "center" });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        20,
        45
      );
      doc.text(`Reference: ${request.referenceNumber || request._id}`, 20, 50);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let yPosition = 60;

      const addDetail = (label, value) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, 20, yPosition);
        doc.setFont(undefined, "normal");

        const valueLines = doc.splitTextToSize(value.toString(), 120);
        if (valueLines.length === 1) {
          doc.text(value, 80, yPosition);
          yPosition += 10;
        } else {
          doc.text(valueLines[0], 80, yPosition);
          yPosition += 7;
          for (let i = 1; i < valueLines.length; i++) {
            doc.text(valueLines[i], 80, yPosition);
            yPosition += 7;
          }
          yPosition += 3;
        }
      };

      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147);
      doc.text("Request Information:", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      addDetail("Reference Number", request.referenceNumber || request._id);
      addDetail("Department", request.department);
      addDetail("Request Type", request.type);
      addDetail("Subject", request.subject);
      addDetail("Priority", request.priority);
      addDetail("Status", request.status);
      addDetail(
        "Submitted Date",
        new Date(
          request.createdAt || request.submittedDate
        ).toLocaleDateString()
      );
      addDetail(
        "Last Updated",
        new Date(request.updatedAt || request.lastUpdate).toLocaleDateString()
      );
      addDetail("Assigned To", request.assignedTo || "To be assigned");
      addDetail("Collector ID", getCollectorId());

      if (request.customerName) {
        addDetail("Customer Name", request.customerName);
      }

      if (request.accountNumber) {
        addDetail("Account Number", request.accountNumber);
      }

      if (request.resolution) {
        addDetail("Resolution", request.resolution);
      }

      yPosition += 5;
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147);
      doc.text("Description:", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const descriptionLines = doc.splitTextToSize(request.description, 170);
      descriptionLines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });

      if (request.attachment) {
        yPosition += 10;
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(40, 53, 147);
        doc.text("Attachments:", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${request.attachment}`, 20, yPosition);
        yPosition += 10;
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });

        if (i === pageCount) {
          doc.text(
            "This is an official document generated by ADMINSIGHT District Collector Portal.",
            105,
            290,
            { align: "center" }
          );
          doc.text("Confidential - For authorized personnel only.", 105, 295, {
            align: "center",
          });
        }
      }

      doc.save(`Request_${request.referenceNumber || request._id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again or contact support.");
    }
  };

  // Download attachment from backend
  const downloadAttachment = async (requestId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/requests/${requestId}/attachment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attachment_${requestId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      alert("Failed to download attachment. Please try again.");
    }
  };

  // View request details
  const viewRequestDetails = (requestId) => {
    const request = myRequests.find(
      (req) => req._id === requestId || req.id === requestId
    );
    if (request) {
      const details = [
        `📋 Reference: ${request.referenceNumber || request._id}`,
        `🏢 Department: ${request.department}`,
        `📄 Type: ${request.type}`,
        `🚦 Status: ${request.status}`,
        `⚠️ Priority: ${request.priority}`,
        `📅 Submitted: ${new Date(request.createdAt).toLocaleDateString()}`,
        `👤 Assigned To: ${request.assignedTo || "To be assigned"}`,
        request.customerName
          ? `👥 Customer: ${request.customerName} (${
              request.accountNumber || ""
            })`
          : null,
        `📝 Description: ${request.description}`,
        request.resolution ? `✅ Resolution: ${request.resolution}` : null,
      ].filter(Boolean);

      const userChoice = window.confirm(
        `Request Details:\n\n${details.join(
          "\n"
        )}\n\nWould you like to download a PDF version?`
      );

      if (userChoice) {
        generateAndDownloadPDF(request);
      }
    }
  };

  // Direct PDF download
  const handleDirectPDFDownload = (requestId, event) => {
    event.stopPropagation();
    const request = myRequests.find(
      (req) => req._id === requestId || req.id === requestId
    );
    if (request) {
      generateAndDownloadPDF(request);
    }
  };

  // Submit new request to backend
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        !requestForm.department ||
        !requestForm.type ||
        !requestForm.subject ||
        !requestForm.description
      ) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const selectedCustomer = requestForm.customerId
        ? customers.find(
            (c) =>
              c._id === requestForm.customerId ||
              c.id === requestForm.customerId
          )
        : null;

      const formData = new FormData();
      formData.append("department", requestForm.department);
      formData.append("type", requestForm.type);
      formData.append("subject", requestForm.subject);
      formData.append("description", requestForm.description);
      formData.append("priority", requestForm.priority);
      formData.append("collectorId", getCollectorId());

      if (requestForm.customerId) {
        formData.append("customerId", requestForm.customerId);
      }

      if (requestForm.attachment) {
        formData.append("attachment", requestForm.attachment);
      }

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newRequest = await response.json();

      setMyRequests((prev) => [newRequest, ...prev]);
      setRequestForm({
        department: "",
        type: "",
        subject: "",
        description: "",
        priority: "Medium",
        attachment: null,
        customerId: "",
      });

      setShowRequestForm(false);
      setSelectedDept(null);

      alert(
        `Request submitted to ${newRequest.department}!\nReference: ${
          newRequest.referenceNumber || newRequest._id
        }`
      );
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Please upload PDF, JPEG, PNG, or Word documents only");
        return;
      }

      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      setRequestForm((prev) => ({ ...prev, attachment: file }));
    }
  };

  const openRequestForm = (department) => {
    setSelectedDept(department);
    setRequestForm((prev) => ({
      ...prev,
      department: department.name,
      type: requestTypes[department.name]?.[0] || "",
      subject:
        department.name === "Legal Department"
          ? "Legal Escalation Request"
          : department.name === "Accounts Department"
          ? "Payment Verification Request"
          : department.name === "Support Department"
          ? "Technical Support Request"
          : "",
    }));
    setShowRequestForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "In Progress":
        return "🔄";
      case "Resolved":
        return "✅";
      case "Rejected":
        return "❌";
      default:
        return "📋";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  if (loading && departments.length === 0) {
    return (
      <CollectorLayout
        title="Department Requests"
        description="Loading departments..."
      >
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CollectorLayout>
    );
  }

  return (
    <CollectorLayout
      title="Department Requests"
      description="Submit requests to departments and track their status"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* My Requests Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  My Submitted Requests
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Track status of your department requests
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {myRequests.length} requests
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                  {myRequests.filter((r) => r.status === "Pending").length}{" "}
                  pending
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Requests Submitted
                </h3>
                <p className="text-gray-600 mb-4">
                  Submit your first request to a department below
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div
                    key={request._id || request.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xl">
                            {request.department === "Legal Department"
                              ? "⚖️"
                              : request.department === "Accounts Department"
                              ? "💰"
                              : request.department === "Support Department"
                              ? "🔧"
                              : "🏢"}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.subject}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  request.status
                                )}`}
                              >
                                {getStatusIcon(request.status)} {request.status}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  request.priority
                                )}`}
                              >
                                {getPriorityIcon(request.priority)}{" "}
                                {request.priority} Priority
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                {request.department}
                              </span>
                              {request.customerName && (
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                  👥 {request.customerName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {request.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>
                            Ref:{" "}
                            <span className="font-mono font-medium">
                              {request.referenceNumber ||
                                request._id?.slice(-8)}
                            </span>
                          </span>
                          <span>
                            Submitted:{" "}
                            {new Date(
                              request.createdAt || request.submittedDate
                            ).toLocaleDateString()}
                          </span>
                          {request.attachment && (
                            <span className="flex items-center space-x-1 text-green-600">
                              <span>📎</span>
                              <span>Has attachment</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            viewRequestDetails(request._id || request.id)
                          }
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>👁️</span>
                          <span>View</span>
                        </button>
                        <button
                          onClick={(e) =>
                            handleDirectPDFDownload(
                              request._id || request.id,
                              e
                            )
                          }
                          className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>📥</span>
                          <span>Download PDF</span>
                        </button>
                        {request.attachment && (
                          <button
                            onClick={() =>
                              downloadAttachment(request._id || request.id)
                            }
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <span>📎</span>
                            <span>Attachment</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Departments Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Departments
            </h2>
            <p className="text-gray-600 mt-1">
              Select a department to submit a request
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept._id || dept.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">
                          {dept.name === "Legal Department"
                            ? "⚖️"
                            : dept.name === "Accounts Department"
                            ? "💰"
                            : dept.name === "Support Department"
                            ? "🔧"
                            : "🏢"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {dept.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {dept.description}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Available
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b border-blue-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <span>📞</span>
                    <span>Contact Information</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-8">📧</span>
                      <span className="truncate">{dept.contactEmail}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-8">📱</span>
                      <span>{dept.contactPhone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-8">⏱️</span>
                      <span>{dept.workingHours}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-8">🔄</span>
                      <span>Avg response: {dept.avgResponseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Available Request Types</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {requestTypes[dept.name]?.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openRequestForm(dept)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>📤</span>
                    <span>Submit Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Submit New Request
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    To {requestForm.department}
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={requestForm.department}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type *
                  </label>
                  <select
                    value={requestForm.type}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    {requestTypes[requestForm.department]?.map(
                      (type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={requestForm.priority}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer (Optional)
                  </label>
                  <select
                    value={requestForm.customerId}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        customerId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option
                        key={customer._id || customer.id}
                        value={customer._id || customer.id}
                      >
                        {customer.name} ({customer.accountNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={requestForm.subject}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter request subject"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your request in detail..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                        <div className="text-gray-400 mb-2">
                          <span className="text-2xl">📎</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPEG, PNG, DOC up to 5MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                      </div>
                    </label>
                    {requestForm.attachment && (
                      <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm text-green-800">
                          {requestForm.attachment.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CollectorLayout>
  );
};

export default CollectorDepartments;
