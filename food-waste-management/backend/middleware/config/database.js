const mongoose = require('mongoose');

let retryCount = 0;
const maxRetries = 5;

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-waste-management';

    console.log('🔄 Attempting to connect to MongoDB...');

    // For development, use relaxed SSL settings
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    // Add SSL options if using MongoDB Atlas (mongodb+srv)
    if (MONGODB_URI.includes('mongodb+srv')) {
      mongoOptions.ssl = true;
      mongoOptions.retryWrites = true;
      mongoOptions.w = 'majority';

      // For development environment, you can disable certificate validation
      // WARNING: Not recommended for production!
      if (process.env.NODE_ENV === 'development') {
        mongoOptions.tlsAllowInvalidCertificates = true;
        mongoOptions.tlsAllowInvalidHostnames = true;
      }
    }

    const conn = await mongoose.connect(MONGODB_URI, mongoOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; // Reset retry count on successful connection
    return conn;
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);

    if (retryCount < maxRetries) {
      retryCount++;
      const waitTime = Math.min(3000 * (retryCount + 1), 15000); // Exponential backoff
      console.log(`🔄 Retry ${retryCount}/${maxRetries} in ${waitTime / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return connectDB();
    } else {
      console.error('❌ Max retries reached. MongoDB connection failed.');
      console.error('\n⚠️ Troubleshooting:');
      console.error('1. Check your internet connection');
      console.error('2. Verify MongoDB Atlas IP whitelist includes your IP');
      console.error('3. Check .env MONGODB_URI is correct');
      console.error('4. Try: npx mongodb-atlas-cli auth login');
      process.exit(1);
    }
  }
};

module.exports = connectDB;

