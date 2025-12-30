const mongoose = require('mongoose');

const publicUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  receiveUpdates: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: true // Set default to true
  },
  // Remove these fields if you had them:
  // verificationToken: String,
  // verificationTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
publicUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // Your existing password hashing logic
});

const PublicUser = mongoose.model('PublicUser', publicUserSchema);

module.exports = PublicUser;