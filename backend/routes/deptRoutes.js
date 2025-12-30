// routes/deptRoutes.js - COMPLETE WORKING VERSION
const express = require('express');
const router = express.Router();
const Department = require('../models/department');

// ✅ GET ALL DEPARTMENTS
// GET /api/departments
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all departments...');
    
    const departments = await Department.find({});
    
    console.log(`✅ Found ${departments.length} departments`);
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
    
  } catch (error) {
    console.error('❌ Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching departments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ GET SINGLE DEPARTMENT
// GET /api/departments/:id
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: department
    });
    
  } catch (error) {
    console.error('❌ Error fetching department:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ CREATE DEPARTMENT
// POST /api/departments
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating department with data:', req.body);
    
    const { name, code } = req.body;
    
    // Basic validation
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both name and code for the department'
      });
    }
    
    // Check if department already exists
    const existingDept = await Department.findOne({ 
      $or: [{ name }, { code: code.toUpperCase() }] 
    });
    
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: `Department with ${existingDept.name === name ? 'name' : 'code'} already exists`
      });
    }
    
    // Create department
    const department = await Department.create({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      description: req.body.description || '',
      location: req.body.location || '',
      contactEmail: req.body.contactEmail || '',
      contactPhone: req.body.contactPhone || ''
    });
    
    console.log('✅ Department created:', department._id);
    
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
    
  } catch (error) {
    console.error('❌ Error creating department:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating department',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ UPDATE DEPARTMENT
// PUT /api/departments/:id
router.put('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
    
  } catch (error) {
    console.error('❌ Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ✅ DELETE DEPARTMENT
// DELETE /api/departments/:id
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;