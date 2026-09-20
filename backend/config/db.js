// config/db.js
// This file handles the MongoDB Atlas database connection using Mongoose.

const mongoose = require('mongoose');

/**
 * connectDB - Connects to MongoDB Atlas using the URI stored in .env
 * We use async/await to handle the asynchronous connection process.
 * If connection fails, we log the error and exit the process.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // If successful, log the host name of the connected cluster
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB;
