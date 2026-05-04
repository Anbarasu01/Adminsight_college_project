const express = require("express");
const router = express.Router();
const Problem = require("../models/publicproblems");

// ✅ GET problems by department ID
// GET /api/problems/department/:departmentId
// routes/problemRoutes.js
router.get("/department/:departmentId", async (req, res) => {
  try {
    const problems = await Problem.find({
      department: req.params.departmentId,
    }).populate("department");

    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;