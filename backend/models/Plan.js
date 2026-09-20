// models/Plan.js
// Mongoose schema for membership plans (Monthly, Quarterly, Yearly).

const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // Only allow these three plan names
      enum: ['Monthly', 'Quarterly', 'Yearly'],
      unique: true,
    },
    durationInDays: {
      type: Number,
      required: true,
      // Monthly = 30 days, Quarterly = 90 days, Yearly = 365 days
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);
