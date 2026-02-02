// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['task', 'system', 'alert', 'reminder', 'info'],
    default: 'info',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['task', 'route', 'customer', 'payment', 'system'],
      required: true
    },
    id: {
      type: String,
      required: true
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedTo.type'
    }
  },
  action: {
    type: {
      type: String,
      enum: ['navigate', 'open', 'dismiss', 'custom', 'none'],
      default: 'none'
    },
    path: String,
    params: mongoose.Schema.Types.Mixed,
    label: String
  },
  metadata: {
    scheduledTime: Date,
    location: String,
    estimatedDuration: Number,
    vehicleType: String,
    icon: String,
    color: String,
    imageUrl: String
  },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });
notificationSchema.index({ user: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });

// Virtual for formatted date
notificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for relative time (e.g., "2 hours ago")
notificationSchema.virtual('relativeTime').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
});

// Pre-save middleware to set expiration for certain types
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Set default expiration based on type/priority
    const expirationDays = {
      urgent: 7,
      high: 7,
      medium: 30,
      low: 30
    };
    
    const days = expirationDays[this.priority] || 30;
    this.expiresAt = new Date();
    this.expiresAt.setDate(this.expiresAt.getDate() + days);
  }
  next();
});

// Static method to create task reminder notification
notificationSchema.statics.createTaskReminder = async function(data) {
  const {
    userId,
    taskId,
    title,
    message,
    scheduledTime,
    location,
    priority = 'medium'
  } = data;
  
  return this.create({
    user: userId,
    title: title || 'Task Reminder',
    message,
    type: 'task',
    priority,
    relatedTo: {
      type: 'task',
      id: taskId,
      reference: taskId
    },
    action: {
      type: 'navigate',
      path: '/collector/tasks',
      params: { taskId }
    },
    metadata: {
      scheduledTime: new Date(scheduledTime),
      location,
      icon: 'calendar',
      color: 'blue'
    }
  });
};

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to archive
notificationSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    isArchived: false
  });
};

// Static method to get recent notifications for user
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    unreadOnly = false,
    type,
    priority,
    includeArchived = false
  } = options;
  
  const query = { user: userId };
  
  if (!includeArchived) {
    query.isArchived = false;
  }
  
  if (unreadOnly) {
    query.isRead = false;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('relatedTo.reference');
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;