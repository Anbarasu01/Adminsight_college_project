const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Customer email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Customer address is required']
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  overdueDays: {
    type: Number,
    default: 0
  },
  lastPaymentDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
CustomerSchema.index({ assignedCollector: 1, status: 1 });
CustomerSchema.index({ accountNumber: 1 });
CustomerSchema.index({ status: 1 });

module.exports = mongoose.model('Customer', CustomerSchema);