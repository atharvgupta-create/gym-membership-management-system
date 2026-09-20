// routes/members.js
// Full CRUD routes for gym members.
// All routes are protected — admin must be logged in.

const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Plan = require('../models/Plan');
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: calculateExpiryDate
// Given a start date and plan name, calculates the expiry date.
// ─────────────────────────────────────────────────────────────────────────────
const planDurations = { Monthly: 30, Quarterly: 90, Yearly: 365 };

const calculateExpiryDate = (startDate, planName) => {
  const days = planDurations[planName];
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/members
// Returns all members. Supports search by ?q=searchTerm
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      // Case-insensitive search across name, email, and phone
      query = {
        $or: [
          { fullName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const members = await Member.find(query).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/members/stats
// Returns dashboard statistics: total, active, expired, paid, unpaid counts.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/stats', protect, async (req, res) => {
  try {
    const now = new Date();
    const total = await Member.countDocuments();
    const active = await Member.countDocuments({ membershipExpiryDate: { $gte: now } });
    const expired = await Member.countDocuments({ membershipExpiryDate: { $lt: now } });
    const paid = await Member.countDocuments({ paymentStatus: 'Paid' });
    const unpaid = await Member.countDocuments({ paymentStatus: 'Not Paid' });

    res.json({ total, active, expired, paid, unpaid });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/members/:id
// Returns a single member by their MongoDB ID.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/members
// Adds a new gym member. Automatically calculates expiry date from plan.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const {
      fullName, age, gender, phone, email,
      joiningDate, membershipPlan, membershipStartDate, paymentStatus,
    } = req.body;

    // Auto-calculate expiry date so admin doesn't have to enter it manually
    const membershipExpiryDate = calculateExpiryDate(membershipStartDate, membershipPlan);

    const member = await Member.create({
      fullName, age, gender, phone, email,
      joiningDate, membershipPlan, membershipStartDate,
      membershipExpiryDate,
      paymentStatus: paymentStatus || 'Not Paid',
    });

    res.status(201).json(member);
  } catch (error) {
    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A member with this email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/members/:id
// Updates member details. Recalculates expiry date if plan changes.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    // If plan or start date is being updated, recalculate expiry
    if (req.body.membershipPlan || req.body.membershipStartDate) {
      const existing = await Member.findById(req.params.id);
      const plan = req.body.membershipPlan || existing.membershipPlan;
      const startDate = req.body.membershipStartDate || existing.membershipStartDate;
      req.body.membershipExpiryDate = calculateExpiryDate(startDate, plan);
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/members/:id/payment
// Toggles the payment status between "Paid" and "Not Paid".
// This is separate from the full update to make it a simple one-click action.
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id/payment', protect, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/members/:id
// Permanently deletes a member from the database.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
