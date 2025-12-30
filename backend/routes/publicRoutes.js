const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');

// DEBUG (TEMPORARY)
console.log('publicController:', publicController);

router.post('/register', publicController.registerPublicUser);
router.post('/login', publicController.loginPublicUser);
router.get('/profile', publicController.getPublicProfile);

module.exports = router;
