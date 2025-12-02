// utils/collectorData.js
// Utility functions for Collector module data management

// Mock database for demonstration
const mockCollectorData = {
  collectorId: 'collector_001',
  name: 'District Collector',
  email: 'collector@admin.com',
  assignedArea: 'District A',
  assignedZone: 'Zone 1',
  
  // Customers assigned to this collector
  customers: [
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
      notes: 'Regular payer, always on time',
      assignedTo: 'collector_001',
      createdAt: '2023-06-15',
      updatedAt: '2024-01-15'
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
      notes: 'Overdue payment, needs follow-up',
      assignedTo: 'collector_001',
      createdAt: '2023-07-20',
      updatedAt: '2024-01-15'
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
      notes: 'New customer, first payment completed',
      assignedTo: 'collector_001',
      createdAt: '2023-12-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'C004',
      name: 'Alice Williams',
      accountNumber: 'ACC123459',
      address: '321 Elm St, District A',
      contactNumber: '+1-555-0104',
      email: 'alice.williams@email.com',
      status: 'inactive',
      balance: 0.00,
      lastPaymentDate: '2023-11-30',
      lastPaymentAmount: 1000.00,
      totalCollected: 10000.00,
      overdueDays: 0,
      priority: 'low',
      notes: 'Account cleared, moved to another district',
      assignedTo: 'collector_001',
      createdAt: '2023-01-10',
      updatedAt: '2023-12-01'
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
      notes: 'Large overdue amount, legal action pending',
      assignedTo: 'collector_001',
      createdAt: '2023-03-15',
      updatedAt: '2024-01-15'
    }
  ],
  
  // Tasks assigned to this collector
  tasks: [
    {
      id: 'TASK001',
      title: 'Daily Collection - Area A1',
      description: 'Collect payments from customers in Area A1',
      type: 'collection',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'collector_001',
      customerIds: ['C001', 'C002'],
      scheduledDate: '2024-01-16',
      scheduledTime: '10:00 AM',
      estimatedDuration: '2 hours',
      location: 'Area A1, District A',
      notes: 'Focus on overdue customers first',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 'TASK002',
      title: 'Follow-up Visits',
      description: 'Visit overdue customers for payment follow-up',
      type: 'followup',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'collector_001',
      customerIds: ['C002', 'C005'],
      scheduledDate: '2024-01-15',
      scheduledTime: '2:00 PM',
      estimatedDuration: '3 hours',
      location: 'Multiple locations in District A',
      notes: 'Prepare payment agreements for Mike Brown',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15'
    },
    {
      id: 'TASK003',
      title: 'Weekly Report Submission',
      description: 'Submit weekly collection report to supervisor',
      type: 'report',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'collector_001',
      customerIds: [],
      scheduledDate: '2024-01-12',
      scheduledTime: '4:00 PM',
      estimatedDuration: '1 hour',
      location: 'Office',
      notes: 'Include all collections from Jan 8-12',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: 'TASK004',
      title: 'New Customer Registration',
      description: 'Register new customers in Zone 1',
      type: 'registration',
      priority: 'low',
      status: 'pending',
      assignedTo: 'collector_001',
      customerIds: [],
      scheduledDate: '2024-01-17',
      scheduledTime: '9:00 AM',
      estimatedDuration: '4 hours',
      location: 'Zone 1, District A',
      notes: 'Bring registration forms and brochures',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    }
  ],
  
  // Collection metrics for the collector
  metrics: {
    collectionRate: 85.5,
    successPercentage: 92.3,
    dailyTarget: 5000,
    weeklyTarget: 25000,
    monthlyTarget: 100000,
    dailyAchieved: 4250,
    weeklyAchieved: 21500,
    monthlyAchieved: 85500,
    pendingTasks: 2,
    completedTasks: 1,
    totalCustomers: 5,
    activeCustomers: 4,
    overdueCustomers: 2,
    totalBalance: 9800.50,
    collectedThisMonth: 28500.75,
    assignedArea: 'District A, Zone 1',
    urgentAlerts: 3
  },
  
  // Recent activities
  activities: [
    {
      id: 'ACT001',
      type: 'collection',
      description: 'Collected $500 from John Doe (ACC123456)',
      amount: 500.00,
      customerId: 'C001',
      taskId: 'TASK001',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 'ACT002',
      type: 'visit',
      description: 'Visited Jane Smith for payment follow-up',
      amount: null,
      customerId: 'C002',
      taskId: 'TASK002',
      time: '4 hours ago',
      status: 'in_progress'
    },
    {
      id: 'ACT003',
      type: 'report',
      description: 'Submitted weekly collection report',
      amount: null,
      customerId: null,
      taskId: 'TASK003',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 'ACT004',
      type: 'collection',
      description: 'Collected $200 from Bob Johnson (ACC123458)',
      amount: 200.00,
      customerId: 'C003',
      taskId: null,
      time: '2 days ago',
      status: 'completed'
    }
  ],
  
  // Notification preferences
  notificationPreferences: {
    taskReminders: true,
    customerUpdates: true,
    departmentResponses: true,
    systemAlerts: true,
    paymentAlerts: true,
    overdueAlerts: true,
    emailNotifications: false,
    pushNotifications: true
  },
  
  // Route/Area data
  assignedRoute: {
    area: 'District A',
    zone: 'Zone 1',
    coordinates: [
      { lat: 12.9716, lng: 77.5946, label: 'Starting Point' },
      { lat: 12.9720, lng: 77.5950, label: 'Customer C001' },
      { lat: 12.9710, lng: 77.5930, label: 'Customer C002' },
      { lat: 12.9700, lng: 77.5920, label: 'Customer C003' },
      { lat: 12.9690, lng: 77.5910, label: 'Customer C005' },
      { lat: 12.9680, lng: 77.5900, label: 'Office' }
    ],
    totalDistance: '15 km',
    estimatedTime: '6 hours',
    customersInRoute: ['C001', 'C002', 'C003', 'C005']
  }
};

// Utility Functions

/**
 * Get all customers assigned to a collector
 * @param {string} collectorId - The collector's ID
 * @returns {Array} - Array of customer objects
 */
export const getCollectorAssignedCustomers = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customers = mockCollectorData.customers.filter(
        customer => customer.assignedTo === collectorId
      );
      resolve(customers);
    }, 300);
  });
};

/**
 * Get collector metrics
 * @param {string} collectorId - The collector's ID
 * @returns {Object} - Collector metrics object
 */
export const getCollectorMetrics = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockCollectorData.metrics });
    }, 200);
  });
};

/**
 * Get collector's tasks
 * @param {string} collectorId - The collector's ID
 * @param {string} status - Filter by status (optional)
 * @returns {Array} - Array of task objects
 */
export const getCollectorTasks = (collectorId = 'collector_001', status = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let tasks = mockCollectorData.tasks.filter(
        task => task.assignedTo === collectorId
      );
      
      if (status) {
        tasks = tasks.filter(task => task.status === status);
      }
      
      resolve(tasks);
    }, 300);
  });
};

/**
 * Get recent activities for collector
 * @param {string} collectorId - The collector's ID
 * @param {number} limit - Number of activities to return
 * @returns {Array} - Array of activity objects
 */
export const getCollectorActivities = (collectorId = 'collector_001', limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCollectorData.activities.slice(0, limit));
    }, 200);
  });
};

/**
 * Get assigned route/area data
 * @param {string} collectorId - The collector's ID
 * @returns {Object} - Route/area information
 */
export const getCollectorRoute = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockCollectorData.assignedRoute });
    }, 200);
  });
};

/**
 * Get notification preferences
 * @param {string} collectorId - The collector's ID
 * @returns {Object} - Notification preferences
 */
export const getNotificationPreferences = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockCollectorData.notificationPreferences });
    }, 200);
  });
};

/**
 * Update notification preferences
 * @param {string} collectorId - The collector's ID
 * @param {Object} preferences - New preferences
 * @returns {Object} - Updated preferences
 */
export const updateNotificationPreferences = (collectorId = 'collector_001', preferences) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update in mock data
      mockCollectorData.notificationPreferences = {
        ...mockCollectorData.notificationPreferences,
        ...preferences
      };
      resolve(mockCollectorData.notificationPreferences);
    }, 300);
  });
};

/**
 * Get customer by ID
 * @param {string} customerId - Customer ID
 * @returns {Object} - Customer object
 */
export const getCustomerById = (customerId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = mockCollectorData.customers.find(c => c.id === customerId);
      if (customer) {
        resolve(customer);
      } else {
        reject(new Error('Customer not found'));
      }
    }, 200);
  });
};

/**
 * Search customers by name, account number, or address
 * @param {string} query - Search query
 * @param {string} collectorId - Collector ID
 * @returns {Array} - Array of matching customers
 */
export const searchCustomers = (query, collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = mockCollectorData.customers.filter(customer => 
        customer.assignedTo === collectorId && (
          customer.name.toLowerCase().includes(lowerQuery) ||
          customer.accountNumber.toLowerCase().includes(lowerQuery) ||
          customer.address.toLowerCase().includes(lowerQuery) ||
          customer.email.toLowerCase().includes(lowerQuery)
        )
      );
      resolve(results);
    }, 300);
  });
};

/**
 * Update customer information
 * @param {string} customerId - Customer ID
 * @param {Object} updates - Updated customer data
 * @returns {Object} - Updated customer object
 */
export const updateCustomer = (customerId, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customerIndex = mockCollectorData.customers.findIndex(c => c.id === customerId);
      if (customerIndex !== -1) {
        mockCollectorData.customers[customerIndex] = {
          ...mockCollectorData.customers[customerIndex],
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        resolve(mockCollectorData.customers[customerIndex]);
      } else {
        reject(new Error('Customer not found'));
      }
    }, 400);
  });
};

/**
 * Add customer interaction log
 * @param {string} customerId - Customer ID
 * @param {Object} interaction - Interaction data
 * @returns {Object} - Added interaction
 */
export const addCustomerInteraction = (customerId, interaction) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = mockCollectorData.customers.find(c => c.id === customerId);
      if (customer) {
        // In a real app, this would add to a separate interactions array
        // For now, update the customer notes
        const updatedNotes = customer.notes 
          ? `${customer.notes}\n${new Date().toLocaleDateString()}: ${interaction.type} - ${interaction.notes}`
          : `${new Date().toLocaleDateString()}: ${interaction.type} - ${interaction.notes}`;
        
        mockCollectorData.customers = mockCollectorData.customers.map(c => 
          c.id === customerId 
            ? { ...c, notes: updatedNotes, updatedAt: new Date().toISOString().split('T')[0] }
            : c
        );
        
        resolve({ success: true, message: 'Interaction logged' });
      } else {
        reject(new Error('Customer not found'));
      }
    }, 300);
  });
};

/**
 * Record a payment
 * @param {string} customerId - Customer ID
 * @param {Object} payment - Payment data
 * @returns {Object} - Updated customer object
 */
export const recordPayment = (customerId, payment) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = mockCollectorData.customers.find(c => c.id === customerId);
      if (customer) {
        const newBalance = Math.max(0, customer.balance - payment.amount);
        
        // Update customer
        mockCollectorData.customers = mockCollectorData.customers.map(c => 
          c.id === customerId 
            ? { 
                ...c, 
                balance: newBalance,
                lastPaymentDate: new Date().toISOString().split('T')[0],
                lastPaymentAmount: payment.amount,
                totalCollected: c.totalCollected + payment.amount,
                overdueDays: newBalance <= 0 ? 0 : c.overdueDays,
                notes: c.notes ? `${c.notes}\nPayment received: $${payment.amount} on ${new Date().toLocaleDateString()}` : `Payment received: $${payment.amount} on ${new Date().toLocaleDateString()}`,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : c
        );
        
        // Update metrics
        mockCollectorData.metrics.collectedThisMonth += payment.amount;
        mockCollectorData.metrics.dailyAchieved += payment.amount;
        mockCollectorData.metrics.weeklyAchieved += payment.amount;
        
        // Recalculate collection rate
        const totalActiveBalance = mockCollectorData.customers
          .filter(c => c.status === 'active')
          .reduce((sum, c) => sum + c.balance, 0);
        const totalCollected = mockCollectorData.customers
          .filter(c => c.status === 'active')
          .reduce((sum, c) => sum + c.totalCollected, 0);
        
        mockCollectorData.metrics.collectionRate = totalCollected > 0 
          ? Math.round((totalCollected / (totalCollected + totalActiveBalance)) * 100 * 10) / 10
          : 0;
        
        resolve(mockCollectorData.customers.find(c => c.id === customerId));
      } else {
        reject(new Error('Customer not found'));
      }
    }, 500);
  });
};

/**
 * Update task status
 * @param {string} taskId - Task ID
 * @param {string} status - New status
 * @returns {Object} - Updated task object
 */
export const updateTaskStatus = (taskId, status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = mockCollectorData.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        mockCollectorData.tasks[taskIndex] = {
          ...mockCollectorData.tasks[taskIndex],
          status: status,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        
        // Update metrics if task is completed
        if (status === 'completed') {
          mockCollectorData.metrics.pendingTasks = Math.max(0, mockCollectorData.metrics.pendingTasks - 1);
          mockCollectorData.metrics.completedTasks += 1;
        }
        
        resolve(mockCollectorData.tasks[taskIndex]);
      } else {
        reject(new Error('Task not found'));
      }
    }, 300);
  });
};

/**
 * Start a new collection task
 * @param {string} collectorId - Collector ID
 * @returns {Object} - New task object
 */
export const startNewTask = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTaskId = `TASK${String(mockCollectorData.tasks.length + 1).padStart(3, '0')}`;
      const newTask = {
        id: newTaskId,
        title: 'Collection Task - ' + new Date().toLocaleDateString(),
        description: 'General collection round',
        type: 'collection',
        priority: 'medium',
        status: 'pending',
        assignedTo: collectorId,
        customerIds: [],
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDuration: '3 hours',
        location: mockCollectorData.assignedRoute.area,
        notes: 'Auto-generated task',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      mockCollectorData.tasks.push(newTask);
      mockCollectorData.metrics.pendingTasks += 1;
      
      resolve(newTask);
    }, 400);
  });
};

/**
 * Get collector profile information
 * @param {string} collectorId - Collector ID
 * @returns {Object} - Collector profile
 */
export const getCollectorProfile = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = {
        id: collectorId,
        name: mockCollectorData.name,
        email: mockCollectorData.email,
        assignedArea: mockCollectorData.assignedArea,
        zone: mockCollectorData.assignedZone,
        contactNumber: '+1-555-0001',
        address: 'Collector Office, District A',
        joinDate: '2023-01-15',
        role: 'District Collector',
        permissions: ['view_customers', 'create_tasks', 'submit_reports', 'update_status'],
        performance: { ...mockCollectorData.metrics },
        lastLogin: new Date().toISOString()
      };
      resolve(profile);
    }, 300);
  });
};

/**
 * Get dashboard statistics
 * @param {string} collectorId - Collector ID
 * @returns {Object} - Dashboard stats
 */
export const getDashboardStats = (collectorId = 'collector_001') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCustomers = mockCollectorData.customers.filter(c => c.status === 'active');
      const overdueCustomers = activeCustomers.filter(c => c.overdueDays > 0);
      const totalBalance = activeCustomers.reduce((sum, c) => sum + c.balance, 0);
      
      const stats = {
        totalCustomers: activeCustomers.length,
        activeCustomers: activeCustomers.length,
        overdueCustomers: overdueCustomers.length,
        totalBalance: totalBalance,
        collectedToday: 0, // Would be calculated from today's activities
        collectedThisWeek: mockCollectorData.metrics.weeklyAchieved,
        pendingTasks: mockCollectorData.metrics.pendingTasks,
        completedTasks: mockCollectorData.metrics.completedTasks,
        collectionRate: mockCollectorData.metrics.collectionRate,
        successRate: mockCollectorData.metrics.successPercentage
      };
      
      resolve(stats);
    }, 300);
  });
};

// Export all functions
export default {
  getCollectorAssignedCustomers,
  getCollectorMetrics,
  getCollectorTasks,
  getCollectorActivities,
  getCollectorRoute,
  getNotificationPreferences,
  updateNotificationPreferences,
  getCustomerById,
  searchCustomers,
  updateCustomer,
  addCustomerInteraction,
  recordPayment,
  updateTaskStatus,
  startNewTask,
  getCollectorProfile,
  getDashboardStats
};