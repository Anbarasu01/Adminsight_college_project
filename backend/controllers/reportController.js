const mongoose = require("mongoose");
const Report = require('../models/reportModel');
const PublicProblem = require('../models/publicproblems');
const User = require('../models/User'); // to find reporter by name or id
const sendInAppNotifications = require('../utils/Sendnotification');

// ✅ Create a new report
exports.createReport = async (req, res) => {
  try {
    console.log("Incoming report data:", req.body);
    console.log("Uploaded file:", req.file);
    let { problemId, reportedBy, department, status, reportMessage, photoEvidence } = req.body;

    if (!problemId || !reportedBy || !department || !reportMessage) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Find problem
    const problem = await PublicProblem.findById(problemId);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    // Find user (can be ObjectId or name)
    let user = null;
    if (mongoose.Types.ObjectId.isValid(reportedBy)) {
      user = await User.findById(reportedBy);
    } else {
      user = await User.findOne({ name: reportedBy });
    }

    if (!user) return res.status(404).json({ success: false, message: 'Reporter not found' });

    // Create report
    const report = await Report.create({
      problemId,
      reportedBy: user._id,
      department,
      status,
      reportMessage,
      photoEvidence
    });

    // Optional: update problem status
    if (status) {
      problem.status = status;
      await problem.save();
    }

    // Optional: send notification
    const message = `New report update on "${problem.problemTitle}" by ${department}`;
    await sendInAppNotifications({
      department,
      message,
      data: { reportId: report._id, problemId: problem._id }
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report
    });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('problemId', 'problemTitle department status')
      .populate('reportedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get reports by problem ID
exports.getReportsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const reports = await Report.find({ problemId })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update report
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reportMessage } = req.body;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    if (status) report.status = status;
    if (reportMessage) report.reportMessage = reportMessage;
    await report.save();

    res.status(200).json({ success: true, message: 'Report updated successfully', report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
