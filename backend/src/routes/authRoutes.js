const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

const router = express.Router();

// --- Validation Helpers ---
const isValidEmail = (email) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
const isStrongPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

// --- Registration ---
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, contain 1 uppercase letter, and 1 number.' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const newUser = new User({ 
      email, 
      password, 
      role: role || 'analyst' 
    });

    await newUser.save();

    // Do not return password
    res.status(201).json({ 
      message: 'User registered successfully.',
      user: { id: newUser._id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    next(error);
  }
});

// --- Login ---
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
