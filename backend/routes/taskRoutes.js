const express = require('express');
const router = express.Router();
const { 
  createTask,
  getCollectorTasks,
  getTask,
  updateTaskStatus,
  addTaskNote,
  getTaskNotes,
  deleteNote,
  getCollectorCustomers
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Collector-specific routes
router.get('/collector', authorize('collector'), getCollectorTasks);
router.post('/collector', authorize('collector'), createTask);
router.get('/collector/customers', authorize('collector'), getCollectorCustomers);
router.get('/collector/:id', authorize('collector'), getTask);
router.put('/collector/:id/status', authorize('collector'), updateTaskStatus);
router.post('/collector/:id/notes', authorize('collector'), addTaskNote);
router.get('/collector/:id/notes', authorize('collector'), getTaskNotes);
router.delete('/collector/notes/:noteId', authorize('collector'), deleteNote);

module.exports = router;