const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); // ✅ include authorize
const { getAllReports, createReport, getReportsByProblem, updateReport } = require('../controllers/reportController');

// Protected routes
router.get('/', protect, getAllReports);
router.post('/', protect, createReport);

// ✅ Get all reports for a specific problem
router.get('/problem/:problemId', protect, authorize('admin', 'collector'), getReportsByProblem);

// ✅ Update a report (admin only)
router.put('/:id', protect, authorize('admin'), updateReport);

// ✅ Catch-all route
router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in reports router' });
});

module.exports = router;
