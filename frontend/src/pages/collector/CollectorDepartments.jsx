import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectorLayout from '../../layouts/CollectorLayout';

const CollectorDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [requestForm, setRequestForm] = useState({
    department: '',
    type: '',
    subject: '',
    description: '',
    priority: 'Medium',
    attachment: null,
    customerId: '' // NEW: Added customer reference
  });
  const navigate = useNavigate();

  // Mock collector ID (from auth context)
  const collectorId = 'collector_001';
  
  // Mock customer data (replaces broken import)
  const [customers, setCustomers] = useState([
    { id: 'C001', name: 'John Doe', accountNumber: 'ACC123456' },
    { id: 'C002', name: 'Jane Smith', accountNumber: 'ACC123457' },
    { id: 'C003', name: 'Bob Johnson', accountNumber: 'ACC123458' },
    { id: 'C004', name: 'Alice Williams', accountNumber: 'ACC123459' }
  ]);

  // Request types for each department
  const requestTypes = {
    'Legal Department': ['Escalation Request', 'Legal Consultation', 'Document Review'],
    'Accounts Department': ['Payment Verification', 'Receipt Generation', 'Account Inquiry'],
    'Support Department': ['Technical Issue', 'Device Problem', 'System Access']
  };

  // Department descriptions
  const departmentDescriptions = {
    'Legal Department': 'Legal escalations and document processing for customer cases',
    'Accounts Department': 'Payment verification and receipt generation services',
    'Support Department': 'Technical support and device maintenance'
  };

  useEffect(() => {
    fetchData();
    fetchMyRequests();
    fetchCollectorCustomers();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock departments data
      const mockDepartments = [
        {
          id: 1,
          name: 'Legal Department',
          description: 'Legal escalations and document processing',
          contactEmail: 'legal@district.gov',
          contactPhone: '+1-555-0101',
          allowedForCollector: true,
          requestTypes: ['Escalation Request', 'Legal Consultation', 'Document Review'],
          avgResponseTime: '2-3 business days',
          workingHours: '9 AM - 5 PM'
        },
        {
          id: 2,
          name: 'Accounts Department',
          description: 'Payment verification and receipt generation',
          contactEmail: 'accounts@district.gov',
          contactPhone: '+1-555-0102',
          allowedForCollector: true,
          requestTypes: ['Payment Verification', 'Receipt Generation', 'Account Inquiry'],
          avgResponseTime: '1-2 business days',
          workingHours: '9 AM - 5 PM'
        },
        {
          id: 3,
          name: 'Support Department',
          description: 'Technical support and device issues',
          contactEmail: 'support@district.gov',
          contactPhone: '+1-555-0103',
          allowedForCollector: true,
          requestTypes: ['Technical Issue', 'Device Problem', 'System Access'],
          avgResponseTime: '24 hours',
          workingHours: '8 AM - 6 PM'
        },
        {
          id: 4,
          name: 'Administration',
          description: 'Internal administration and HR',
          contactEmail: 'admin@district.gov',
          contactPhone: '+1-555-0104',
          allowedForCollector: false,
          requestTypes: [],
          avgResponseTime: 'N/A',
          workingHours: 'N/A'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter departments to show only those collector can interact with
      const collectorDepartments = mockDepartments.filter(dept => dept.allowedForCollector);
      setDepartments(collectorDepartments);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load departments. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      // Mock data for collector's requests
      const mockRequests = [
        {
          id: 'REQ001',
          department: 'Legal Department',
          type: 'Escalation Request',
          subject: 'Customer legal escalation - John Doe (ACC123456)',
          description: 'Customer requires legal consultation for payment dispute of $1,250.75',
          priority: 'High',
          status: 'Pending',
          submittedDate: '2024-01-15',
          lastUpdate: '2024-01-15',
          assignedTo: 'John Smith',
          collectorId: collectorId,
          referenceNumber: 'LEG-2024-001',
          attachment: 'legal_doc.pdf',
          customerId: 'C001',
          customerName: 'John Doe'
        },
        {
          id: 'REQ002',
          department: 'Accounts Department',
          type: 'Payment Verification',
          subject: 'Verify payment from Jane Smith (ACC123457)',
          description: 'Need confirmation of $800 payment received on Jan 10, 2024 for account ACC123457',
          priority: 'Medium',
          status: 'In Progress',
          submittedDate: '2024-01-12',
          lastUpdate: '2024-01-14',
          assignedTo: 'Sarah Johnson',
          collectorId: collectorId,
          referenceNumber: 'ACC-2024-002',
          attachment: 'payment_slip.jpg',
          customerId: 'C002',
          customerName: 'Jane Smith'
        },
        {
          id: 'REQ003',
          department: 'Support Department',
          type: 'Device Problem',
          subject: 'Mobile collection device not working',
          description: 'Device screen is unresponsive during field visits. Affecting collection efficiency.',
          priority: 'High',
          status: 'Resolved',
          submittedDate: '2024-01-05',
          lastUpdate: '2024-01-08',
          assignedTo: 'Mike Williams',
          collectorId: collectorId,
          referenceNumber: 'SUP-2024-003',
          attachment: 'device_photo.jpg',
          resolution: 'Device replaced with new unit'
        }
      ];
      
      setMyRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchCollectorCustomers = async () => {
    try {
      // Mock API call to get collector's assigned customers
      const mockCustomers = [
        { 
          id: 'C001', 
          name: 'John Doe', 
          accountNumber: 'ACC123456',
          balance: 1250.75,
          status: 'active'
        },
        { 
          id: 'C002', 
          name: 'Jane Smith', 
          accountNumber: 'ACC123457',
          balance: 3200.50,
          status: 'active',
          overdueDays: 15
        },
        { 
          id: 'C003', 
          name: 'Bob Johnson', 
          accountNumber: 'ACC123458',
          balance: 850.25,
          status: 'active'
        },
        { 
          id: 'C004', 
          name: 'Alice Williams', 
          accountNumber: 'ACC123459',
          balance: 0.00,
          status: 'inactive'
        }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate form
      if (!requestForm.department || !requestForm.type || !requestForm.subject || !requestForm.description) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get customer info if customer selected
      const selectedCustomer = requestForm.customerId ? 
        customers.find(c => c.id === requestForm.customerId) : null;
      
      const newRequest = {
        id: `REQ${String(myRequests.length + 1).padStart(3, '0')}`,
        department: requestForm.department,
        type: requestForm.type,
        subject: requestForm.subject,
        description: requestForm.description,
        priority: requestForm.priority,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        assignedTo: 'To be assigned',
        collectorId: collectorId,
        referenceNumber: `${requestForm.department.substring(0, 3).toUpperCase()}-2024-${String(myRequests.length + 1).padStart(3, '0')}`,
        attachment: requestForm.attachment ? requestForm.attachment.name : null,
        customerId: requestForm.customerId || null,
        customerName: selectedCustomer ? selectedCustomer.name : null,
        accountNumber: selectedCustomer ? selectedCustomer.accountNumber : null
      };
      
      setMyRequests(prev => [newRequest, ...prev]);
      
      // Reset form
      setRequestForm({
        department: '',
        type: '',
        subject: '',
        description: '',
        priority: 'Medium',
        attachment: null,
        customerId: ''
      });
      
      setShowRequestForm(false);
      setSelectedDept(null);
      
      alert(`Request submitted to ${newRequest.department}!\nReference: ${newRequest.referenceNumber}`);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload PDF, JPEG, PNG, or Word documents only');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setRequestForm(prev => ({ ...prev, attachment: file }));
    }
  };

  const openRequestForm = (department) => {
    setSelectedDept(department);
    setRequestForm(prev => ({ 
      ...prev, 
      department: department.name,
      type: requestTypes[department.name]?.[0] || '',
      subject: department.name === 'Legal Department' ? 'Legal Escalation Request' :
               department.name === 'Accounts Department' ? 'Payment Verification Request' :
               department.name === 'Support Department' ? 'Technical Support Request' : ''
    }));
    setShowRequestForm(true);
  };

  const viewRequestDetails = (requestId) => {
    const request = myRequests.find(req => req.id === requestId);
    if (request) {
      const details = [
        `📋 Reference: ${request.referenceNumber}`,
        `🏢 Department: ${request.department}`,
        `📄 Type: ${request.type}`,
        `🚦 Status: ${request.status}`,
        `⚠️ Priority: ${request.priority}`,
        `📅 Submitted: ${request.submittedDate}`,
        `👤 Assigned To: ${request.assignedTo}`,
        request.customerName ? `👥 Customer: ${request.customerName} (${request.accountNumber})` : null,
        `📝 Description: ${request.description}`
      ].filter(Boolean).join('\n');
      
      alert(`Request Details:\n\n${details}`);
    }
  };

  const downloadAttachment = (requestId) => {
    const request = myRequests.find(req => req.id === requestId);
    if (request && request.attachment) {
      alert(`Downloading: ${request.attachment}\n\nNote: This is a demo. In a real app, this would download the file.`);
      // In real app: window.open(`/api/attachments/${request.attachment}`, '_blank');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return '⏳';
      case 'In Progress': return '🔄';
      case 'Resolved': return '✅';
      case 'Rejected': return '❌';
      default: return '📋';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  if (loading && departments.length === 0) {
    return (
      <CollectorLayout title="Department Requests" description="Loading departments...">
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
                <h2 className="text-xl font-bold text-gray-900">My Submitted Requests</h2>
                <p className="text-gray-600 text-sm mt-1">Track status of your department requests</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {myRequests.length} requests
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                  {myRequests.filter(r => r.status === 'Pending').length} pending
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Submitted</h3>
                <p className="text-gray-600 mb-4">Submit your first request to a department below</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map(request => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xl">
                            {request.department === 'Legal Department' ? '⚖️' :
                             request.department === 'Accounts Department' ? '💰' :
                             request.department === 'Support Department' ? '🔧' : '🏢'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)} {request.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                {getPriorityIcon(request.priority)} {request.priority} Priority
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
                        <p className="text-gray-600 text-sm line-clamp-2">{request.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>Ref: <span className="font-mono font-medium">{request.referenceNumber}</span></span>
                          <span>Submitted: {request.submittedDate}</span>
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
                          onClick={() => viewRequestDetails(request.id)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>👁️</span>
                          <span>View</span>
                        </button>
                        {request.attachment && (
                          <button 
                            onClick={() => downloadAttachment(request.id)}
                            className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <span>📥</span>
                            <span>Download</span>
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
            <h2 className="text-2xl font-bold text-gray-900">Available Departments</h2>
            <p className="text-gray-600 mt-1">Select a department to submit a request</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(dept => (
              <div key={dept.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                {/* Card Header */}
                <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">
                          {dept.name === 'Legal Department' ? '⚖️' :
                           dept.name === 'Accounts Department' ? '💰' :
                           dept.name === 'Support Department' ? '🔧' : '🏢'}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{dept.description}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Available
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
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

                {/* Request Types */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Available Request Types</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {requestTypes[dept.name]?.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
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

          {/* Restricted Departments Notice */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-yellow-800">Access Restrictions</h4>
                <p className="text-yellow-700 mt-1">
                  As a Collector, you can only interact with Legal, Accounts, and Support departments.
                </p>
                <div className="mt-3 text-sm text-yellow-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Can submit requests to authorized departments</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Can view status of own submitted requests</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Can upload documents for department review</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Can reference customers in requests</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">❌</span>
                    <span>Cannot view other collectors' requests</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">❌</span>
                    <span>Cannot access department internal tools</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">❌</span>
                    <span>Cannot bypass approval workflows</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">❌</span>
                    <span>Cannot directly contact departments outside system</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Submit Department Request</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Submit request to {selectedDept?.name} department
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowRequestForm(false);
                    setSelectedDept(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
              {/* Department Selection (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={requestForm.department}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                />
              </div>

              {/* Customer Selection (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Customer (Optional)
                </label>
                <select
                  value={requestForm.customerId}
                  onChange={(e) => setRequestForm({...requestForm, customerId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">Select a customer (optional)</option>
                  {customers.filter(c => c.status === 'active').map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.accountNumber} (${customer.balance})
                    </option>
                  ))}
                </select>
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type *
                </label>
                <select
                  value={requestForm.type}
                  onChange={(e) => setRequestForm({...requestForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  required
                >
                  <option value="">Select request type</option>
                  {requestTypes[requestForm.department]?.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={requestForm.subject}
                  onChange={(e) => setRequestForm({...requestForm, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Brief description of your request"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex space-x-4">
                  {['Low', 'Medium', 'High'].map(priority => (
                    <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={requestForm.priority === priority}
                        onChange={(e) => setRequestForm({...requestForm, priority: e.target.value})}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder={`Provide detailed information about your request...\n\nFor example: ${requestForm.department === 'Legal Department' ? 'Describe the legal issue, customer details, and required documentation.' : requestForm.department === 'Accounts Department' ? 'Provide payment details, amounts, dates, and transaction references.' : 'Describe the technical issue, error messages, and when it occurs.'}`}
                  required
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Document (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    {requestForm.attachment ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-sm font-medium">{requestForm.attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {(requestForm.attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button 
                          type="button"
                          onClick={() => setRequestForm(prev => ({ ...prev, attachment: null }))}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-3xl">📎</span>
                        <p className="text-sm text-gray-600">Click to upload supporting documents</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span>📤</span>
                  )}
                  <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    setSelectedDept(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
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