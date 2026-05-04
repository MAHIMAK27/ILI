require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock DB connection for now (replace with actual Mongo URI in production)
/*
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
*/

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Mock authentication
  if (email && password) {
    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ token, user: { email, role: 'admin' } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/upload-data', upload.single('dataset'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Here we would normally forward this to the ML service or parse it
  console.log('File uploaded:', req.file.filename);
  
  // Mock response
  res.json({ 
    message: 'Data uploaded successfully. Processing initiated.',
    fileId: req.file.filename
  });
});

app.get('/api/dashboard', (req, res) => {
  // Mock dashboard data
  res.json({
    metrics: {
      totalCases: 12450,
      highRiskRegions: 4,
      avgPredictionScore: 64.2,
      modelAccuracy: 94.8
    },
    status: 'Operational'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
