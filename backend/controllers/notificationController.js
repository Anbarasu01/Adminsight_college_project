// controllers/notificationController.js
const Notification = require('../models/notificationModel');

// Get all notifications for user
exports.getNotifications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      unreadOnly, 
      type, 
      priority 
    } = req.query;
    
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.getUserNotifications(req.user._id, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      unreadOnly: unreadOnly === 'true',
      type,
      priority
    });
    
    const total = await Notification.countDocuments({ 
      user: req.user._id,
      isArchived: false 
    });
    
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications' 
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    await notification.markAsRead();
    
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error marking notification as read' 
    });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        user: req.user._id, 
        isRead: false 
      },
      { 
        $set: { isRead: true } 
      }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error marking all as read' 
    });
  }
};

// Archive notification
exports.archive = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    await notification.archive();
    
    res.json({
      success: true,
      message: 'Notification archived'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error archiving notification' 
    });
  }
};

// Create notification (admin/internal use)
exports.createNotification = async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      user: req.body.user || req.user._id
    };
    
    const notification = await Notification.create(notificationData);
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating notification' 
    });
  }
};

// Get notification stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Promise.all([
      Notification.getUnreadCount(userId),
      Notification.countDocuments({ 
        user: userId, 
        type: 'task',
        isArchived: false 
      }),
      Notification.countDocuments({ 
        user: userId, 
        type: 'alert',
        isArchived: false 
      }),
      Notification.countDocuments({ 
        user: userId, 
        priority: 'urgent',
        isRead: false,
        isArchived: false 
      })
    ]);
    
    res.json({
      success: true,
      data: {
        unread: stats[0],
        tasks: stats[1],
        alerts: stats[2],
        urgentUnread: stats[3]
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching stats' 
    });
  }
};