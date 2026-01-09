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
        trackingId: problem.trackingId,
        name: problem.submittedBy?.name || 'Anonymous',
        email: problem.submittedBy?.email || 'No email',
        phone: problem.submittedBy?.phone || 'No phone',
        department: problem.category,
        problemTitle: problem.title,
        description: problem.description,
        location: problem.location,
        status: problem.status,
        assignedDepartment: problem.assignedTo,
        priority: problem.priority,
        createdAt: problem.createdAt,
        updatedAt: problem.updatedAt,
        images: problem.images || []
      }))
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message
    });
  }
};

// ✅ Assign department to problem
const assignDepartment = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { departmentName } = req.body;

    console.log(`Assigning department to problem:`, { problemId, departmentName });

    // Find the problem
    const problem = await PublicProblem.findById(problemId);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Update the problem with department name
    problem.assignedDepartment = departmentName;
    problem.status = 'in-progress';
    problem.updatedAt = Date.now();
    
    await problem.save();

    // Create a notification for the department
    try {
      await Notification.create({
        title: 'Department Assignment',
        message: `Problem "${problem.title}" has been assigned to ${departmentName}`,
        type: 'department_assignment',
        recipient: departmentName,
        relatedProblem: problemId,
        createdAt: Date.now()
      });
      
      console.log('Notification created for department:', departmentName);
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the whole request if notification fails
    }

    res.json({
      success: true,
      message: `Problem assigned to ${departmentName} successfully`,
      data: problem
    });

  } catch (error) {
    console.error('Assign department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning department',
      error: error.message
    });
  }
};
// ✅ Update problem status
// ✅ Update problem status
const updateProblemStatus = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: ' + validStatuses.join(', ')
      });
    }

    console.log(`Updating problem status:`, { problemId, status });

    // Find and update the problem
    const problem = await PublicProblem.findById(problemId);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    problem.status = status;
    problem.updatedAt = Date.now();
    
    // If resolved or closed, set resolvedAt
    if (status === 'resolved' || status === 'closed') {
      problem.resolvedAt = Date.now();
    }
    
    await problem.save();

    // Create notification
    try {
      await Notification.create({
        title: 'Status Update',
        message: `Problem "${problem.title}" status updated to ${status}`,
        type: 'status_update',
        recipient: problem.assignedDepartment || 'Department',
        relatedProblem: problemId,
        createdAt: Date.now()
      });
    } catch (notificationError) {
      console.error('Failed to create status notification:', notificationError);
    }

    res.json({
      success: true,
      message: `Problem status updated to ${status} successfully`,
      data: problem
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating problem status',
      error: error.message
    });
  }
};
// ✅ Get collector dashboard statistics
const getCollectorStats = async (req, res) => {
  try {
    const totalProblems = await PublicProblem.countDocuments();
    const pending = await PublicProblem.countDocuments({ status: 'pending' });
    const inProgress = await PublicProblem.countDocuments({ status: 'in-progress' });
    const resolved = await PublicProblem.countDocuments({ status: 'resolved' });

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