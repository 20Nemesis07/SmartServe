const Booking = require('../models/Booking');
const Meal = require('../models/Meal');
const User = require('../models/User');

// Helper function to parse date string consistently
const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

// Helper function to get date range for a specific day
const getDateRange = (dateStr) => {
  if (!dateStr) return null;
  const startDate = parseDateString(dateStr);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  return { $gte: startDate, $lt: endDate };
};

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { mealId, date, mealType, quantity = 1, specialRequests } = req.body;

    // Check if meal exists
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    // Check if user already booked this meal
    const existingBooking = await Booking.findOne({
      studentId: req.userId,
      mealId: mealId
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'You have already booked this meal' });
    }

    // Create booking with consistent UTC date parsing
    const booking = await Booking.create({
      studentId: req.userId,
      mealId,
      date: parseDateString(date),
      mealType,
      quantity,
      specialRequests,
    });

    // Add booking to meal's bookings array
    await Meal.findByIdAndUpdate(mealId, {
      $push: { bookings: booking._id }
    });

    // Add booking to user's booking history
    await User.findByIdAndUpdate(req.userId, {
      $push: { bookingHistory: booking._id }
    });

    const populatedBooking = await booking.populate([
      { path: 'mealId' },
      { path: 'studentId', select: 'name email' }
    ]);

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for a student
exports.getStudentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.userId })
      .populate('mealId')
      .sort({ date: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (for mess staff)
exports.getAllBookings = async (req, res) => {
  try {
    const { date, status, skip = 0, limit = 1000 } = req.query;

    const filter = {};
    if (date) {
      filter.date = getDateRange(date);
    }
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('studentId', 'name email registrationNumber')
      .populate('mealId')
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({ success: true, bookings, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings by meal ID
exports.getBookingsByMeal = async (req, res) => {
  try {
    const bookings = await Booking.find({ mealId: req.params.mealId })
      .populate('studentId', 'name email registrationNumber')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if booking is still cancellable (within 24 hours of meal date)
    const mealDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilMeal = (mealDate - now) / (1000 * 60 * 60);

    if (hoursUntilMeal <= 0) {
      return res.status(400).json({ success: false, message: 'Cannot cancel booking as meal time has passed' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledAt: new Date() },
      { new: true }
    );

    // Remove from meal's bookings
    await Meal.findByIdAndUpdate(booking.mealId, {
      $pull: { bookings: booking._id }
    });

    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark booking as consumed
exports.markAsConsumed = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'consumed', consumedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings statistics for a date
exports.getBookingStats = async (req, res) => {
  try {
    const { date } = req.params;

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const bookings = await Booking.find({
      date: { $gte: startDate, $lt: endDate }
    });

    const stats = {
      totalBookings: bookings.length,
      bookedCount: bookings.filter(b => b.status === 'booked').length,
      consumedCount: bookings.filter(b => b.status === 'consumed').length,
      cancelledCount: bookings.filter(b => b.status === 'cancelled').length,
      noShowCount: bookings.filter(b => b.status === 'no-show').length,
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
