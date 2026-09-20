// One-time script to create the admin account in MongoDB
// Run with: node createAdmin.js

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  const existing = await Admin.findOne({ username: 'admin' });
  if (existing) {
    console.log('⚠️  Admin already exists. No action taken.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 10);
  await Admin.create({ username: 'admin', password: hashed });
  console.log('✅ Admin created! Username: admin | Password: admin123');
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
