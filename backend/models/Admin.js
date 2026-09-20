// models/Admin.js
// Mongoose schema for the admin user who manages the gym system.

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,    // No two admins with the same username
      trim: true,
    },
    password: {
      type: String,
      required: true,  // Stored as a bcrypt hash, never plain text
    },
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Admin model
// Mongoose will create a collection named "admins" in MongoDB
module.exports = mongoose.model('Admin', adminSchema);
