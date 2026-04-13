const FoodSurplus = require('../models/FoodSurplus');
const Meal = require('../models/Meal');

// Report food surplus
exports.reportFoodSurplus = async (req, res) => {
  try {
    const { mealId, quantity, description, date } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid quantity' });
    }

    // If mealId is provided, check if meal exists
    if (mealId) {
      const meal = await Meal.findById(mealId);
      if (!meal) {
        return res.status(404).json({ success: false, message: 'Meal not found' });
      }
    }

    // Create food surplus record
    const foodSurplus = await FoodSurplus.create({
      mealId: mealId || null, // Allow null for manually added food
      quantity,
      description: description || '',
      reportedBy: req.userId,
      date: date || new Date(),
      status: 'available',
    });

    // Populate the response
    await foodSurplus.populate('mealId', 'name description mealType baseQuantity');
    await foodSurplus.populate('reportedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Food surplus reported successfully',
      foodSurplus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all food surplus
exports.getAllFoodSurplus = async (req, res) => {
  try {
    const foodSurplus = await FoodSurplus.find()
      .populate('mealId', 'name description mealType baseQuantity')
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email');

    res.status(200).json({
      success: true,
      count: foodSurplus.length,
      foodSurplus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available food surplus
exports.getAvailableFoodSurplus = async (req, res) => {
  try {
    const foodSurplus = await FoodSurplus.find({ status: 'available' })
      .populate('mealId', 'name description mealType baseQuantity')
      .populate('reportedBy', 'name email');

    res.status(200).json({
      success: true,
      count: foodSurplus.length,
      foodSurplus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get food surplus by ID
exports.getFoodSurplusById = async (req, res) => {
  try {
    const foodSurplus = await FoodSurplus.findById(req.params.id)
      .populate('mealId')
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email');

    if (!foodSurplus) {
      return res.status(404).json({ success: false, message: 'Food surplus not found' });
    }

    res.status(200).json({ success: true, foodSurplus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update food surplus status
exports.updateFoodSurplusStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const foodSurplus = await FoodSurplus.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('mealId').populate('reportedBy', 'name email').populate('claimedBy', 'name email');

    if (!foodSurplus) {
      return res.status(404).json({ success: false, message: 'Food surplus not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Food surplus status updated',
      foodSurplus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete food surplus
exports.deleteFoodSurplus = async (req, res) => {
  try {
    const foodSurplus = await FoodSurplus.findByIdAndDelete(req.params.id);

    if (!foodSurplus) {
      return res.status(404).json({ success: false, message: 'Food surplus not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Food surplus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
