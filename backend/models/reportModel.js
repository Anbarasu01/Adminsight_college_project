const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'PublicProblem', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
  reportMessage: { type: String, required: true },
  photoEvidence: {
    data: Buffer, // actual binary data
    contentType: String, // MIME type (like image/png, image/jpeg)
    fileName: String, 
  },
}, { timestamps: true });


module.exports = mongoose.model('Report', reportSchema);
