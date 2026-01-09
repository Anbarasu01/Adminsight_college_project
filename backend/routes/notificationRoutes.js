const express = require('express');
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  getDepartmentNotifications // Add this import
} = require('../controllers/notificationController');

// Routes for notifications
router.post('/', createNotification); // Create a new notification
router.get('/all', getAllNotifications); // Get all notifications (Admin)
router.get('/user/:userId', getUserNotifications); // Get user-specific notifications
router.put('/:id/read', markAsRead); // Mark notification as read
router.delete('/:id', deleteNotification); // Delete a notification

// ✅ NEW: Get department notifications
router.get('/departments', getDepartmentNotifications); // Get department notifications
router.get('/departments/:department', getDepartmentNotifications); // Get specific department notifications

router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;