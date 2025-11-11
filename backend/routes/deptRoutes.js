const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDepartments, createDepartment, updateDepartment, deleteDepartment, assignHead } = require('../controllers/deptController');

// Protected routes
router.get('/', protect, getDepartments);
router.post('/', protect, authorize('admin'), createDepartment);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);
// Example protected route to assign a head (admin only)
router.put('/assign-head', protect, authorize('admin'), assignHead);


// Catch-all
router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in departments router' });
});

module.exports = router;
