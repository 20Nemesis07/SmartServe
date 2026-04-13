const express = require('express');
const router = express.Router();
const {
  createBooking,
  getStudentBookings,
  getAllBookings,
  getBookingsByMeal,
  cancelBooking,
  markAsConsumed,
  getBookingStats
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Get student's bookings
router.get('/my-bookings', auth, authRole('student'), getStudentBookings);

// Get all bookings (Mess Staff)
router.get('/', auth, authRole('mess_staff', 'admin'), getAllBookings);

// Get bookings for a specific meal
router.get('/meal/:mealId', auth, authRole('mess_staff', 'admin'), getBookingsByMeal);

// Get booking statistics for a date
router.get('/stats/:date', auth, authRole('mess_staff', 'admin'), getBookingStats);

// Create a booking
router.post('/', auth, authRole('student'), createBooking);

// Cancel a booking
router.put('/:id/cancel', auth, authRole('student'), cancelBooking);

// Mark booking as consumed
router.put('/:id/consumed', auth, authRole('mess_staff', 'admin'), markAsConsumed);

module.exports = router;
