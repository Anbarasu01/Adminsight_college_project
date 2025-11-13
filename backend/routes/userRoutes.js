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

// ✅ Specific routes first
router.get('/getUser', protect, authorize('admin','collector'), getUsers);
router.get('/department/:deptId', protect, authorize('admin','collector'), getUsersByDepartment);
router.get('/role/:role', protect, authorize('admin','collector'), getUsersByRole);

// ✅ Generic routes last
router.get('/:id', protect, authorize('admin','collector'), getUserById);
router.put('/:id', protect, authorize('admin','collector'), updateUser);
router.delete('/:id', protect, authorize('admin','collector'), deleteUser);


// Catch-all route (must be last)
router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in users router' });
});


module.exports = router;
