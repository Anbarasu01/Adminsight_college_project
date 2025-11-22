const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Department = require("../models/department");

// Helper: create JWT token and send response
const createSendToken = (user, statusCode, res, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      uniqueId: user.uniqueId,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department_id: user.department_id,
      managesDepartment: user.managesDepartment
    }
  });
};

// Registration
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department_id, managesDepartment } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const validRoles = ['public', 'collector', 'department_head', 'staff'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role` });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Role-specific validations
    if (role === 'department_head' && !managesDepartment) {
      return res.status(400).json({ success: false, message: 'Department head must have managesDepartment' });
    }
    if ((role === 'staff' || role === 'collector') && !department_id) {
      return res.status(400).json({ success: false, message: `${role} must be assigned to a department` });
    }

    // Generate unique role-based ID
    const datePrefix = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const count = await User.countDocuments({ role, createdAt: { $gte: new Date().setHours(0,0,0,0) } }) + 1;

    let uniqueId;
    if (role === 'collector') uniqueId = `COL-${datePrefix}-${count.toString().padStart(3,'0')}`;
    else if (role === 'department_head') uniqueId = `HEAD-${datePrefix}-${count.toString().padStart(3,'0')}`;
    else if (role === 'staff') uniqueId = `STF-${datePrefix}-${count.toString().padStart(3,'0')}`;
    else uniqueId = `PUB-${datePrefix}-${count.toString().padStart(3,'0')}`;

    // Create user WITHOUT manually hashing password (pre-save hook handles it)
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone?.trim() || null,
      department_id: department_id ? new mongoose.Types.ObjectId(department_id) : null,
      managesDepartment: role === 'department_head' && managesDepartment
                          ? new mongoose.Types.ObjectId(managesDepartment)
                          : null,
      uniqueId
    });

    createSendToken(newUser, 201, res, 'User registered successfully');

  } catch (error) {
    console.error('❌ Registration Error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    createSendToken(user, 200, res, "Login successful");

  } catch (error) {
    console.error("❌ Login Error:", error);
    next(error);
  }
};


// ✅ Get Current User Profile (Authentication Context)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('department_id', 'name code')
      .populate('managesDepartment', 'name code');
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          department_id: user.department_id,
          managesDepartment: user.managesDepartment,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('❌ GetMe Error:', error);
    next(error);
  }
};

// ✅ Update Current User Profile (Authentication Context)
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || req.user.name,
        phone: phone || req.user.phone
      },
      { new: true, runValidators: true }
    ).select('-password')
     .populate('department_id', 'name code')
     .populate('managesDepartment', 'name code');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Password (Authentication)
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    createSendToken(user, 200, res, 'Password updated successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = { 
  registerUser, 
  login, 
  getMe, 
  updateProfile, 
  updatePassword 
};