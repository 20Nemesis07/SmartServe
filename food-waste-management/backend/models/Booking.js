const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: true,
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'consumed', 'no-show'],
      default: 'booked',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    specialRequests: {
      type: String, // e.g., "Extra spicy", "Less oil"
    },
    cancelledAt: {
      type: Date,
    },
    consumedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Ensure a student cannot book the same meal twice
bookingSchema.index({ studentId: 1, mealId: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
