const PublicProblem = require('../models/publicproblems');
const Department = require('../models/department');
const Notification = require('../models/notificationModel');

// ✅ Get all public problems for collector
const getPublicProblems = async (req, res) => {
  try {
    const problems = await PublicProblem.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: problems.length,
      problems: problems.map(problem => ({
        _id: problem._id,
        name: problem.name,
        email: problem.email,
        phone: problem.phone,
        department: problem.department,
        problemTitle: problem.problemTitle,
        description: problem.description,
        location: problem.location,
        status: problem.status,
        assignedDepartment: problem.assignedDepartment,
        priority: problem.priority,
        createdAt: problem.createdAt,
        updatedAt: problem.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message
    });
  }
};

// ✅ Assign department to a problem
const assignDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required'
      });
    }

    const problem = await PublicProblem.findByIdAndUpdate(
      id,
      { 
        assignedDepartment: department,
        status: 'In Progress' // Update status when assigned
      },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Create notification
    await Notification.create({
      title: 'Problem Assigned',
      message: `Problem "${problem.problemTitle}" assigned to ${department}`,
      type: 'assignment',
      department: department,
      problemId: problem._id
    });

    res.status(200).json({
      success: true,
      message: `Problem successfully assigned to ${department}`,
      problem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning department',
      error: error.message
    });
  }
};

// ✅ Update problem status
const updateProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const problem = await PublicProblem.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    await Notification.create({
      title: 'Status Updated',
      message: `Problem "${problem.problemTitle}" status changed to ${status}`,
      type: 'status_update',
      department: problem.assignedDepartment,
      problemId: problem._id
    });

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      problem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

// ✅ Get collector dashboard statistics
const getCollectorStats = async (req, res) => {
  try {
    const totalProblems = await PublicProblem.countDocuments();
    const pending = await PublicProblem.countDocuments({ status: 'Pending' });
    const inProgress = await PublicProblem.countDocuments({ status: 'In Progress' });
    const resolved = await PublicProblem.countDocuments({ status: 'Resolved' });

    res.status(200).json({
      success: true,
      stats: {
        totalProblems,
        pending,
        inProgress,
        resolved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};

// ✅ Get department list
const getDepartments = async (req, res) => {
  try {
    const departments = [
      "Revenue & Disaster Management",
      "Health Department",
      "Education Department", 
      "Agriculture Department",
      "Police Department",
      "Rural Development",
      "Public Works (PWD)",
      "Transport Department",
      "Social Welfare",
      "Electricity & Water Board"
    ];

    res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
};

module.exports = {
  getPublicProblems,
  assignDepartment,
  updateProblemStatus,
  getCollectorStats,
  getDepartments
};