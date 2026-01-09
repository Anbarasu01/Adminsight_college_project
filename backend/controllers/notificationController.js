// controllers/notificationController.js
const Notification = require('../models/notificationModel');

// ✅ Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, user_id } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      user_id,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// ✅ Get all notifications (Admin)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('userId', 'name email');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// ✅ Get user-specific notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user notifications', error });
  }
};

// ✅ Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
};

// ✅ Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

// ✅ Get department-specific notifications
exports.getDepartmentNotifications = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { department, type, limit = 50 } = req.query;
    
    // Build query for department notifications
    let query = {
      $or: [
        // Check if message contains department-related keywords
        { message: { $regex: /department|assigned|assignment|task|issue|problem/i } },
        // Check if type is related to departments
        { type: { $regex: /department|assignment|task|issue/i } },
        // Check if title contains department
        { title: { $regex: /department/i } }
      ]
    };

    // If specific department is requested
    if (department) {
      query = {
        $or: [
          { message: { $regex: new RegExp(department, 'i') } },
          { title: { $regex: new RegExp(department, 'i') } },
          { recipient: { $regex: new RegExp(department, 'i') } }
        ]
      };
    }

    // If specific type is requested
    if (type) {
      query.type = { $regex: new RegExp(type, 'i') };
    }

    // Get notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Format response
    const formattedNotifications = notifications.map(notification => ({
      _id: notification._id,
      id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'notification',
      department: extractDepartmentFromNotification(notification),
      time: notification.createdAt,
      read: notification.read || false,
      priority: notification.priority || 'medium',
      recipient: notification.recipient,
      relatedProblem: notification.relatedProblem
    }));

    res.status(200).json({
      success: true,
      count: formattedNotifications.length,
      notifications: formattedNotifications
    });

  } catch (error) {
    console.error('Get department notifications error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching department notifications', 
      error: error.message 
    });
  }
};

// Helper function to extract department name from notification
const extractDepartmentFromNotification = (notification) => {
  const departments = [
    'Revenue & Disaster Management',
    'Health Department',
    'Education Department',
    'Agriculture Department',
    'Police Department',
    'Rural Development',
    'Public Works (PWD)',
    'Transport Department',
    'Social Welfare',
    'Electricity & Water Board'
  ];

  // Check message for department names
  for (const dept of departments) {
    if (notification.message && notification.message.includes(dept)) {
      return dept;
    }
    if (notification.title && notification.title.includes(dept)) {
      return dept;
    }
    if (notification.recipient && notification.recipient.includes(dept)) {
      return dept;
    }
  }

  // Check for common keywords
  if (notification.message) {
    if (notification.message.includes('Health') || notification.message.includes('Medical')) {
      return 'Health Department';
    }
    if (notification.message.includes('Police') || notification.message.includes('Security')) {
      return 'Police Department';
    }
    if (notification.message.includes('Education') || notification.message.includes('School')) {
      return 'Education Department';
    }
    if (notification.message.includes('Road') || notification.message.includes('PWD')) {
      return 'Public Works (PWD)';
    }
    if (notification.message.includes('Revenue') || notification.message.includes('Tax')) {
      return 'Revenue & Disaster Management';
    }
  }

  return notification.recipient || 'General Department';
};
