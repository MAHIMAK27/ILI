require('dotenv').config();
const mongoose = require('mongoose');
const Prediction = require('./src/models/Prediction');

async function verify() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Prediction.countDocuments({});
  console.log("Total predictions in database:", count);
  const sample = await Prediction.find({}).limit(2);
  console.log("Sample predictions:", JSON.stringify(sample, null, 2));
  process.exit(0);
}

verify();
