// routes/auth.js
// Handles admin login and (optionally) admin registration for first-time setup.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Helper: generateToken
 * Creates a signed JWT token containing the admin's ID.
 * The token expires in 7 days.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Admin login — checks username and password, returns a JWT token on success.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find the admin by username in the database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 2. Compare the submitted password with the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 3. If credentials match, generate and return a token
    res.json({
      message: 'Login successful',
      token: generateToken(admin._id),
      username: admin.username,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// One-time admin account creation. In production you'd remove or guard this.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if an admin already exists (we only need one)
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving (saltRounds = 10 is a good default)
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ username, password: hashedPassword });

    res.status(201).json({
      message: 'Admin created successfully',
      token: generateToken(admin._id),
      username: admin.username,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
