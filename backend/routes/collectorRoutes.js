const express = require('express');
const router = express.Router();
const {
  getPublicProblems,
  assignDepartment,
  updateProblemStatus,
  getCollectorStats,
  getDepartments
} = require('../controllers/collectorController');

// Collector routes for managing public problems
router.get('/problems', getPublicProblems);           // Get all public problems
router.put('/problems/:id/assign', assignDepartment); // Assign department to problem
router.put('/problems/:id/status', updateProblemStatus); // Update problem status
router.get('/stats', getCollectorStats);              // Get collector dashboard stats
router.get('/departments', getDepartments);           // Get department list

module.exports = router;