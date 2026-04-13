const mongoose = require('mongoose');

const foodSurplusSchema = new mongoose.Schema(
  {
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: false,
      sparse: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
    },
    description: {
      type: String,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'disposed', 'donated'],
      default: 'available',
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
    },
    claimedAt: {
      type: Date,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
    },
    notes: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('FoodSurplus', foodSurplusSchema);
