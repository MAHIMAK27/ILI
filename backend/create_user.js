require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ email: 'admin@ili.com' });
  if (!user) {
    user = await User.create({ email: 'admin@ili.com', password: 'Password123!', role: 'admin' });
    console.log("Created admin@ili.com");
  } else {
    console.log("User exists");
  }
  process.exit(0);
}

createUser();
