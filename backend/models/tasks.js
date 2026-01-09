const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Task description is required'] 
  },
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['collection', 'followup', 'registration', 'report', 'distribution', 'legal', 'general'],
    default: 'general'
  },
  dueDate: { 
    type: Date 
  },
  scheduledDate: { 
    type: Date 
  },
  location: { 
    type: String 
  },
  customerIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer' 
  }],
  estimatedDuration: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  // Collector-specific fields
  collectorId: {
    type: String
  },
  isSelfCreated: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ collectorId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ dueDate: 1 });

// Virtual for checking if task is overdue
TaskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > new Date(this.dueDate) && this.status !== 'completed';
});

module.exports = mongoose.model('Task', TaskSchema);