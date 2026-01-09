const express = require('express');
const router = express.Router();
const collectorController = require('../controllers/collectorController');

// Assign department to problem
router.put('/problems/:problemId/assign', collectorController.assignDepartment);

// Update problem status
router.put('/problems/:problemId/status', collectorController.updateProblemStatus);

// Get all public problems
router.get('/problems', collectorController.getPublicProblems);

// Get collector stats
router.get('/stats', collectorController.getCollectorStats);

// Get department list
router.get('/departments', collectorController.getDepartments);

module.exports = router;