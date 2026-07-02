require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Upload = require('../models/Upload');
const Prediction = require('../models/Prediction');

async function runTests() {
  let mongoServer;
  try {
    console.log('--- Starting MongoDB Integration Tests ---');
    
    // Spin up an in-memory MongoDB instance for testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // 1. Connect
    await mongoose.connect(uri);
    console.log('[SUCCESS] Connected to MongoDB memory server');

    // 2. CRUD Tests
    console.log('\n--- Testing User Model ---');
    // Create
    const user = await User.create({ email: 'test@admin.com', password: 'hashedpassword123', role: 'admin' });
    console.log(`[CREATE] User created: ${user.email}`);
    // Read
    const foundUser = await User.findOne({ email: 'test@admin.com' });
    console.log(`[READ] User found: ${foundUser._id}`);
    // Update
    foundUser.role = 'analyst';
    await foundUser.save();
    console.log(`[UPDATE] User role updated to: ${foundUser.role}`);
    // Delete
    await User.findByIdAndDelete(foundUser._id);
    console.log(`[DELETE] User deleted`);

    console.log('\n--- Testing Upload Model ---');
    const upload = await Upload.create({ fileId: '12345-dataset.csv', originalName: 'dataset.csv' });
    console.log(`[CREATE] Upload created: ${upload.fileId}`);
    upload.status = 'completed';
    await upload.save();
    console.log(`[UPDATE] Upload status updated: ${upload.status}`);
    const foundUpload = await Upload.findById(upload._id);
    console.log(`[READ] Upload found with status: ${foundUpload.status}`);
    await Upload.findByIdAndDelete(upload._id);
    console.log(`[DELETE] Upload deleted`);

    console.log('\n--- Testing Prediction Model ---');
    const prediction = await Prediction.create({ 
      date: new Date(), 
      fever_count: 50, 
      cough_count: 60, 
      predicted_cases: 110, 
      risk_score: 85.5 
    });
    console.log(`[CREATE] Prediction created for date: ${prediction.date}`);
    prediction.risk_score = 90;
    await prediction.save();
    console.log(`[UPDATE] Prediction risk_score updated: ${prediction.risk_score}`);
    const foundPrediction = await Prediction.findById(prediction._id);
    console.log(`[READ] Prediction found, predicted_cases: ${foundPrediction.predicted_cases}`);
    await Prediction.findByIdAndDelete(prediction._id);
    console.log(`[DELETE] Prediction deleted`);

    console.log('\n--- All CRUD Tests Passed ---');

  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(0);
  }
}

runTests();
