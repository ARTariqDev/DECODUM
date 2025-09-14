// scripts/reset-timers.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

async function resetTimers() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


  // Use the Login collection and reset timeStarted and timeEnded
  const Login = mongoose.model('Login', new mongoose.Schema({}, { strict: false, collection: 'logins' }));
  const result = await Login.updateMany({}, { $set: { timeStarted: null, timeEnded: null } });
  console.log(`Timers reset for ${result.modifiedCount} users (Login collection).`);

  await mongoose.disconnect();
}

resetTimers().catch(err => {
  console.error('Error resetting timers:', err);
  process.exit(1);
});
