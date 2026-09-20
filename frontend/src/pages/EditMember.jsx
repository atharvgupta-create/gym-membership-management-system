// src/pages/EditMember.jsx
// Pre-fills a form with the existing member's data and allows editing.
// Also handles membership renewal by changing the plan and/or start date.

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function EditMember() {
  const { id } = useParams(); // Get the member ID from the URL: /edit-member/:id
  const navigate = useNavigate();

  const [form, setForm]       = useState(null);  // null until data is loaded
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Load the member's current data on mount
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/members/${id}`);
        const m = res.data;

        // Format dates to "YYYY-MM-DD" for the date input fields
        const fmt = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

        setForm({
          fullName:            m.fullName,
          age:                 m.age,
          gender:              m.gender,
          phone:               m.phone,
          email:               m.email,
          joiningDate:         fmt(m.joiningDate),
          membershipPlan:      m.membershipPlan,
          membershipStartDate: fmt(m.membershipStartDate),
          paymentStatus:       m.paymentStatus,
          // Show the current expiry date (read-only display)
          membershipExpiryDate: fmt(m.membershipExpiryDate),
        });
      } catch (err) {
        setError('Failed to load member data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // The backend will recalculate expiry if plan or startDate changed
      await api.put(`/members/${id}`, form);
      setSuccess('✅ Member updated successfully!');
      setTimeout(() => navigate('/members'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading member data...</div>;
  if (!form)   return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Edit Member</h1>
          <p>Update details or renew membership by changing the plan & start date.</p>
        </div>
        <Link to="/members" className="btn btn-outline">← Back to Members</Link>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} min="5" max="100" required />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Joining Date *</label>
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required />
            </div>

            {/* ── Renewal Section ──────────────────────────────────
                Changing the plan or start date triggers a new expiry
                calculation on the backend — this is how renewal works.
            ─────────────────────────────────────────────────────── */}
            <div className="form-group">
              <label>Membership Plan *</label>
              <select name="membershipPlan" value={form.membershipPlan} onChange={handleChange} required>
                <option value="Monthly">Monthly (30 days)</option>
                <option value="Quarterly">Quarterly (90 days)</option>
                <option value="Yearly">Yearly (365 days)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Membership Start Date * <small style={{color:'var(--primary)'}}>← Change to renew</small></label>
              <input type="date" name="membershipStartDate" value={form.membershipStartDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Payment Status *</label>
              <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} required>
                <option value="Not Paid">Not Paid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: 'var(--text-light)' }}>Current Expiry Date</label>
              <input
                type="text"
                value={new Date(form.membershipExpiryDate).toLocaleDateString('en-IN')}
                disabled
                style={{ background: '#f8fafc', color: 'var(--text-light)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-actions">
              <Link to="/members" className="btn btn-outline">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMember;
