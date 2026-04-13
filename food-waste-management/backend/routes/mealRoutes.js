const express = require('express');
const router = express.Router();
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getMealsForDate,
  updateMealStats
} = require('../controllers/mealController');
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Get all meals
router.get('/', getMeals);

// Get meals for specific date
router.get('/date/:date', getMealsForDate);

// Get meal by ID
router.get('/:id', getMealById);

// Create meal (Mess Staff only)
router.post('/', auth, authRole('mess_staff', 'admin'), createMeal);

// Update meal (Mess Staff only)
router.put('/:id', auth, authRole('mess_staff', 'admin'), updateMeal);

// Update meal stats (Mess Staff only)
router.put('/:id/stats', auth, authRole('mess_staff', 'admin'), updateMealStats);

// Delete meal (Mess Staff only)
router.delete('/:id', auth, authRole('mess_staff', 'admin'), deleteMeal);

module.exports = router;
