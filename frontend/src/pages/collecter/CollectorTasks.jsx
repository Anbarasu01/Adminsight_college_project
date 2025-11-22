import React, { useState, useEffect } from 'react';

const CollectorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with loading state
    const fetchTasks = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockTasks = [
        {
          id: 1,
          title: 'Collect Reports from Building A',
          location: 'Building A, Floor 3',
          priority: 'high',
          status: 'pending',
          dueDate: '2024-01-15',
          assignedBy: 'Department Head',
          description: 'Collect all pending reports from the third floor of Building A. Ensure proper documentation.',
          category: 'Report Collection'
        },
        {
          id: 2,
          title: 'Dispose Hazardous Materials',
          location: 'Chemistry Lab',
          priority: 'medium',
          status: 'in-progress',
          dueDate: '2024-01-20',
          assignedBy: 'Safety Officer',
          description: 'Safely dispose of chemical waste from the chemistry laboratory following safety protocols.',
          category: 'Waste Management'
        },
        {
          id: 3,
          title: 'Inventory Check - Storage Room',
          location: 'Main Storage Room',
          priority: 'low',
          status: 'pending',
          dueDate: '2024-01-25',
          assignedBy: 'Inventory Manager',
          description: 'Conduct routine inventory check and update the stock records.',
          category: 'Inventory'
        }
      ];
      setTasks(mockTasks);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getPriorityStyles = (priority) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (priority) {
      case 'high': return `${baseStyles} bg-red-100 text-red-800 border border-red-200`;
      case 'medium': return `${baseStyles} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'low': return `${baseStyles} bg-green-100 text-green-800 border border-green-200`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusStyles = (status) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'pending': return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case 'in-progress': return `${baseStyles} bg-blue-100 text-blue-800`;
      case 'completed': return `${baseStyles} bg-green-100 text-green-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getCardBorderColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Tasks
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track your assigned collection tasks
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{tasks.length}</div>
            <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{getTaskCountByStatus('pending')}</div>
            <div className="text-sm text-gray-600 font-medium">Pending</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{getTaskCountByStatus('in-progress')}</div>
            <div className="text-sm text-gray-600 font-medium">In Progress</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{getTaskCountByStatus('completed')}</div>
            <div className="text-sm text-gray-600 font-medium">Completed</div>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'all' 
                ? "You don't have any tasks assigned yet." 
                : `No tasks found with status "${filter}".`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${getCardBorderColor(task.priority)} hover:shadow-md transition-all duration-300 overflow-hidden`}
              >
                <div className="p-6">
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={getPriorityStyles(task.priority)}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={getStatusStyles(task.status)}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Task Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{task.location}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={`text-sm font-medium ${
                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        Due: {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && (
                          <span className="ml-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            OVERDUE
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-700">Assigned by: {task.assignedBy}</span>
                    </div>

                    {task.category && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-sm text-gray-700">Category: {task.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Task Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorTasks;