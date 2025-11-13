const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllReports, createReport, getReportsByProblem, updateReport } = require('../controllers/reportController');

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Routes
router.get('/', protect, getAllReports);
router.post('/create', protect, upload.single('photoEvidence'), createReport);
router.get('/problem/:problemId', protect, authorize('admin', 'collector'), getReportsByProblem);
router.put('/:id', protect, authorize('admin','collector'), updateReport);

router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in reports router' });
});

module.exports = router;
