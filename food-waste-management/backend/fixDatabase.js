const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('Dropping unique index on registrationNumber...');
    const collection = mongoose.connection.collection('users');

    try {
      await collection.dropIndex('registrationNumber_1');
      console.log('✅ Index dropped successfully');
    } catch (err) {
      console.log('Index might not exist or already dropped:', err.message);
    }

    console.log('✅ Database fixed! You can now register without issues');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDatabase();
