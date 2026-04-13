require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI?.substring(0, 60) + '...');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  mongoose.connection.close();
  process.exit(0);
})
.catch((err) => {
  console.log('❌ MongoDB connection failed:');
  console.log(err.message);
  process.exit(1);
});
