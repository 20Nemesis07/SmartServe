const NGO = require('../models/NGO');
const FoodSurplus = require('../models/FoodSurplus');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register NGO
exports.registerNGO = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, description, contactPerson } = req.body;

    // Check if NGO already exists
    let ngo = await NGO.findOne({ email });
    if (ngo) {
      return res.status(400).json({ success: false, message: 'NGO already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create NGO
   ngo = await NGO.create({
  name,
  email,
  password: hashedPassword,
  phone,
  address,
  city,
  description,
  contactPerson,
  isVerified: false,
});

    // Remove password from response
    const ngoResponse = ngo.toObject();
    delete ngoResponse.password;

    // Generate token
    const token = generateToken(ngo._id, 'ngo_member');

    res.status(201).json({
      success: true,
      token,
      ngo: ngoResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login NGO
exports.loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find NGO
    const ngo = await NGO.findOne({ email }).select('+password');
    if (!ngo) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(ngo._id, 'ngo_member');

    // Remove password from response
    const ngoResponse = ngo.toObject();
    delete ngoResponse.password;

    res.status(200).json({
      success: true,
      token,
      ngo: ngoResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get NGO Profile
exports.getNGOProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.ngoId);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    res.status(200).json({ success: true, ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Available Food for NGO
exports.getAvailableFood = async (req, res) => {
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

// Claim Food for NGO
exports.claimFood = async (req, res) => {
  try {
    const { foodSurplusId, notes } = req.body;

    const foodSurplus = await FoodSurplus.findById(foodSurplusId);
    if (!foodSurplus) {
      return res.status(404).json({ success: false, message: 'Food surplus not found' });
    }

    if (foodSurplus.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Food is no longer available' });
    }

    // Update food surplus
    foodSurplus.status = 'claimed';
    foodSurplus.claimedAt = new Date();
    foodSurplus.claimedBy = req.ngoId;
    foodSurplus.ngoId = req.ngoId;
    if (notes) {
      foodSurplus.notes = notes;
    }
    await foodSurplus.save();

    // Update NGO's collected food
    const ngo = await NGO.findById(req.ngoId);
    ngo.foodCollected = (ngo.foodCollected || 0) + foodSurplus.quantity;
    ngo.foodSurplusCollected.push(foodSurplusId);
    await ngo.save();

    res.status(200).json({
      success: true,
      message: 'Food claimed successfully',
      foodSurplus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get NGO's Claimed Food
exports.getClaimedFood = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.ngoId).populate('foodSurplusCollected');
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    res.status(200).json({
      success: true,
      foodCollected: ngo.foodSurplusCollected,
      totalQuantity: ngo.foodCollected
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update NGO Profile
exports.updateNGOProfile = async (req, res) => {
  try {
    const { name, phone, description, beneficiaries, contactPerson } = req.body;

    const ngo = await NGO.findByIdAndUpdate(
      req.ngoId,
      { name, phone, description, beneficiaries, contactPerson },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
