// src/pages/Plans.jsx
// Displays the three membership plans (Monthly, Quarterly, Yearly).
// Admin can create plans (first time) and update price/duration.

import { useState, useEffect } from 'react';
import api from '../api/axios';

// The three fixed plan names — we seed these if they don't exist
const PLAN_NAMES = ['Monthly', 'Quarterly', 'Yearly'];
const PLAN_DURATIONS = { Monthly: 30, Quarterly: 90, Yearly: 365 };
const PLAN_COLORS = { Monthly: '', Quarterly: 'quarterly', Yearly: 'yearly' };

function Plans() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Local edit state: { planId: { price, durationInDays } }
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data);

      // Pre-fill edit inputs with current values
      const initial = {};
      res.data.forEach((p) => {
        initial[p._id] = { price: p.price, durationInDays: p.durationInDays };
      });
      setEditData(initial);
    } catch (err) {
      setError('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  // Create a plan that doesn't exist yet (first-time setup)
  const handleCreate = async (name) => {
    const price = prompt(`Enter price for ${name} plan (₹):`);
    if (!price || isNaN(price)) return;

    try {
      const res = await api.post('/plans', {
        name,
        durationInDays: PLAN_DURATIONS[name],
        price: Number(price),
      });
      setSuccess(`${name} plan created!`);
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan.');
    }
  };

  // Update an existing plan
  const handleUpdate = async (planId) => {
    const data = editData[planId];
    try {
      await api.put(`/plans/${planId}`, {
        price: Number(data.price),
        durationInDays: Number(data.durationInDays),
      });
      setSuccess('Plan updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchPlans();
    } catch (err) {
      setError('Failed to update plan.');
    }
  };

  const handleEditChange = (planId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [planId]: { ...prev[planId], [field]: value },
    }));
  };

  if (loading) return <div className="loading">Loading plans...</div>;

  // Build a map of existing plans by name for easy lookup
  const existingByName = {};
  plans.forEach((p) => { existingByName[p.name] = p; });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Membership Plans</h1>
          <p>Set prices and durations for each plan. These are assigned to members.</p>
        </div>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="plans-grid">
        {PLAN_NAMES.map((name) => {
          const plan = existingByName[name];

          // If this plan hasn't been created in the DB yet, show a create button
          if (!plan) {
            return (
              <div key={name} className={`plan-card ${PLAN_COLORS[name]}`}>
                <h3>{name}</h3>
                <p className="plan-duration">{PLAN_DURATIONS[name]} days</p>
                <p style={{ color: 'var(--text-light)', marginBottom: '16px', fontSize: '13px' }}>
                  This plan has not been set up yet.
                </p>
                <button className="btn btn-primary" onClick={() => handleCreate(name)}>
                  ➕ Create {name} Plan
                </button>
              </div>
            );
          }

          // Plan exists — show edit form
          return (
            <div key={plan._id} className={`plan-card ${PLAN_COLORS[name]}`}>
              <h3>{plan.name}</h3>
              <div className="plan-price">₹{plan.price}</div>
              <div className="plan-duration">{plan.durationInDays} days</div>

              <div className="plan-edit-form">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editData[plan._id]?.price || ''}
                    onChange={(e) => handleEditChange(plan._id, 'price', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Duration (days)</label>
                  <input
                    type="number"
                    value={editData[plan._id]?.durationInDays || ''}
                    onChange={(e) => handleEditChange(plan._id, 'durationInDays', e.target.value)}
                    min="1"
                  />
                </div>
                <button className="btn btn-primary" onClick={() => handleUpdate(plan._id)}>
                  💾 Save Changes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Plans;
