const Meal = require('../models/Meal');
const Booking = require('../models/Booking');

// Helper function to parse date string (YYYY-MM-DD) to start of day UTC
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

// Create a new meal (Mess Staff)
exports.createMeal = async (req, res) => {
  try {
    const { name, description, mealType, date, baseQuantity, markPrice, nutrition, ingredients, vegetarian, vegan, glutenFree } = req.body;

    const meal = await Meal.create({
      name,
      description,
      mealType,
      date: parseDateString(date),
      baseQuantity,
      markPrice,
      nutrition,
      ingredients,
      vegetarian,
      vegan,
      glutenFree,
      preparedBy: req.userId,
    });

    res.status(201).json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all meals
exports.getMeals = async (req, res) => {
  try {
    const { date, mealType, skip = 0, limit = 10 } = req.query;

    const filter = {};
    if (date) filter.date = getDateRange(date);
    if (mealType) filter.mealType = mealType;

    const meals = await Meal.find(filter)
      .populate('bookings')
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ date: 1 });

    const total = await Meal.countDocuments(filter);

    res.status(200).json({ success: true, meals, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
};

// Get meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('bookings').populate('preparedBy', { select: 'name' });

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    res.status(200).json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update meal
exports.updateMeal = async (req, res) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    res.status(200).json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get meals for a specific date
exports.getMealsForDate = async (req, res) => {
  try {
    const { date } = req.params;
    const dateRange = getDateRange(date);

    const meals = await Meal.find({
      date: dateRange
    }).populate('bookings');

    res.status(200).json({ success: true, meals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update meal quantity and waste
exports.updateMealStats = async (req, res) => {
  try {
    const { actualQuantityPrepared, actualQuantityConsumed } = req.body;

    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      {
        actualQuantityPrepared,
        actualQuantityConsumed,
        wasteQuantity: actualQuantityPrepared - actualQuantityConsumed,
        status: 'completed'
      },
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    res.status(200).json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
