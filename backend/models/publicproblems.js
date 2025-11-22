const mongoose = require('mongoose');

const PublicProblemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    problemTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    // ✅ NEW FIELDS ADDED FOR COLLECTOR FUNCTIONALITY
    assignedDepartment: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    trackingId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for non-null
    },
    updates: [{
      date: {
        type: Date,
        default: Date.now
      },
      message: String,
      status: String,
      updatedBy: {
        type: String,
        default: 'System'
      }
    }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to staff/department head
    },
    estimatedResolution: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// ✅ Auto-generate tracking ID before saving
PublicProblemSchema.pre('save', function(next) {
  if (!this.trackingId) {
    // Generate unique tracking ID: TRK + timestamp + random string
    this.trackingId = `TRK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  
  // ✅ Add initial status update when problem is created
  if (this.isNew) {
    this.updates = this.updates || [];
    this.updates.push({
      date: new Date(),
      message: 'Problem reported and logged in system',
      status: 'Pending',
      updatedBy: 'System'
    });
  }
  
  // ✅ Add status update when status changes
  if (this.isModified('status') && !this.isNew) {
    this.updates.push({
      date: new Date(),
      message: `Status changed to ${this.status}`,
      status: this.status,
      updatedBy: 'System'
    });
  }
  
  // ✅ Add assignment update when department is assigned
  if (this.isModified('assignedDepartment') && this.assignedDepartment) {
    this.updates.push({
      date: new Date(),
      message: `Problem assigned to ${this.assignedDepartment} department`,
      status: this.status,
      updatedBy: 'System'
    });
  }

  next();
});

// ✅ Virtual for formatted created date
PublicProblemSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// ✅ Index for better query performance
PublicProblemSchema.index({ status: 1 });
PublicProblemSchema.index({ department: 1 });
PublicProblemSchema.index({ assignedDepartment: 1 });
PublicProblemSchema.index({ trackingId: 1 });
PublicProblemSchema.index({ createdAt: -1 });

// ✅ Method to add custom update
PublicProblemSchema.methods.addUpdate = function(message, updatedBy = 'System') {
  this.updates.push({
    date: new Date(),
    message: message,
    status: this.status,
    updatedBy: updatedBy
  });
  return this.save();
};

// ✅ Static method to get problems by status
PublicProblemSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// ✅ Static method to get problems by department
PublicProblemSchema.statics.getByDepartment = function(department) {
  return this.find({ 
    $or: [
      { department: department },
      { assignedDepartment: department }
    ]
  }).sort({ createdAt: -1 });
};

// ✅ Ensure virtual fields are serialized
PublicProblemSchema.set('toJSON', { virtuals: true });
PublicProblemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.PublicProblem || mongoose.model('PublicProblem', PublicProblemSchema);