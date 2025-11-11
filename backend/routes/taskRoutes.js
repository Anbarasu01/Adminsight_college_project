const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// ------------------ Task Routes ------------------

// Create a task (protected)
router.post('/', protect, createTask);

// Get all tasks (protected)
router.get('/', protect, getTasks);

// Get a single task by ID (protected)
router.get('/:id', protect, getTask);

// Update a task by ID (protected)
router.put('/:id', protect, updateTask);

// Delete a task by ID (protected)
router.delete('/:id', protect, deleteTask);

// ------------------ Catch-all 404 ------------------
// This replaces the '*' route
router.all(/.*/,(req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
