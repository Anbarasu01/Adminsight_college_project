const Task = require('../models/tasks');

// ======================== CREATE TASK ========================
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, department, dueDate } = req.body;

    // Basic validation
    if (!title || !assignedTo || !department) {
      return res.status(400).json({ message: "Title, assignedTo, and department are required" });
    }

    const task = await Task.create({
      title,
      description,
      assignedBy: req.user._id,
      assignedTo,
      department,
      dueDate,
      status: 'pending' // default status
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

// ======================== GET ALL TASKS ========================
exports.getTasks = async (req, res, next) => {
  try {
    const { role, department, _id } = req.user;
    let query = {};

    if (role === 'staff') query.assignedTo = _id;
    else if (role === 'department_head') query.department = department;
    // admin or collector can see all tasks

    const tasks = await Task.find(query)
      .populate('assignedTo assignedBy', 'name email');

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

// ======================== GET SINGLE TASK ========================
exports.getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('assignedTo assignedBy', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Staff can only view their own task
    if (req.user.role === 'staff' && !task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: Cannot view this task' });
    }

    // Department head can only view tasks in their department
    if (req.user.role === 'department_head' && task.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ message: 'Forbidden: Cannot view this task' });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

// ======================== UPDATE TASK ========================
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, department, dueDate, status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Staff cannot update using this route; only admin/department_head can
    // Already protected by `authorize('admin', 'department_head')` in route

    // Update fields if provided
    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (department) task.department = department;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    await task.save();

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

// ======================== DELETE TASK ========================
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Staff cannot delete; only admin/department_head (route protected)
    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};
