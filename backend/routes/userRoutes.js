const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByDepartment,
  getUsersByRole
} = require('../controllers/userController');

// Protected admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Optional: routes by department or role
router.get('/department/:deptId', protect, authorize('admin'), getUsersByDepartment);
router.get('/role/:role', protect, authorize('admin'), getUsersByRole);

// Catch-all route (must be last)
router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in users router' });
});


module.exports = router;
