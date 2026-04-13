const express = require('express');
const router = express.Router();
const {
  reportFoodSurplus,
  getAllFoodSurplus,
  getAvailableFoodSurplus,
  getFoodSurplusById,
  updateFoodSurplusStatus,
  deleteFoodSurplus
} = require('../controllers/foodSurplusController');
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');

// Get all food surplus
router.get('/', getAllFoodSurplus);

// Get available food surplus (public access for NGO)
router.get('/available', getAvailableFoodSurplus);

// Get food surplus by ID
router.get('/:id', getFoodSurplusById);

// Report food surplus (Mess Staff only)
router.post('/', auth, authRole('mess_staff', 'admin'), reportFoodSurplus);

// Update food surplus status (Mess Staff only)
router.put('/:id', auth, authRole('mess_staff', 'admin'), updateFoodSurplusStatus);

// Delete food surplus (Mess Staff only)
router.delete('/:id', auth, authRole('mess_staff', 'admin'), deleteFoodSurplus);

module.exports = router;
