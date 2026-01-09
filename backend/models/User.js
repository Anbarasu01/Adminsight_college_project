const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // ✅ Auto-generated unique user ID
    uniqueId: {
      type: String,
      unique: true,
      default: () => `USR-${Date.now()}`
    },

    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ['public', 'collector', 'department_head', 'staff'],
      default: 'public'
    },

    phone: {
      type: String,
      trim: true
    },

    // ✅ ADD THIS FIELD - For staff and collector roles
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },

    // Used only if role = department_head
    managesDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

//////////////////////////////////////////////////////
// 🔐 Hash password before saving
//////////////////////////////////////////////////////
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//////////////////////////////////////////////////////
// 🔑 Compare password
//////////////////////////////////////////////////////
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//////////////////////////////////////////////////////
// 📊 Count users by role and date
//////////////////////////////////////////////////////
userSchema.statics.countByRoleAndDate = async function (role, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return this.countDocuments({
    role,
    createdAt: { $gte: start, $lte: end }
  });
};

module.exports = mongoose.model('User', userSchema);