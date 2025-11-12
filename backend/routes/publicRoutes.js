const express = require('express');
const router = express.Router();
const {
  submitProblem,
  getProblems,
  getProblem,
  updateProblemStatus
} = require('../controllers/publicController');

// Public routes
router.post('/submit', submitProblem);         // Submit a new problem
router.get('/all_problems', getProblems);                  // Get all problems
router.get('/:id', getProblem);               // Get a single problem
router.put('/:id/status', updateProblemStatus); // Update problem status

// Catch-all for undefined routes in this router
router.all(/.*/, (req, res) => {
  res.status(404).json({ message: 'Route not found in public router' });
});

module.exports = router;
