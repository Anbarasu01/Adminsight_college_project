const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ✅ Get all users (Admin, Collector)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ✅ Get single user by ID (Admin, Collector)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ✅ Update user (Admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  console.log(`🔄 User ${req.user.name} (${req.user.role}) updated user ${user._id}`);

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
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await user.deleteOne();
  console.log(`🗑️ User ${req.user.name} (${req.user.role}) deleted user ${user._id}`);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// ✅ Get users by department (Admin, Collector)
exports.getUsersByDepartment = asyncHandler(async (req, res) => {
  const { deptId } = req.params;

  // find all users in this department
  const users = await User.find({ department_id: deptId })
    .populate('department_id', 'name code description');

  if (!users || users.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No users found for this department',
    });
  }

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ✅ Get users by role (Admin, Collector)
exports.getUsersByRole = asyncHandler(async (req, res) => {
  const users = await User.find({ role: req.params.role }).select('-password');

  if (!users || users.length === 0) {
    return res.status(404).json({ success: false, message: 'No users found for this role' });
  }

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
