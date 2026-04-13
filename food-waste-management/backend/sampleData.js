// Sample data for testing
// Run this after setting up the database

const sampleMeals = [
  {
    name: "Biryani with Raita",
    description: "Fragrant rice dish with meat and yogurt",
    mealType: "lunch",
    baseQuantity: 500,
    markPrice: 80,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 15
    },
    ingredients: ["rice", "meat", "yogurt", "spices"]
  },
  {
    name: "Paneer Tikka Masala",
    description: "Creamy paneer curry with Indian spices",
    mealType: "dinner",
    baseQuantity: 400,
    markPrice: 100,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 30,
      fat: 18
    },
    ingredients: ["paneer", "tomato", "cream", "spices"]
  },
  {
    name: "Paratha with Curd",
    description: "Traditional wheat bread with yogurt",
    mealType: "breakfast",
    baseQuantity: 600,
    markPrice: 40,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    nutrition: {
      calories: 280,
      protein: 10,
      carbs: 45,
      fat: 8
    },
    ingredients: ["wheat flour", "curd", "butter", "salt"]
  },
  {
    name: "Dal Makhani",
    description: "Creamy lentil curry - vegan delight",
    mealType: "lunch",
    baseQuantity: 450,
    markPrice: 70,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 40,
      fat: 12
    },
    ingredients: ["dal", "tomato", "coconut milk", "spices"]
  },
  {
    name: "Omelette with Toast",
    description: "Protein-rich breakfast option",
    mealType: "breakfast",
    baseQuantity: 550,
    markPrice: 45,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    nutrition: {
      calories: 300,
      protein: 18,
      carbs: 35,
      fat: 11
    },
    ingredients: ["eggs", "bread", "butter", "salt"]
  },
  {
    name: "Vegetable Stir Fry",
    description: "Fresh vegetables with soy sauce",
    mealType: "dinner",
    baseQuantity: 380,
    markPrice: 60,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    nutrition: {
      calories: 200,
      protein: 8,
      carbs: 25,
      fat: 8
    },
    ingredients: ["broccoli", "carrots", "bell peppers", "soy sauce"]
  }
];

const sampleUsers = [
  {
    name: "Rahul Kumar",
    email: "student@test.com",
    password: "password123",
    role: "student",
    phone: "+919876543210",
    registrationNumber: "2023001",
    department: "CSE"
  },
  {
    name: "Priya Singh",
    email: "mess@test.com",
    password: "password123",
    role: "mess_staff",
    phone: "+919876543211"
  },
  {
    name: "Amit Patel",
    email: "ngo@test.com",
    password: "password123",
    role: "ngo_admin",
    phone: "+919876543212"
  }
];

const sampleNGOs = [
  {
    name: "Food for All Foundation",
    email: "foodforall@ngo.com",
    phone: "+919999999999",
    address: "123 Main Street",
    city: "Bangalore",
    description: "We work to eliminate food insecurity",
    contactPerson: "Mr. John Doe",
    isVerified: true,
    beneficiaries: 500
  },
  {
    name: "Community Care Initiative",
    email: "communitycare@ngo.com",
    phone: "+919999999998",
    address: "456 Oak Avenue",
    city: "Bangalore",
    description: "Serving the community with love",
    contactPerson: "Ms. Jane Smith",
    isVerified: true,
    beneficiaries: 300
  }
];

module.exports = {
  sampleMeals,
  sampleUsers,
  sampleNGOs
};

// To seed database, create a script like this:
/*
const mongoose = require('mongoose');
const User = require('./models/User');
const Meal = require('./models/Meal');
const NGO = require('./models/NGO');
const { sampleUsers, sampleMeals, sampleNGOs } = require('./sampleData');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany({});
    await Meal.deleteMany({});
    await NGO.deleteMany({});

    // Insert sample data
    await User.insertMany(sampleUsers);
    await Meal.insertMany(sampleMeals);
    await NGO.insertMany(sampleNGOs);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
*/
