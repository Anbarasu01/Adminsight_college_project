const mongoose = require("mongoose");
const Report = require("../models/reportModel");
const PublicProblem = require("../models/publicproblems");
const User = require("../models/User");
const sendInAppNotifications = require("../utils/Sendnotification");

// ✅ Create a new report
exports.createReport = async (req, res) => {
  try {
    console.log("Incoming report data:", req.body);
    console.log("Uploaded file:", req.file);

    // ✅ Destructure data from body
    let { problemId, department, status, reportMessage } = req.body;

    // ✅ Use logged-in user automatically
    const reporterId = req.user ? req.user._id : null;

    // ✅ Validate required fields
    if (!problemId || !department || !reportMessage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (problemId, department, reportMessage)",
      });
    }

    if (!reporterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — reporter not found (login required)",
      });
    }

    // ✅ Find the problem
    const problem = await PublicProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // ✅ Prepare photo evidence (if file uploaded)
    let photoEvidence = null;
    if (req.file) {
      photoEvidence = {
        data: req.file.buffer, // Binary data
        contentType: req.file.mimetype, // Image MIME type
        fileName: req.file.originalname, // Original name
      };
    }

    // ✅ Create the report
    const report = await Report.create({
      problemId,
      reportedBy: reporterId,
      department,
      status: status || "Pending",
      reportMessage,
      photoEvidence,
    });

    // ✅ Update problem status (optional)
    if (status) {
      problem.status = status;
      await problem.save();
    }

    // ✅ Send notification (optional)
    const message = `New report update on "${problem.problemTitle}" by ${department}`;
    await sendInAppNotifications({
      department,
      message,
      data: { reportId: report._id, problemId: problem._id },
    });

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("problemId", "problemTitle department status")
      .populate("reportedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all reports for a specific problem
exports.getReportsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const reports = await Report.find({ problemId })
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, reportMessage } = req.body;

    // Normalize status capitalization
    if (status) {
      status = status
        .split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { 
        ...(status && { status }),
        ...(reportMessage && { reportMessage })
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
