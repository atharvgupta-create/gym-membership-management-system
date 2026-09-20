// routes/plans.js
// CRUD routes for the three membership plans (Monthly, Quarterly, Yearly).
// Protected — only a logged-in admin can access these.

const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/plans
// Returns all membership plans from the database.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/plans
// Creates a new membership plan.
// Body: { name, durationInDays, price }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { name, durationInDays, price } = req.body;
    const plan = await Plan.create({ name, durationInDays, price });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/plans/:id
// Updates an existing plan's price or duration.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc & run schema validators
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
