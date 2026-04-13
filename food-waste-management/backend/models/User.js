const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Password won't be returned by default
    },
    role: {
      type: String,
      enum: ['student', 'mess_staff', 'ngo_admin', 'admin'],
      default: 'student',
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    registrationNumber: {
      type: String, // For students only
      default: null,
      sparse: true,
    },
    department: {
      type: String, // e.g., CSE, ECE, etc.
    },
    dietaryPreferences: {
      type: [String], // ['vegan', 'gluten-free', 'vegetarian']
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    points: {
      type: Number,
      default: 0, // For gamification
    },
    bookingHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Booking',
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
