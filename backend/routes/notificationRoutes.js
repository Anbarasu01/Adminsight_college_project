// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Destructure

// All routes require authentication - USE 'protect' not 'auth'
router.use(protect); // This is the middleware function

// Get notifications with optional filters
router.get('/', notificationController.getNotifications);

// Get notification stats
router.get('/stats', notificationController.getStats);

// Mark single notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', notificationController.markAllAsRead);

// Archive notification
router.patch('/:id/archive', notificationController.archive);

// Create notification (admin/internal) - Add authorization if needed
router.post('/', authorize('admin', 'staff'), notificationController.createNotification);

module.exports = router;