// models/Department.js (EXAMPLE - apply to ALL models)
const mongoose = require('mongoose');

// Define schema
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Check if model already exists before creating
const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

module.exports = Department;