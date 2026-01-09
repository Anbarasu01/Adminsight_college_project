const Task = require('../models/tasks');
const TaskNote = require('../models/TaskNote');
const mongoose = require('mongoose');
const User = require('../models/User');

// ======================== CREATE TASK ========================
exports.createTask = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, // This should be 'collection', 'followup', etc.
      priority, 
      location, 
      customerId,
      customerIds,
      scheduledDate,
      dueDate,
      notes 
    } = req.body;

    console.log('📝 Received task creation request:', {
      body: req.body,
      user: req.user
    });

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Title and description are required" 
      });
    }

    // For collectors creating their own tasks
    const taskData = {
      title,
      description,
      assignedBy: req.user._id,
      assignedTo: req.user._id, // Self-assigned for collector
      priority: priority || 'medium',
      type: type || 'collection', // Default to 'collection'
      location: location || '',
      notes: notes || '',
      isSelfCreated: true,
      status: 'pending' // Add default status
    };

    // Handle scheduled date (support multiple date formats)
    if (scheduledDate) {
      try {
        // Parse the date string
        const date = new Date(scheduledDate);
        if (!isNaN(date.getTime())) {
          taskData.scheduledDate = date;
          taskData.dueDate = date; // Also set dueDate if needed
        } else {
          console.warn('⚠️ Invalid scheduledDate format:', scheduledDate);
        }
      } catch (error) {
        console.warn('⚠️ Error parsing scheduledDate:', error.message);
      }
    }

    // Handle dueDate separately if provided
    if (dueDate && dueDate !== scheduledDate) {
      try {
        const date = new Date(dueDate);
        if (!isNaN(date.getTime())) {
          taskData.dueDate = date;
        }
      } catch (error) {
        console.warn('⚠️ Error parsing dueDate:', error.message);
      }
    }

    // Handle customer ID - accept both singular and plural
    if (customerId && customerId.trim() !== '') {
      // Validate if it's a proper MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(customerId)) {
        taskData.customerIds = [customerId];
      } else {
        console.warn('⚠️ Invalid customerId format:', customerId);
        // If it's not a valid ObjectId, you might want to create a customer first
        // or handle it differently based on your business logic
      }
    } else if (customerIds && Array.isArray(customerIds) && customerIds.length > 0) {
      // Handle array of customer IDs
      const validCustomerIds = customerIds.filter(id => 
        id && mongoose.Types.ObjectId.isValid(id)
      );
      if (validCustomerIds.length > 0) {
        taskData.customerIds = validCustomerIds;
      }
    }

    // Add collector ID for collector-specific tasks
    if (req.user.role === 'collector') {
      taskData.collectorId = req.user._id.toString();
    }

    console.log('✅ Processed task data:', taskData);

    // Create the task
    const task = await Task.create(taskData);

    // Create initial note for task creation
    if (req.user.role === 'collector') {
      await TaskNote.create({
        taskId: task._id,
        collectorId: req.user._id.toString(),
        collectorName: req.user.name || 'Collector',
        content: `Task created: ${title}`,
        type: 'creation_note'
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Task created successfully',
      data: task 
    });
  } catch (error) {
    console.error('❌ Create task error:', error);
    
    // Send detailed error for debugging
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create task',
      error: error.message,
      details: error.errors || error.stack?.split('\n')[0]
    });
  }
};

// ======================== GET TASKS FOR COLLECTOR ========================
exports.getCollectorTasks = async (req, res) => {
  try {
    const { status, priority, type } = req.query;
    const collectorId = req.user._id;

    // Build query for collector
    let query = { 
      $or: [
        { assignedTo: collectorId },
        { collectorId: collectorId.toString() }
      ]
    };

    // Apply filters if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('department', 'name code')
      // Remove customer population for now
      // .populate('customerIds', 'name accountNumber')
      .sort({ createdAt: -1 });

    // Count tasks by status
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };

    res.json({ 
      success: true, 
      data: tasks,
      stats 
    });
  } catch (error) {
    console.error('Get collector tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tasks',
      error: error.message 
    });
  }
};

// ======================== GET SINGLE TASK ========================
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const collectorId = req.user._id;

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('department', 'name code')
      // Remove customer population for now
      // .populate('customerIds', 'name accountNumber balance');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Check if collector has access to this task
    const isAssigned = task.assignedTo?._id?.toString() === collectorId.toString();
    const isCollectorTask = task.collectorId === collectorId.toString();

    if (!isAssigned && !isCollectorTask) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You are not assigned to this task.' 
      });
    }

    // Get task notes
    const notes = await TaskNote.find({ taskId: id }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: {
        task,
        notes
      }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch task',
      error: error.message 
    });
  }
};

// ======================== UPDATE TASK STATUS ========================
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const collectorId = req.user._id;
    const collectorName = req.user.name || 'Collector';

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }

    // Find the task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Check if collector is assigned to this task
    const isAssigned = task.assignedTo.toString() === collectorId.toString();
    const isCollectorTask = task.collectorId === collectorId.toString();

    if (!isAssigned && !isCollectorTask) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You are not assigned to this task.' 
      });
    }

    // Update status
    task.status = status;
    await task.save();

    // Create status update note
    await TaskNote.create({
      taskId: task._id,
      collectorId: collectorId.toString(),
      collectorName,
      content: `Status changed to: ${status.replace('-', ' ')}`,
      type: 'status_update'
    });

    res.json({ 
      success: true, 
      message: 'Task status updated successfully',
      data: task 
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update task status',
      error: error.message 
    });
  }
};

// ======================== ADD TASK NOTE ========================
exports.addTaskNote = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, type } = req.body || {}; // Add fallback for undefined body
    
    console.log('📝 Adding task note:', {
      taskId,
      body: req.body,
      user: req.user
    });
    
    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required"
      });
    }
    
    // Check if task exists and belongs to collector
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }
    
    // Verify collector owns this task (if needed)
    if (req.user.role === 'collector' && task.collectorId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add notes to this task"
      });
    }
    
    // Create note
    const note = await TaskNote.create({
      taskId,
      collectorId: req.user._id.toString(),
      collectorName: req.user.name || 'Collector',
      content: content.trim(),
      type: type || 'general_note'
    });
    
    // Update task's updatedAt timestamp
    await Task.findByIdAndUpdate(taskId, { updatedAt: new Date() });
    
    res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: note
    });
  } catch (error) {
    console.error('Add task note error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message
    });
  }
};

// ======================== GET TASK NOTES ========================
exports.getTaskNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const collectorId = req.user._id;

    // Check if task exists and collector has access
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    const isAssigned = task.assignedTo.toString() === collectorId.toString();
    const isCollectorTask = task.collectorId === collectorId.toString();

    if (!isAssigned && !isCollectorTask) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You are not assigned to this task.' 
      });
    }

    const notes = await TaskNote.find({ taskId: id }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: notes 
    });
  } catch (error) {
    console.error('Get task notes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch notes',
      error: error.message 
    });
  }
};

// ======================== DELETE NOTE ========================
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const collectorId = req.user._id;

    const note = await TaskNote.findById(noteId);
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }

    // Check if note belongs to this collector
    if (note.collectorId !== collectorId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only delete your own notes.' 
      });
    }

    await note.deleteOne();

    res.json({ 
      success: true, 
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete note',
      error: error.message 
    });
  }
};

// ======================== GET COLLECTOR'S CUSTOMERS (TEMPORARY FIX) ========================
exports.getCollectorCustomers = async (req, res) => {
  try {
    const collectorId = req.user._id;

    // Temporary: Return empty array until Customer model is created
    // Or use a mock response
    res.json({ 
      success: true, 
      data: [] 
    });
    
    // Uncomment this when Customer model is created:
    /*
    const customers = await Customer.find({ 
      assignedCollector: collectorId,
      status: 'active'
    }).select('name accountNumber balance status overdueDays')
      .sort('name');
    */
  } catch (error) {
    console.error('Get collector customers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customers',
      error: error.message 
    });
  }
};