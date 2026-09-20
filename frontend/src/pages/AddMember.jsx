// src/pages/AddMember.jsx
// Form to add a new gym member.
// The expiry date is automatically calculated by the backend based on the plan.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

// Default/empty state for the form
const initialForm = {
  fullName: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  joiningDate: new Date().toISOString().split('T')[0],   // Today's date as default
  membershipPlan: 'Monthly',
  membershipStartDate: new Date().toISOString().split('T')[0], // Today as default
  paymentStatus: 'Not Paid',
};

function AddMember() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Generic handler — updates whichever field changed
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/members', form);
      setSuccess('✅ Member added successfully!');
      setForm(initialForm); // Reset form after success
      // Redirect to members list after a short delay
      setTimeout(() => navigate('/members'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Add New Member</h1>
          <p>Fill in the details below to register a new gym member.</p>
        </div>
        <Link to="/members" className="btn btn-outline">← Back to Members</Link>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Full Name */}
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Rahul Sharma"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Age */}
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                placeholder="e.g. 25"
                value={form.age}
                onChange={handleChange}
                min="5"
                max="100"
                required
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. rahul@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Joining Date */}
            <div className="form-group">
              <label>Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Membership Plan */}
            <div className="form-group">
              <label>Membership Plan *</label>
              <select name="membershipPlan" value={form.membershipPlan} onChange={handleChange} required>
                <option value="Monthly">Monthly (30 days)</option>
                <option value="Quarterly">Quarterly (90 days)</option>
                <option value="Yearly">Yearly (365 days)</option>
              </select>
            </div>

            {/* Membership Start Date */}
            <div className="form-group">
              <label>Membership Start Date *</label>
              <input
                type="date"
                name="membershipStartDate"
                value={form.membershipStartDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Payment Status */}
            <div className="form-group">
              <label>Payment Status *</label>
              <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} required>
                <option value="Not Paid">Not Paid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Info note about expiry */}
            <div className="form-group">
              <label style={{ color: 'var(--text-light)' }}>Expiry Date</label>
              <input
                type="text"
                value="Auto-calculated from plan & start date"
                disabled
                style={{ background: '#f8fafc', color: 'var(--text-light)', cursor: 'not-allowed' }}
              />
            </div>

            {/* Submit */}
            <div className="form-actions">
              <Link to="/members" className="btn btn-outline">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : '➕ Add Member'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMember;
