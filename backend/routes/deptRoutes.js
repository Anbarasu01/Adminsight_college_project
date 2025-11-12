const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDepartments, createDepartment, updateDepartment, deleteDepartment, assignHead } = require('../controllers/deptController');

// Protected routes
router.get('/all-department', protect, getDepartments);
router.post('/create', protect, authorize('collector','admin'), createDepartment);

// Move this above `/:id`
router.put('/assign-head', protect, authorize('collector','admin'), assignHead);

router.put('/:id', protect, authorize('collector','admin'), updateDepartment);
router.delete('/:id', protect, authorize('collector','admin'), deleteDepartment);



// Catch-all
router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in departments router' });
});

module.exports = router;
