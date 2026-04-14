const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide meal name'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    baseQuantity: {
      type: Number, // Expected number of students
      default: 0,
    },
    actualQuantityPrepared: {
      type: Number,
      default: 0,
    },
    actualQuantityConsumed: {
      type: Number,
      default: 0,
    },
    markPrice: {
      type: Number,
      default: 0, // Price if meal is paid
    },
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    ingredients: [String],
    vegetarian: {
      type: Boolean,
      default: false,
    },
    vegan: {
      type: Boolean,
      default: false,
    },
    glutenFree: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String, // URL to meal image
    },
    preparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Booking',
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'prepared', 'served', 'completed'],
      default: 'scheduled',
    },
    wasteQuantity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('Meal', mealSchema);
