const express = require('express');
const router = express.Router();
const {
  registerNGO,
  loginNGO,
  getNGOProfile,
  getAvailableFood,
  claimFood,
  getClaimedFood,
  updateNGOProfile
} = require('../controllers/ngoController');
const ngoAuth = require('../middleware/ngoAuth');

// Public routes
router.post('/register', registerNGO);
router.post('/login', loginNGO);

// Protected routes
router.get('/profile', ngoAuth, getNGOProfile);
router.put('/profile', ngoAuth, updateNGOProfile);
router.get('/available-food', ngoAuth, getAvailableFood);
router.post('/claim-food', ngoAuth, claimFood);
router.get('/claimed-food', ngoAuth, getClaimedFood);

module.exports = router;
