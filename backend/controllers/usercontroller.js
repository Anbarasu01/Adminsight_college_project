const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ✅ Get all users (Admin)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ✅ Get single user by ID (Admin)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ success: true, data: user });
});

// ✅ Update user (Admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// ✅ Delete user (Admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// ✅ Get users by department (Admin)
exports.getUsersByDepartment = asyncHandler(async (req, res) => {
  const users = await User.find({ department_id: req.params.deptId }).select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ✅ Get users by role (Admin)
exports.getUsersByRole = asyncHandler(async (req, res) => {
  const users = await User.find({ role: req.params.role }).select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
