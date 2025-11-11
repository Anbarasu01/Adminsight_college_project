const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true,select: false,  minlength: 6 },
  role: { 
    type: String, 
    enum: ['public', 'collector', 'admin', 'department_head', 'staff'], 
    default: 'public' 
  },
  phone: String,

  // ✅ The department this user belongs to (staff/collector)
  department_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    default: null 
  },

  // ✅ Only used when role = 'department_head'
  // shows which department this person manages
  managesDepartment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    default: null 
  },
  uniqueId: { type: String, unique: true },

}, { timestamps: true });


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
