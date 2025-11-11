

const Department = require('../models/department');
const User = require('../models/User');

// ✅ Create Department
exports.createDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, description } = req.body;

    const existing = await Department.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Department already exists' });

    const dept = await Department.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Department created successfully', dept });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all departments
exports.getDepartments = async (req, res) => {
  const depts = await Department.find().populate('createdBy', 'name email');
  res.json(depts);
};

// ✅ Update Department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Department.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department updated', department: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Assign Head
exports.assignHead = async (req, res) => {
  try {
    const { deptId, headId } = req.body;
    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const headUser = await User.findById(headId);
    if (!headUser) return res.status(404).json({ message: 'User not found' });

    department.head = headUser._id;
    await department.save();

    res.json({ message: 'Head assigned successfully', department });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

