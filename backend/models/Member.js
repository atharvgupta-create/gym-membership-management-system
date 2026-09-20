// models/Member.js
// Mongoose schema for gym members — the main collection in the database.

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,      // Removes leading/trailing whitespace
    },
    age: {
      type: Number,
      required: true,
      min: 5,
      max: 100,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,    // Each member must have a unique email
      trim: true,
      lowercase: true, // Stores email in lowercase for consistency
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to today if not provided
    },
    membershipPlan: {
      type: String,
      required: true,
      enum: ['Monthly', 'Quarterly', 'Yearly'],
    },
    membershipStartDate: {
      type: Date,
      required: true,
    },
    membershipExpiryDate: {
      type: Date,
      required: true, // Calculated automatically based on plan
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Paid', 'Not Paid'],
      default: 'Not Paid',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Member', memberSchema);
