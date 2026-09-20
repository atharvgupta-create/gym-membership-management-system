// server.js
// The main entry point of the Express backend server.
// This file: loads env variables, connects to DB, sets up middleware, and registers routes.

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file BEFORE anything else
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────

// CORS: Allows our React frontend (running on port 5173) to call this API
// Without this, the browser would block cross-origin requests
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Parse incoming JSON request bodies (so req.body works in routes)
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/plans', require('./routes/plans'));

// ── Health Check ──────────────────────────────────────────────────────────────
// Simple route to confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: '🏋️ Gym Management API is running!' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
