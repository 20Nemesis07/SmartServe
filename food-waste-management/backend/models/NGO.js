const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide NGO name'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    website: {
      type: String,
    },
    contactPerson: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    foodCollected: {
      type: Number, // in kg or units
      default: 0,
    },
    beneficiaries: {
      type: Number, // Number of people served
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    foodSurplusCollected: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'FoodSurplus',
      default: [],
    },
    documents: {
      registrationCertificate: String,
      taxCertificate: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Hash password before saving
ngoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('NGO', ngoSchema);
