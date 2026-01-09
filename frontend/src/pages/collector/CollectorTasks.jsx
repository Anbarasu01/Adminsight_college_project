import React, { useState, useEffect } from 'react';
import CollectorLayout from '../../layouts/CollectorLayout';

const CollectorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [taskNotes, setTaskNotes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  
  // States for details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTask, setDetailsTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState({});
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    type: 'collection',
    priority: 'medium',
    customerId: '',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    notes: ''
  });
  
  const [noteForm, setNoteForm] = useState({
    content: '',
    type: 'general',
    attachment: null
  });
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  useEffect(() => {
    fetchTasks();
    fetchCollectorCustomers();
  }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/tasks/collector${filter !== 'all' ? `?status=${filter}` : ''}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTasks(data.data || []);
        setStats(data.stats || { total: 0, pending: 0, inProgress: 0, completed: 0 });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectorCustomers = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/tasks/collector/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data && data.data.length > 0 ? data.data : [
            { _id: "1", name: "John Doe", accountNumber: "ACC001", balance: 1250.75 },
            { _id: "2", name: "Jane Smith", accountNumber: "ACC002", balance: 3200.50 }
          ]);
        }
      } else {
        setCustomers([
          { _id: "1", name: "John Doe", accountNumber: "ACC001", balance: 1250.75 },
          { _id: "2", name: "Jane Smith", accountNumber: "ACC002", balance: 3200.50 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([
        { _id: "1", name: "John Doe", accountNumber: "ACC001", balance: 1250.75 },
        { _id: "2", name: "Jane Smith", accountNumber: "ACC002", balance: 3200.50 }
      ]);
    }
  };

  // Fetch detailed task information for modal
  const fetchTaskDetails = async (taskId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTaskDetails(prev => ({
            ...prev,
            [taskId]: data.data
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const fetchTaskNotes = async (taskId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/tasks/collector/${taskId}/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTaskNotes(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching task notes:', error);
    }
  };

  // Open details modal
  const handleShowDetails = async (task) => {
    setDetailsTask(task);
    setShowDetailsModal(true);
    
    // Fetch additional details if not already loaded
    if (!taskDetails[task._id]) {
      await fetchTaskDetails(task._id);
    }
    fetchTaskNotes(task._id);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/tasks/collector/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTasks(prev => prev.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        ));
        
        // Update in modal if open
        if (detailsTask && detailsTask._id === taskId) {
          setDetailsTask(prev => ({ ...prev, status: newStatus }));
        }
        
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = getAuthToken();
      
      if (!taskForm.title || !taskForm.description) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      const requestData = {
        title: taskForm.title,
        description: taskForm.description,
        type: taskForm.type,
        priority: taskForm.priority,
        location: taskForm.location || '',
        notes: taskForm.notes || ''
      };
      
      if (taskForm.customerId && taskForm.customerId.trim() !== '') {
        requestData.customerId = taskForm.customerId;
      }
      
      if (taskForm.scheduledDate) {
        try {
          let dateString = taskForm.scheduledDate;
          
          if (taskForm.scheduledTime) {
            if (dateString.includes('-')) {
              const parts = dateString.split('-');
              if (parts.length === 3) {
                dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
            }
            
            const dateTimeString = `${dateString}T${taskForm.scheduledTime}:00`;
            const dateObj = new Date(dateTimeString);
            
            if (!isNaN(dateObj.getTime())) {
              requestData.scheduledDate = dateObj.toISOString();
              requestData.dueDate = dateObj.toISOString();
            }
          } else {
            if (dateString.includes('-')) {
              const parts = dateString.split('-');
              if (parts.length === 3) {
                dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
            }
            
            const dateObj = new Date(dateString);
            if (!isNaN(dateObj.getTime())) {
              requestData.scheduledDate = dateObj.toISOString();
              requestData.dueDate = dateObj.toISOString();
            }
          }
        } catch (error) {
          console.warn('Date formatting error:', error);
          requestData.scheduledDate = taskForm.scheduledDate;
        }
      }
      
      console.log('📤 Sending task data:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/tasks/collector`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        setTasks(prev => [data.data, ...prev]);
        
        setTaskForm({
          title: '',
          description: '',
          type: 'collection',
          priority: 'medium',
          customerId: '',
          scheduledDate: '',
          scheduledTime: '',
          location: '',
          notes: ''
        });
        
        setShowTaskForm(false);
        alert('Task created successfully!');
        
        fetchTasks();
      } else {
        throw new Error(data.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`Failed to create task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteFormSubmit = async (taskId) => {
    if (!noteForm.content.trim()) return;
    
    try {
      const token = getAuthToken();
      
      const requestData = {
        content: noteForm.content,
        type: noteForm.type
      };
      
      console.log('📝 Sending note data:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/tasks/collector/${taskId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTaskNotes(prev => [...prev, data.data]);
        
        setNoteForm({
          content: '',
          type: 'general',
          attachment: null
        });
        
        setShowNoteModal(false);
        alert('Note added successfully!');
        
        fetchTaskNotes(taskId);
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert(`Failed to add note: ${error.message}`);
    }
  };

  const openNoteForm = (task) => {
    setSelectedTask(task);
    setShowNoteModal(true);
    fetchTaskNotes(task._id);
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/tasks/collector/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTaskNotes(prev => prev.filter(note => note._id !== noteId));
        alert('Note deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
      const maxSize = 5 * 1024 * 1024;
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload PDF, JPEG, PNG, or Word documents only');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setNoteForm(prev => ({ ...prev, attachment: file }));
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'collection': return '💰';
      case 'followup': return '📞';
      case 'registration': return '📝';
      case 'report': return '📊';
      case 'distribution': return '📨';
      case 'legal': return '⚖️';
      default: return '✅';
    }
  };

  const getNoteTypeIcon = (type) => {
    switch(type) {
      case 'call_record': return '📞';
      case 'visit_log': return '📍';
      case 'status_update': return '🔄';
      case 'completion_note': return '✅';
      case 'creation_note': return '🆕';
      default: return '📝';
    }
  };

  const getTaskNotesForDisplay = (taskId) => {
    return taskNotes.filter(note => note.taskId === taskId);
  };

  return (
    <CollectorLayout 
      title="My Tasks" 
      description="Manage and track your assigned collection tasks"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats and Actions Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Collection Tasks</h1>
              <p className="text-gray-600 mt-1">Manage tasks assigned to you only</p>
            </div>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Create New Task</span>
            </button>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
            <div className="text-xs text-gray-500 mt-1">Assigned to you</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-sm text-gray-600 font-medium">Pending</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting action</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.inProgress}</div>
            <div className="text-sm text-gray-600 font-medium">In Progress</div>
            <div className="text-xs text-gray-500 mt-1">Currently working</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.completed}</div>
            <div className="text-sm text-gray-600 font-medium">Completed</div>
            <div className="text-xs text-gray-500 mt-1">Finished tasks</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Status:
              </label>
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
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-blue-600">{tasks.length}</span> tasks
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {filter === 'all' 
                ? "You don't have any tasks assigned yet. Create your first task!" 
                : `No tasks found with status "${filter}".`
              }
            </p>
            <button 
              onClick={() => setFilter('all')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
            >
              View All Tasks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div 
                key={task._id} 
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 border-l-4 ${getCardBorderColor(task.priority)} hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1`}
              >
                <div className="p-6">
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">{getTypeIcon(task.type)}</span>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={getPriorityStyles(task.priority)}>
                          {task.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                        </span>
                        <span className={getStatusStyles(task.status)}>
                          {task.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
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
                    {task.location && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-500">📍</span>
                        <span className="text-sm text-gray-700">{task.location}</span>
                      </div>
                    )}

                    {task.dueDate && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-500">📅</span>
                        <span className={`text-sm font-medium ${
                          isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          Due: {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate) && task.status !== 'completed' && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              OVERDUE
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {task.assignedBy && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-500">👤</span>
                        <span className="text-sm text-gray-700">Assigned by: {task.assignedBy?.name || 'System'}</span>
                      </div>
                    )}

                    {task.customerIds && task.customerIds.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-500">👥</span>
                        <span className="text-sm text-gray-700">
                          {task.customerIds.length} customer(s)
                        </span>
                      </div>
                    )}

                    {task.notes && (
                      <div className="flex items-start space-x-3 pt-2 border-t border-gray-100">
                        <span className="text-blue-500 mt-1">📝</span>
                        <span className="text-sm text-gray-600 italic line-clamp-2">"{task.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Task Notes Preview */}
                  {getTaskNotesForDisplay(task._id).length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Recent Notes</span>
                        <span className="text-xs text-gray-500">{getTaskNotesForDisplay(task._id).length} notes</span>
                      </div>
                      {getTaskNotesForDisplay(task._id).slice(0, 2).map(note => (
                        <div key={note._id} className="flex items-start space-x-2 mb-2 last:mb-0">
                          <span className="text-gray-400">{getNoteTypeIcon(note.type)}</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 line-clamp-2">{note.content}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Task Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                    <div className="flex items-center space-x-2">
                      <select 
                        value={task.status || 'pending'}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <button 
                        onClick={() => openNoteForm(task)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>📝</span>
                        <span>Add Note</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleShowDetails(task)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                    >
                      <span>👁️</span>
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Access Restrictions Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-yellow-800">Task Access Restrictions</h4>
              <p className="text-yellow-700 mt-1">
                As a Collector, you can only manage tasks assigned to you.
              </p>
              <div className="mt-3 text-sm text-yellow-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can view all tasks assigned to you</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can create task notes, visit logs, and call records</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can update task status (start, complete, reschedule)</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can delete your own notes and attachments</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot view other collectors' tasks</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot create system-level tasks</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot modify task assignment rules</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot delete completed tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Task</h3>
                  <p className="text-gray-600 text-sm mt-1">Create a new collection task for yourself</p>
                </div>
                <button 
                  onClick={() => setShowTaskForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTaskFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type *
                  </label>
                  <select
                    value={taskForm.type}
                    onChange={(e) => setTaskForm({...taskForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    required
                  >
                    <option value="collection">💰 Collection</option>
                    <option value="followup">📞 Follow-up</option>
                    <option value="registration">📝 Registration</option>
                    <option value="report">📊 Report</option>
                    <option value="distribution">📨 Distribution</option>
                    <option value="legal">⚖️ Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Daily collection round in Area A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Describe what needs to be done..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Customer (Optional)
                </label>
                <select
                  value={taskForm.customerId}
                  onChange={(e) => setTaskForm({...taskForm, customerId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">Select a customer (optional)</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.accountNumber} (${customer.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={taskForm.scheduledDate}
                    onChange={(e) => setTaskForm({...taskForm, scheduledDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={taskForm.scheduledTime}
                    onChange={(e) => setTaskForm({...taskForm, scheduledTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={taskForm.location}
                  onChange={(e) => setTaskForm({...taskForm, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Area A1, District A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Notes (Optional)
                </label>
                <textarea
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span>➕</span>
                  )}
                  <span>{loading ? 'Creating...' : 'Create Task'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add Note to Task</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedTask.title}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowNoteModal(false);
                    setSelectedTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note Type
                </label>
                <select
                  value={noteForm.type}
                  onChange={(e) => setNoteForm({...noteForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="general">📝 General Note</option>
                  <option value="call_record">📞 Call Record</option>
                  <option value="visit_log">📍 Visit Log</option>
                  <option value="status_update">🔄 Status Update</option>
                  <option value="payment_receipt">💰 Payment Receipt</option>
                  <option value="customer_feedback">💬 Customer Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note Content *
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter your note here..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleNoteFormSubmit(selectedTask._id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
                <button 
                  onClick={() => {
                    setShowNoteModal(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetailsModal && detailsTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl">{getTypeIcon(detailsTask.type)}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{detailsTask.title}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={getPriorityStyles(detailsTask.priority)}>
                          {detailsTask.priority?.toUpperCase()} PRIORITY
                        </span>
                        <span className={getStatusStyles(detailsTask.status)}>
                          {detailsTask.status?.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">📋 Description</h3>
                    <p className="text-gray-700 leading-relaxed">{detailsTask.description}</p>
                    
                    {detailsTask.notes && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <h4 className="font-medium text-gray-700 mb-2">Initial Notes</h4>
                        <p className="text-gray-600 italic bg-white p-3 rounded-lg">"{detailsTask.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Location & Customers Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">📍 Location & Customers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                        <p className="text-gray-600">{detailsTask.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Customers</h4>
                        {detailsTask.customerIds && detailsTask.customerIds.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {detailsTask.customerIds.map((customerId, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
                                Customer #{index + 1}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No customers assigned</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-gray-900 text-lg">💬 Notes & Updates</h3>
                      <span className="text-sm text-gray-500">
                        {getTaskNotesForDisplay(detailsTask._id).length} notes
                      </span>
                    </div>

                    {/* Add Note Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <textarea
                        value={noteForm.content}
                        onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none mb-3 bg-white"
                        placeholder="Add a note..."
                      />
                      <div className="flex items-center justify-between">
                        <select
                          value={noteForm.type}
                          onChange={(e) => setNoteForm({...noteForm, type: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                        >
                          <option value="general">📝 General Note</option>
                          <option value="call_record">📞 Call Record</option>
                          <option value="visit_log">📍 Visit Log</option>
                        </select>
                        <button 
                          onClick={() => handleNoteFormSubmit(detailsTask._id)}
                          disabled={!noteForm.content.trim()}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>

                    {/* Notes List */}
                    {getTaskNotesForDisplay(detailsTask._id).length > 0 ? (
                      <div className="space-y-4">
                        {getTaskNotesForDisplay(detailsTask._id).map(note => (
                          <div key={note._id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600">{getNoteTypeIcon(note.type)}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{note.collectorName}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(note.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={() => deleteNote(note._id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            <p className="text-gray-700">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No notes yet. Add the first note!
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">📊 Status & Actions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Status
                        </label>
                        <select 
                          value={detailsTask.status || 'pending'}
                          onChange={(e) => updateTaskStatus(detailsTask._id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <button 
                          onClick={() => {
                            setShowDetailsModal(false);
                            openNoteForm(detailsTask);
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                        >
                          📝 Add Note
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">⏰ Timeline</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium text-gray-900">{formatDate(detailsTask.createdAt)}</p>
                      </div>
                      {detailsTask.scheduledDate && (
                        <div>
                          <p className="text-sm text-gray-600">Scheduled</p>
                          <p className="font-medium text-gray-900">{formatDate(detailsTask.scheduledDate)}</p>
                        </div>
                      )}
                      {detailsTask.dueDate && (
                        <div>
                          <p className="text-sm text-gray-600">Due Date</p>
                          <div className="flex items-center">
                            <p className={`font-medium ${
                              isOverdue(detailsTask.dueDate) && detailsTask.status !== 'completed' 
                                ? 'text-red-600' 
                                : 'text-gray-900'
                            }`}>
                              {formatDate(detailsTask.dueDate)}
                            </p>
                            {isOverdue(detailsTask.dueDate) && detailsTask.status !== 'completed' && (
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                OVERDUE
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {detailsTask.updatedAt && (
                        <div>
                          <p className="text-sm text-gray-600">Last Updated</p>
                          <p className="font-medium text-gray-900">{formatDate(detailsTask.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Info Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">📄 Task Info</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Task ID</p>
                        <p className="font-mono text-sm text-gray-900 truncate">{detailsTask._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium text-gray-900 capitalize">{detailsTask.type}</p>
                      </div>
                      {detailsTask.assignedBy && (
                        <div>
                          <p className="text-sm text-gray-600">Assigned By</p>
                          <p className="font-medium text-gray-900">{detailsTask.assignedBy?.name || 'System'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    openNoteForm(detailsTask);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </CollectorLayout>
  );
};

export default CollectorTasks;