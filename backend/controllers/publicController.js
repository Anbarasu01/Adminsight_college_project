const PublicProblem = require('../models/publicproblems');
const Notification = require('../models/notificationModel');

const departmentsList = [
  "Revenue & Disaster Management",
  "Health",
  "Education",
  "Agriculture",
  "Police",
  "Rural Development",
  "Public Works (PWD)",
  "Transport",
  "Social Welfare",
  "Electricity & Water"
];

// ✅ 1. Submit a new public problem
const submitProblem = async (req, res, next) => {
  try {
    const { name, email, phone, department, problemTitle, description, location } = req.body;

    if (!name || !department || !problemTitle || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!departmentsList.includes(department)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    const problem = await PublicProblem.create({
      name,
      email,
      phone,
      department,
      problemTitle,
      description,
      location,
    });

    await Notification.create({
      title: 'New Problem Reported',
      message: `New public issue in ${department}: ${problemTitle}`,
      type: 'alert',
      receiverRole: 'collector',
      department,
    });

    res.status(201).json({
      success: true,
      message: 'Problem submitted successfully',
      problemId: problem._id,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ 2. Get all problems
const getProblems = async (req, res, next) => {
  try {
    const problems = await PublicProblem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, problems });
  } catch (err) {
    next(err);
  }
};

// ✅ 3. Get one problem
const getProblem = async (req, res, next) => {
  try {
    const problem = await PublicProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.status(200).json({ success: true, problem });
  } catch (err) {
    next(err);
  }
};

// ✅ 4. Update problem status
const updateProblemStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const problem = await PublicProblem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    await Notification.create({
      title: 'Problem Status Updated',
      message: `The problem "${problem.problemTitle}" is now marked as ${status}.`,
      type: 'update',
      department: problem.department,
    });

    res.status(200).json({ success: true, message: 'Status updated', problem });
  } catch (err) {
    next(err);
  }
};

// ✅ Export all
module.exports = {
  submitProblem,
  getProblems,
  getProblem,
  updateProblemStatus,
};
