import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectorLayout from '../../layouts/CollectorLayout';

const CollectorUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'cash',
    receiptNumber: '',
    notes: ''
  });
  const [interactionForm, setInteractionForm] = useState({
    type: 'call',
    notes: '',
    followupDate: '',
    priority: 'medium'
  });
  const navigate = useNavigate();

  // Mock collector ID (from auth context)
  const collectorId = 'collector_001';

  useEffect(() => {
    fetchAssignedCustomers();
  }, []);

  const fetchAssignedCustomers = async () => {
    setLoading(true);
    try {
      // Mock customers assigned to this collector only
      const mockCustomers = [
        {
          id: 'C001',
          name: 'John Doe',
          accountNumber: 'ACC123456',
          address: '123 Main St, District A',
          contactNumber: '+1-555-0101',
          email: 'john.doe@email.com',
          status: 'active',
          balance: 1250.75,
          lastPaymentDate: '2024-01-10',
          lastPaymentAmount: 500.00,
          totalCollected: 3500.00,
          overdueDays: 0,
          priority: 'medium',
          notes: 'Regular payer, always on time. Prefers evening visits.',
          assignedTo: collectorId,
          createdAt: '2023-06-15',
          updatedAt: '2024-01-15',
          interactions: [
            {
              id: 'INT001',
              type: 'visit',
              notes: 'Visited for monthly collection. Payment received.',
              date: '2024-01-10',
              collectorId: collectorId
            },
            {
              id: 'INT002',
              type: 'call',
              notes: 'Called to confirm next payment date.',
              date: '2024-01-05',
              collectorId: collectorId
            }
          ]
        },
        {
          id: 'C002',
          name: 'Jane Smith',
          accountNumber: 'ACC123457',
          address: '456 Oak Ave, District A',
          contactNumber: '+1-555-0102',
          email: 'jane.smith@email.com',
          status: 'active',
          balance: 3200.50,
          lastPaymentDate: '2024-01-05',
          lastPaymentAmount: 800.00,
          totalCollected: 5200.00,
          overdueDays: 15,
          priority: 'high',
          notes: 'Overdue payment, needs follow-up. Works night shifts.',
          assignedTo: collectorId,
          createdAt: '2023-07-20',
          updatedAt: '2024-01-15',
          interactions: [
            {
              id: 'INT003',
              type: 'visit',
              notes: 'Overdue payment discussion. Agreed to pay in 2 installments.',
              date: '2024-01-14',
              collectorId: collectorId
            }
          ]
        },
        {
          id: 'C003',
          name: 'Bob Johnson',
          accountNumber: 'ACC123458',
          address: '789 Pine Rd, District A',
          contactNumber: '+1-555-0103',
          email: 'bob.johnson@email.com',
          status: 'active',
          balance: 850.25,
          lastPaymentDate: '2024-01-12',
          lastPaymentAmount: 200.00,
          totalCollected: 1850.25,
          overdueDays: 0,
          priority: 'low',
          notes: 'New customer, first payment completed. Friendly.',
          assignedTo: collectorId,
          createdAt: '2023-12-01',
          updatedAt: '2024-01-15',
          interactions: [
            {
              id: 'INT004',
              type: 'registration',
              notes: 'New customer registration completed.',
              date: '2023-12-01',
              collectorId: collectorId
            }
          ]
        },
        {
          id: 'C005',
          name: 'Mike Brown',
          accountNumber: 'ACC123460',
          address: '654 Maple Ln, District A',
          contactNumber: '+1-555-0105',
          email: 'mike.brown@email.com',
          status: 'active',
          balance: 4500.00,
          lastPaymentDate: '2023-12-20',
          lastPaymentAmount: 500.00,
          totalCollected: 7500.00,
          overdueDays: 25,
          priority: 'high',
          notes: 'Large overdue amount, legal action pending. Avoid afternoon visits.',
          assignedTo: collectorId,
          createdAt: '2023-03-15',
          updatedAt: '2024-01-15',
          interactions: [
            {
              id: 'INT005',
              type: 'call',
              notes: 'Legal notice sent. No response.',
              date: '2024-01-10',
              collectorId: collectorId
            }
          ]
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to load customers. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    // Filter by status
    if (filter === 'overdue' && customer.overdueDays === 0) return false;
    if (filter === 'active' && customer.status !== 'active') return false;
    if (filter === 'inactive' && customer.status !== 'inactive') return false;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.accountNumber.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.contactNumber.includes(term)
      );
    }
    
    return true;
  });

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const openPaymentForm = (customer) => {
    setSelectedCustomer(customer);
    setPaymentForm({
      amount: customer.balance > 0 ? Math.min(500, customer.balance).toString() : '',
      method: 'cash',
      receiptNumber: `RCPT${Date.now().toString().slice(-6)}`,
      notes: `Payment for ${customer.name} - ${customer.accountNumber}`
    });
    setShowPaymentForm(true);
  };

  const openInteractionForm = (customer) => {
    setSelectedCustomer(customer);
    setInteractionForm({
      type: 'call',
      notes: '',
      followupDate: '',
      priority: 'medium'
    });
    setShowInteractionForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update customer balance
      const updatedCustomers = customers.map(c => {
        if (c.id === selectedCustomer.id) {
          const paymentAmount = parseFloat(paymentForm.amount);
          return {
            ...c,
            balance: Math.max(0, c.balance - paymentAmount),
            lastPaymentDate: new Date().toISOString().split('T')[0],
            lastPaymentAmount: paymentAmount,
            totalCollected: c.totalCollected + paymentAmount,
            overdueDays: (c.balance - paymentAmount) <= 0 ? 0 : c.overdueDays,
            updatedAt: new Date().toISOString().split('T')[0],
            interactions: [
              ...c.interactions,
              {
                id: `INT${Date.now()}`,
                type: 'payment',
                notes: `Payment received: $${paymentForm.amount} via ${paymentForm.method}. Receipt: ${paymentForm.receiptNumber}`,
                date: new Date().toISOString().split('T')[0],
                collectorId: collectorId
              }
            ]
          };
        }
        return c;
      });

      setCustomers(updatedCustomers);
      
      // Reset form
      setPaymentForm({
        amount: '',
        method: 'cash',
        receiptNumber: '',
        notes: ''
      });
      
      setShowPaymentForm(false);
      setSelectedCustomer(null);
      
      alert(`Payment of $${paymentForm.amount} recorded for ${selectedCustomer.name}!`);
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment');
    }
  };

  const handleInteractionSubmit = async (e) => {
    e.preventDefault();
    if (!interactionForm.notes) {
      alert('Please enter interaction notes');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCustomers = customers.map(c => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            updatedAt: new Date().toISOString().split('T')[0],
            interactions: [
              ...c.interactions,
              {
                id: `INT${Date.now()}`,
                type: interactionForm.type,
                notes: interactionForm.notes,
                date: new Date().toISOString().split('T')[0],
                collectorId: collectorId,
                followupDate: interactionForm.followupDate || null,
                priority: interactionForm.priority
              }
            ]
          };
        }
        return c;
      });

      setCustomers(updatedCustomers);
      
      // Reset form
      setInteractionForm({
        type: 'call',
        notes: '',
        followupDate: '',
        priority: 'medium'
      });
      
      setShowInteractionForm(false);
      setSelectedCustomer(null);
      
      alert('Interaction recorded successfully!');
    } catch (error) {
      console.error('Error recording interaction:', error);
      alert('Failed to record interaction');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverdueColor = (days) => {
    if (days === 0) return 'bg-green-100 text-green-800';
    if (days <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTotalBalance = () => {
    return customers.reduce((sum, customer) => sum + customer.balance, 0);
  };

  const getTotalCollected = () => {
    return customers.reduce((sum, customer) => sum + customer.totalCollected, 0);
  };

  return (
    <CollectorLayout 
      title="My Customers" 
      description="Manage your assigned customers and collection records"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer Overview</h2>
                <p className="text-gray-600 text-sm mt-1">Your assigned customers and collection status</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
                  <div className="text-xs text-gray-600">Total Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalCollected())}</div>
                  <div className="text-xs text-gray-600">Total Collected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(getTotalBalance())}</div>
                  <div className="text-xs text-gray-600">Pending Balance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="all">All Customers</option>
                  <option value="active">Active</option>
                  <option value="overdue">Overdue</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, account number, phone..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchAssignedCustomers}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading your customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="col-span-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customers Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No customers found matching "${searchTerm}"`
                  : 'No customers assigned to you yet.'
                }
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <div key={customer.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Customer Header */}
                <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{customer.accountNumber}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(customer.priority)}`}>
                      {customer.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Account Balance</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.balance)}</p>
                      {customer.overdueDays > 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          ⚠️ {customer.overdueDays} days overdue
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Last Payment</p>
                        <p className="font-medium text-gray-900">{formatCurrency(customer.lastPaymentAmount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(customer.lastPaymentDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Collected</p>
                        <p className="font-medium text-green-600">{formatCurrency(customer.totalCollected)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">{customer.contactNumber}</p>
                      <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{customer.address}</p>
                    </div>

                    {customer.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="text-sm text-gray-800 italic">"{customer.notes}"</p>
                      </div>
                    )}

                    {/* Recent Interactions */}
                    {customer.interactions && customer.interactions.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recent Activity</p>
                        <div className="space-y-2">
                          {customer.interactions.slice(0, 2).map(interaction => (
                            <div key={interaction.id} className="flex items-start space-x-2 text-sm">
                              <span className="text-gray-400 mt-0.5">
                                {interaction.type === 'call' ? '📞' :
                                 interaction.type === 'visit' ? '📍' :
                                 interaction.type === 'payment' ? '💰' : '📝'}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-700">{interaction.notes}</p>
                                <p className="text-xs text-gray-500">{formatDate(interaction.date)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => viewCustomerDetails(customer)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>👁️</span>
                      <span>Details</span>
                    </button>
                    <button 
                      onClick={() => openPaymentForm(customer)}
                      className="bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>💰</span>
                      <span>Record Payment</span>
                    </button>
                    <button 
                      onClick={() => openInteractionForm(customer)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>📝</span>
                      <span>Add Note</span>
                    </button>
                    <button 
                      onClick={() => navigate(`/collector/tasks?customer=${customer.id}`)}
                      className="bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>✅</span>
                      <span>Create Task</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Access Restrictions Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-yellow-800">Customer Access Restrictions</h4>
              <p className="text-yellow-700 mt-1">
                As a Collector, you can only access customers assigned to you.
              </p>
              <div className="mt-3 text-sm text-yellow-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can view complete profiles of assigned customers</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can update contact details and payment arrangements</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can record customer interactions and payment history</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can create follow-up entries and payment promises</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot access credit score/background check details</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot view full financial statements</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot search system-wide customer database</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot delete customer records or modify core accounts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">Customer Details - {selectedCustomer.accountNumber}</p>
                </div>
                <button 
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-mono font-medium text-gray-900">{selectedCustomer.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact Number</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{selectedCustomer.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}>
                          {selectedCustomer.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Balance</span>
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(selectedCustomer.balance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Collected</span>
                        <span className="text-lg font-semibold text-green-600">{formatCurrency(selectedCustomer.totalCollected)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Payment</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(selectedCustomer.lastPaymentAmount)} on {formatDate(selectedCustomer.lastPaymentDate)}
                        </span>
                      </div>
                      {selectedCustomer.overdueDays > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Overdue Days</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOverdueColor(selectedCustomer.overdueDays)}`}>
                            {selectedCustomer.overdueDays} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Interactions & Notes */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Interaction History</h4>
                    {selectedCustomer.interactions && selectedCustomer.interactions.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {selectedCustomer.interactions.map(interaction => (
                          <div key={interaction.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">
                                  {interaction.type === 'call' ? '📞 Call' :
                                   interaction.type === 'visit' ? '📍 Visit' :
                                   interaction.type === 'payment' ? '💰 Payment' : '📝 Note'}
                                </span>
                                <span className="text-xs text-gray-500">{formatDate(interaction.date)}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{interaction.notes}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No interactions recorded yet.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Notes</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedCustomer.notes || 'No additional notes.'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setShowCustomerDetails(false);
                          openPaymentForm(selectedCustomer);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Record Payment
                      </button>
                      <button 
                        onClick={() => {
                          setShowCustomerDetails(false);
                          openInteractionForm(selectedCustomer);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Add Interaction
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedCustomer.name} - {selectedCustomer.accountNumber}</p>
                </div>
                <button 
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedCustomer.balance}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current balance: {formatCurrency(selectedCustomer.balance)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={paymentForm.receiptNumber}
                  onChange={(e) => setPaymentForm({...paymentForm, receiptNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter receipt number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Additional notes about this payment..."
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Record Payment
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interaction Form Modal */}
      {showInteractionForm && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Record Interaction</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedCustomer.name} - {selectedCustomer.accountNumber}</p>
                </div>
                <button 
                  onClick={() => setShowInteractionForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleInteractionSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interaction Type
                </label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm({...interactionForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="call">📞 Phone Call</option>
                  <option value="visit">📍 Site Visit</option>
                  <option value="email">📧 Email</option>
                  <option value="meeting">🤝 Meeting</option>
                  <option value="followup">🔄 Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes *
                </label>
                <textarea
                  value={interactionForm.notes}
                  onChange={(e) => setInteractionForm({...interactionForm, notes: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Describe the interaction..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={interactionForm.followupDate}
                    onChange={(e) => setInteractionForm({...interactionForm, followupDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={interactionForm.priority}
                    onChange={(e) => setInteractionForm({...interactionForm, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Save Interaction
                </button>
                <button 
                  type="button"
                  onClick={() => setShowInteractionForm(false)}
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

export default CollectorUsers;