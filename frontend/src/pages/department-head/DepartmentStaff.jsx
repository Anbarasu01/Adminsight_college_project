import React, { useState, useEffect } from 'react';
import { getDepartmentStaff, assignTask } from '../../utils/api';

const DepartmentStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await getDepartmentStaff();
      setStaff(response.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (staffId, taskData) => {
    try {
      await assignTask(staffId, taskData);
      setShowAssignModal(false);
      setSelectedStaff(null);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchStaffData(); // Refresh data
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task');
    }
  };

  const openAssignModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedStaff(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (selectedStaff) {
      handleAssignTask(selectedStaff.id, taskForm);
    }
  };

  const getRoleStyles = (role) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (role) {
      case 'senior_staff': return `${baseStyles} bg-purple-100 text-purple-800 border border-purple-200`;
      case 'staff': return `${baseStyles} bg-blue-100 text-blue-800 border border-blue-200`;
      case 'junior_staff': return `${baseStyles} bg-green-100 text-green-800 border border-green-200`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'senior_staff': return 'Senior Staff';
      case 'junior_staff': return 'Junior Staff';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getWorkloadColor = (taskCount) => {
    if (taskCount >= 8) return 'text-red-600';
    if (taskCount >= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  const getWorkloadLabel = (taskCount) => {
    if (taskCount >= 8) return 'High';
    if (taskCount >= 5) return 'Medium';
    return 'Low';
  };

  const calculateProductivity = (completedTasks, totalTasks) => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Staff Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your department staff and assign tasks efficiently
              </p>
            </div>
            <button 
              onClick={fetchStaffData}
              className="mt-4 lg:mt-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Staff</span>
            </button>
          </div>
        </div>

        {/* Staff Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{staff.length}</div>
            <div className="text-sm text-gray-600 font-medium">Total Staff</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {staff.filter(member => member.assignedTasks > 0).length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Active Staff</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {staff.reduce((total, member) => total + (member.completedTasks || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Tasks Completed</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {staff.reduce((total, member) => total + (member.assignedTasks || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Assignments</div>
          </div>
        </div>

        {/* Staff Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading staff data...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Staff Members</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no staff members assigned to your department yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {staff.map(member => (
              <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Staff Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {member.name?.charAt(0)?.toUpperCase() || 'S'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {member.name}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Role and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={getRoleStyles(member.role)}>
                      {getRoleDisplayName(member.role)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      member.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Staff Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{member.assignedTasks || 0}</div>
                      <div className="text-xs text-gray-600">Assigned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{member.completedTasks || 0}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getWorkloadColor(member.assignedTasks || 0)}`}>
                        {getWorkloadLabel(member.assignedTasks || 0)}
                      </div>
                      <div className="text-xs text-gray-600">Workload</div>
                    </div>
                  </div>

                  {/* Productivity */}
                  {(member.assignedTasks > 0) && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Productivity</span>
                        <span>{calculateProductivity(member.completedTasks || 0, member.assignedTasks || 0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${calculateProductivity(member.completedTasks || 0, member.assignedTasks || 0)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {member.department && (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{member.department}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => openAssignModal(member)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Assign Task</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assign Task Modal */}
        {showAssignModal && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Assign Task</h3>
                  <p className="text-gray-600 text-sm mt-1">Assign a new task to {selectedStaff.name}</p>
                </div>
                <button 
                  onClick={closeAssignModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleTaskFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={taskForm.description}
                    onChange={handleTaskFormChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Describe the task details"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleTaskFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleTaskFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Assign Task
                  </button>
                  <button 
                    type="button"
                    onClick={closeAssignModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentStaff;