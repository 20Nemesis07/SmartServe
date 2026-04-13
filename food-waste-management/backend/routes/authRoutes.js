const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', auth, getCurrentUser);

// Update profile
router.put('/profile', auth, updateProfile);

// Logout
router.post('/logout', logout);

module.exports = router;
