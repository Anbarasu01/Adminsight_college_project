// models/PublicProblem.js
const mongoose = require('mongoose');

const publicProblemSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['waste', 'infrastructure', 'safety', 'environment', 'other']
  },
  images: [String],
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'resolved', 'closed']
  },
  submittedBy: {
    name: String,
    email: String,
    phone: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  priority: {
    type: String,
    default: 'medium',
    enum: ['low', 'medium', 'high', 'urgent']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date
}, {
  timestamps: true
});

// Remove duplicate index definition - only keep one
publicProblemSchema.index({ trackingId: 1 }, { unique: true });

const PublicProblem = mongoose.models.PublicProblem || mongoose.model('PublicProblem', publicProblemSchema);

module.exports = PublicProblem;