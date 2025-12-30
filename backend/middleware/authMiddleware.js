const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PublicUser = require('../models/PublicUser'); // Import PublicUser

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('🔍 Auth Middleware - Token decoded:', {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      });

      let user;
      
      // Check user type based on role in token
      if (decoded.role === 'public') {
        // Get public user
        user = await PublicUser.findById(decoded.id).select('-password');
        console.log('👤 Looking for PUBLIC user with ID:', decoded.id);
      } else {
        // Get regular user (staff, collector, departmentHead, admin)
        user = await User.findById(decoded.id).select('-password');
        console.log('👤 Looking for REGULAR user with ID:', decoded.id);
      }

      if (!user) {
        console.log('❌ User not found in database');
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ User found:', {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.firstName || user.name
      });

      req.user = user;
      next();
    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

module.exports = { protect, authorize };