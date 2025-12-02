import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectorLayout from '../../layouts/CollectorLayout';

const CollectorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]); // NEW: Collector's customers
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false); // NEW: Task form modal
  const [showNoteForm, setShowNoteForm] = useState(false); // NEW: Note form modal
  const [selectedTask, setSelectedTask] = useState(null); // NEW: Selected task for notes
  const [taskForm, setTaskForm] = useState({ // NEW: Task form data
    type: 'collection',
    title: '',
    description: '',
    customerId: '',
    priority: 'medium',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    notes: ''
  });
  const [noteForm, setNoteForm] = useState({ // NEW: Note form data
    content: '',
    type: 'general',
    attachment: null
  });
  const [taskNotes, setTaskNotes] = useState([]); // NEW: Task notes storage
  const navigate = useNavigate();

  // Mock collector ID
  const collectorId = 'collector_001';

  useEffect(() => {
    fetchTasks();
    fetchCollectorCustomers();
    fetchTaskNotes();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock tasks specific to this collector
    const mockTasks = [
      {
        id: 1,
        title: 'Daily Collection Round - Area A1',
        location: 'Area A1, District A',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-01-15',
        assignedBy: 'Supervisor',
        assignedTo: collectorId,
        description: 'Collect payments from assigned customers in Area A1. Focus on overdue accounts.',
        type: 'collection',
        customerIds: ['C001', 'C002'],
        scheduledDate: '2024-01-15',
        scheduledTime: '10:00 AM',
        estimatedDuration: '3 hours',
        notes: 'Start with John Doe (C001) - $1,250.75 balance',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14'
      },
      {
        id: 2,
        title: 'Overdue Payment Follow-up',
        location: 'Customer Locations - District A',
        priority: 'medium',
        status: 'in-progress',
        dueDate: '2024-01-16',
        assignedBy: 'Accounts Department',
        assignedTo: collectorId,
        description: 'Visit customers with overdue payments to arrange payment plans.',
        type: 'followup',
        customerIds: ['C002', 'C005'],
        scheduledDate: '2024-01-16',
        scheduledTime: '2:00 PM',
        estimatedDuration: '4 hours',
        notes: 'Jane Smith (C002) - 15 days overdue, Mike Brown (C005) - 25 days overdue',
        createdAt: '2024-01-13',
        updatedAt: '2024-01-15'
      },
      {
        id: 3,
        title: 'New Customer Registration',
        location: 'Zone 1, District A',
        priority: 'low',
        status: 'pending',
        dueDate: '2024-01-17',
        assignedBy: 'Registration Department',
        assignedTo: collectorId,
        description: 'Register new customers and collect initial payments.',
        type: 'registration',
        customerIds: [],
        scheduledDate: '2024-01-17',
        scheduledTime: '9:00 AM',
        estimatedDuration: '5 hours',
        notes: 'Bring registration forms and receipt book',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14'
      },
      {
        id: 4,
        title: 'Weekly Collection Report',
        location: 'Collector Office',
        priority: 'medium',
        status: 'completed',
        dueDate: '2024-01-12',
        assignedBy: 'Management',
        assignedTo: collectorId,
        description: 'Submit weekly collection report with all transactions.',
        type: 'report',
        customerIds: [],
        scheduledDate: '2024-01-12',
        scheduledTime: '4:00 PM',
        estimatedDuration: '1 hour',
        notes: 'Include all collections from Jan 8-12',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12'
      },
      {
        id: 5,
        title: 'Receipt Distribution',
        location: 'Customer Homes - Area B2',
        priority: 'medium',
        status: 'in-progress',
        dueDate: '2024-01-18',
        assignedBy: 'Accounts Department',
        assignedTo: collectorId,
        description: 'Distribute payment receipts to customers.',
        type: 'distribution',
        customerIds: ['C001', 'C003'],
        scheduledDate: '2024-01-18',
        scheduledTime: '11:00 AM',
        estimatedDuration: '2 hours',
        notes: 'Ensure all receipts are signed',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: 6,
        title: 'Legal Document Delivery',
        location: 'Legal Department & Customer Locations',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-01-19',
        assignedBy: 'Legal Department',
        assignedTo: collectorId,
        description: 'Deliver legal notices to customers with serious overdue accounts.',
        type: 'legal',
        customerIds: ['C005'],
        scheduledDate: '2024-01-19',
        scheduledTime: '3:00 PM',
        estimatedDuration: '3 hours',
        notes: 'Handle with care - sensitive documents',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14'
      }
    ];
    setTasks(mockTasks);
    setLoading(false);
  };

  const fetchCollectorCustomers = async () => {
    // Mock customers assigned to this collector
    const mockCustomers = [
      { id: 'C001', name: 'John Doe', accountNumber: 'ACC123456', balance: 1250.75, status: 'active' },
      { id: 'C002', name: 'Jane Smith', accountNumber: 'ACC123457', balance: 3200.50, status: 'active', overdueDays: 15 },
      { id: 'C003', name: 'Bob Johnson', accountNumber: 'ACC123458', balance: 850.25, status: 'active' },
      { id: 'C005', name: 'Mike Brown', accountNumber: 'ACC123460', balance: 4500.00, status: 'active', overdueDays: 25 }
    ];
    setCustomers(mockCustomers);
  };

  const fetchTaskNotes = async () => {
    // Mock task notes
    const mockNotes = [
      {
        id: 1,
        taskId: 2,
        collectorId: collectorId,
        content: 'Customer Jane Smith agreed to payment plan of $800/month starting next month.',
        type: 'call_record',
        attachment: null,
        createdAt: '2024-01-15 14:30',
        createdBy: 'Collector'
      },
      {
        id: 2,
        taskId: 4,
        collectorId: collectorId,
        content: 'Weekly report submitted successfully. Total collections: $2,850.75',
        type: 'note',
        attachment: 'report_2024_01_12.pdf',
        createdAt: '2024-01-12 16:45',
        createdBy: 'Collector'
      },
      {
        id: 3,
        taskId: 1,
        collectorId: collectorId,
        content: 'Customer John Doe not available. Left payment reminder notice.',
        type: 'visit_log',
        attachment: 'notice_photo.jpg',
        createdAt: '2024-01-15 11:20',
        createdBy: 'Collector'
      }
    ];
    setTaskNotes(mockNotes);
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : task
    ));
    
    // If task is starting, create a visit log
    if (newStatus === 'in-progress') {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        addTaskNote(taskId, {
          content: `Started task: ${task.title}`,
          type: 'status_update'
        });
      }
    }
    
    // If task is completed, create completion note
    if (newStatus === 'completed') {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        addTaskNote(taskId, {
          content: `Completed task: ${task.title}`,
          type: 'completion_note'
        });
      }
    }
  };

  // NEW: Create a new task note
  const addTaskNote = (taskId, noteData) => {
    const newNote = {
      id: taskNotes.length + 1,
      taskId,
      collectorId,
      content: noteData.content,
      type: noteData.type || 'general',
      attachment: noteData.attachment || null,
      createdAt: new Date().toLocaleString(),
      createdBy: 'Collector'
    };
    
    setTaskNotes(prev => [newNote, ...prev]);
    
    // Update task's last updated date
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, notes: noteData.content, updatedAt: new Date().toISOString().split('T')[0] }
        : task
    ));
    
    return newNote;
  };

  // NEW: Handle task form submission
  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!taskForm.title || !taskForm.description || !taskForm.scheduledDate) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask = {
        id: tasks.length + 1,
        title: taskForm.title,
        location: taskForm.location || 'To be assigned',
        priority: taskForm.priority,
        status: 'pending',
        dueDate: taskForm.scheduledDate,
        assignedBy: 'Self-created',
        assignedTo: collectorId,
        description: taskForm.description,
        type: taskForm.type,
        customerIds: taskForm.customerId ? [taskForm.customerId] : [],
        scheduledDate: taskForm.scheduledDate,
        scheduledTime: taskForm.scheduledTime || 'Anytime',
        estimatedDuration: '2 hours',
        notes: taskForm.notes || '',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setTasks(prev => [newTask, ...prev]);
      
      // Add initial note
      addTaskNote(newTask.id, {
        content: `Task created: ${taskForm.title}`,
        type: 'creation_note'
      });
      
      // Reset form
      setTaskForm({
        type: 'collection',
        title: '',
        description: '',
        customerId: '',
        priority: 'medium',
        scheduledDate: '',
        scheduledTime: '',
        location: '',
        notes: ''
      });
      
      setShowTaskForm(false);
      alert('Task created successfully!');
      
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle note form submission
  const handleNoteFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!noteForm.content) {
      alert('Please enter note content');
      return;
    }
    
    const newNote = addTaskNote(selectedTask.id, {
      content: noteForm.content,
      type: noteForm.type,
      attachment: noteForm.attachment
    });
    
    // Reset form
    setNoteForm({
      content: '',
      type: 'general',
      attachment: null
    });
    
    setShowNoteForm(false);
    setSelectedTask(null);
    
    alert(`Note added to task: ${selectedTask.title}`);
  };

  // NEW: Open note form for a task
  const openNoteForm = (task) => {
    setSelectedTask(task);
    setShowNoteForm(true);
  };

  // NEW: Get notes for a specific task
  const getTaskNotes = (taskId) => {
    return taskNotes.filter(note => note.taskId === taskId);
  };

  // NEW: Delete a note (own notes only)
  const deleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const note = taskNotes.find(n => n.id === noteId);
      if (note && note.collectorId === collectorId) {
        setTaskNotes(prev => prev.filter(n => n.id !== noteId));
        alert('Note deleted successfully');
      } else {
        alert('You can only delete your own notes');
      }
    }
  };

  // NEW: Upload file for note attachment
  const handleFileUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
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
      
      if (formType === 'note') {
        setNoteForm(prev => ({ ...prev, attachment: file }));
      } else if (formType === 'task') {
        // For task-level attachments
        alert(`File "${file.name}" will be attached to the task`);
      }
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

  // NEW: Get type icon
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

  // NEW: Get note type icon
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
            <div className="text-4xl font-bold text-blue-600 mb-2">{tasks.length}</div>
            <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
            <div className="text-xs text-gray-500 mt-1">Assigned to you</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{getTaskCountByStatus('pending')}</div>
            <div className="text-sm text-gray-600 font-medium">Pending</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting action</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{getTaskCountByStatus('in-progress')}</div>
            <div className="text-sm text-gray-600 font-medium">In Progress</div>
            <div className="text-xs text-gray-500 mt-1">Currently working</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-green-600 mb-2">{getTaskCountByStatus('completed')}</div>
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
              Showing <span className="font-bold text-blue-600">{filteredTasks.length}</span> of <span className="font-bold text-blue-600">{tasks.length}</span> tasks
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
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
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
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
                          {task.priority.toUpperCase()} PRIORITY
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
                      <span className="text-blue-500">📍</span>
                      <span className="text-sm text-gray-700">{task.location}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">📅</span>
                      <span className={`text-sm font-medium ${
                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        Due: {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            OVERDUE
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">👤</span>
                      <span className="text-sm text-gray-700">Assigned by: {task.assignedBy}</span>
                    </div>

                    {task.customerIds.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-500">👥</span>
                        <span className="text-sm text-gray-700">
                          Customers: {task.customerIds.map(id => {
                            const customer = customers.find(c => c.id === id);
                            return customer ? customer.name : id;
                          }).join(', ')}
                        </span>
                      </div>
                    )}

                    {task.notes && (
                      <div className="flex items-start space-x-3 pt-2 border-t border-gray-100">
                        <span className="text-blue-500 mt-1">📝</span>
                        <span className="text-sm text-gray-600 italic">"{task.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Task Notes Preview */}
                  {getTaskNotes(task.id).length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Recent Notes</span>
                        <span className="text-xs text-gray-500">{getTaskNotes(task.id).length} notes</span>
                      </div>
                      {getTaskNotes(task.id).slice(0, 2).map(note => (
                        <div key={note.id} className="flex items-start space-x-2 mb-2 last:mb-0">
                          <span className="text-gray-400">{getNoteTypeIcon(note.type)}</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 line-clamp-2">{note.content}</p>
                            <p className="text-xs text-gray-400">{note.createdAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Task Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                    <div className="flex items-center space-x-2">
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
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
                      onClick={() => navigate(`/collector/tasks/${task.id}`)}
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
                    <option key={customer.id} value={customer.id}>
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
      {showNoteForm && selectedTask && (
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
                    setShowNoteForm(false);
                    setSelectedTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleNoteFormSubmit} className="p-6 space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Document (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="note-file-upload"
                    onChange={(e) => handleFileUpload(e, 'note')}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="note-file-upload" className="cursor-pointer block">
                    {noteForm.attachment ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-sm font-medium">{noteForm.attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {(noteForm.attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button 
                          type="button"
                          onClick={() => setNoteForm(prev => ({ ...prev, attachment: null }))}
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

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowNoteForm(false);
                    setSelectedTask(null);
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

export default CollectorTasks;