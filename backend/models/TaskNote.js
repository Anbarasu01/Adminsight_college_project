const mongoose = require('mongoose');

const TaskNoteSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required']
  },
  collectorId: {
    type: String,
    required: [true, 'Collector ID is required']
  },
  collectorName: {
    type: String
  },
  content: {
    type: String,
    required: [true, 'Note content is required']
  },
  type: {
    type: String,
    enum: ['general', 'call_record', 'visit_log', 'status_update', 'completion_note', 'creation_note', 'payment_receipt', 'customer_feedback'],
    default: 'general'
  },
  attachment: {
    type: String
  },
  attachmentName: {
    type: String
  }
}, {
  timestamps: true
});

// Add index for better query performance
TaskNoteSchema.index({ taskId: 1 });
TaskNoteSchema.index({ collectorId: 1 });

module.exports = mongoose.model('TaskNote', TaskNoteSchema);