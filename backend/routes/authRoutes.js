// const express = require('express');
// const router = express.Router();
// const { 
//   registerUser, 
//   login, 
//   getMe, 
//   updateProfile, 
//   updatePassword 
// } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', login);

// // Protected routes
// router.get('/me', protect, getMe);
// router.put('/update-profile', protect, updateProfile);
// router.put('/update-password', protect, updatePassword);

// // Catch-all for `router` package
// router.all(/.*/, (req, res) => {
//   res.status(404).json({ message: 'Route not found in auth router' });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  login, 
  getMe, 
  updateProfile, 
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;