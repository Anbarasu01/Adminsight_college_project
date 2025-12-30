const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PublicUser = require('../models/PublicUser');

// ================= REGISTER =================
const registerPublicUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const userExists = await PublicUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await PublicUser.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'public',
      isVerified: true,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ================= LOGIN =================
const loginPublicUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await PublicUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= PROFILE =================
const getPublicProfile = async (req, res) => {
  res.json({ message: 'Public profile API working' });
};

// ✅ ONLY THIS EXPORT (IMPORTANT)
module.exports = {
  registerPublicUser,
  loginPublicUser,
  getPublicProfile,
};
