const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'alert', 'update'],
      default: 'info',
    },
    read: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ consistent field name
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
