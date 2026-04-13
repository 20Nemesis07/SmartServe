const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'all'],
    },
    totalMealsBooked: {
      type: Number,
      default: 0,
    },
    totalMealsPrepared: {
      type: Number,
      default: 0,
    },
    totalMealsConsumed: {
      type: Number,
      default: 0,
    },
    totalMealsWasted: {
      type: Number,
      default: 0,
    },
    wastePercentage: {
      type: Number, // (wasted / prepared) * 100
      default: 0,
    },
    foodDonatedToNGO: {
      type: Number,
      default: 0,
    },
    studentsPresent: {
      type: Number,
      default: 0,
    },
    studentsAbsent: {
      type: Number, // No-shows
      default: 0,
    },
    co2Saved: {
      type: Number, // kg equivalent
      default: 0,
    },
    averageWastePerMeal: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Analytics', analyticsSchema);
