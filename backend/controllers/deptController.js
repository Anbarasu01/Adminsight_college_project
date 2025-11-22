

const Department = require('../models/department');
const User = require('../models/User');

// ✅ Create Department
exports.createDepartment = async (req, res) => {
  try {
    // collector
    if ( req.user.role !== 'collector') {
      return res.status(403).json({ message: 'Forbidden: Only admin or collector can create departments' });
    }

    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Please provide both name and code' });
    }

    // Check if department already exists by code or name
    const existing = await Department.findOne({
      $or: [{ code }, { name }]
    });

    if (existing) {
      return res.status(400).json({ message: 'Department already exists with this name or code' });
    }

    // Create the department
    const dept = await Department.create({
      name,
      code,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department: dept
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ Get all departments
exports.getDepartments = async (req, res) => {
  try {
    if ( req.user.role !== 'collector') {
      return res.status(403).json({ message: 'Forbidden: Only admin or collector can view departments' });
    }

    const departments = await Department.find().populate('head', 'name email role');
    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Department (collector)
exports.updateDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'collector') {
      return res.status(403).json({ message: 'Forbidden: Only admin or collector can update departments' });
    }

    const { id } = req.params;
    const updated = await Department.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department updated successfully', department: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Department (collector)
exports.deleteDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'collector') {
      return res.status(403).json({ message: 'Forbidden: Only admin or collector can delete departments' });
    }

    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Assign Head to Department (admin or collector)
exports.assignHead = async (req, res) => {
  try {
    if (req.user.role !== 'collector') {
      return res.status(403).json({ message: 'Forbidden: Only admin or collector can assign head' });
    }

    const { departmentId, headId } = req.body;

    const dept = await Department.findById(departmentId);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    const user = await User.findById(headId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    dept.head = user._id;
    await dept.save();

    res.status(200).json({ success: true, message: 'Head assigned successfully', department: dept });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};