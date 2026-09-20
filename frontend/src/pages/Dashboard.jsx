// src/pages/Dashboard.jsx
// Shows summary statistics: total, active, expired, paid, unpaid members.
// Also shows the 5 most recently added members in a table.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats and recent members at the same time using Promise.all
    const fetchData = async () => {
      try {
        const [statsRes, membersRes] = await Promise.all([
          api.get('/members/stats'),
          api.get('/members'),
        ]);
        setStats(statsRes.data);
        // Show only the 5 most recent members
        setRecent(membersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      {/* Page Title */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your gym overview.</p>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Members</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-icon">👥</span>
        </div>
        <div className="stat-card active">
          <span className="stat-label">Active Memberships</span>
          <span className="stat-value">{stats.active}</span>
          <span className="stat-icon">✅</span>
        </div>
        <div className="stat-card expired">
          <span className="stat-label">Expired Memberships</span>
          <span className="stat-value">{stats.expired}</span>
          <span className="stat-icon">⏰</span>
        </div>
        <div className="stat-card paid">
          <span className="stat-label">Paid Members</span>
          <span className="stat-value">{stats.paid}</span>
          <span className="stat-icon">💰</span>
        </div>
        <div className="stat-card unpaid">
          <span className="stat-label">Unpaid Members</span>
          <span className="stat-value">{stats.unpaid}</span>
          <span className="stat-icon">⚠️</span>
        </div>
      </div>

      {/* ── Recent Members Table ─────────────────────────────── */}
      <div className="dashboard-section">
        <div className="recent-table-card">
          <div className="card-header">
            <span>Recently Added Members</span>
            <Link to="/members">View all →</Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p>No members yet. <Link to="/add-member">Add your first member</Link></p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Plan</th>
                    <th>Expiry Date</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((member) => {
                    const isExpired = new Date(member.membershipExpiryDate) < new Date();
                    return (
                      <tr key={member._id}>
                        <td>
                          <strong>{member.fullName}</strong>
                          <br />
                          <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                            {member.email}
                          </span>
                        </td>
                        <td>{member.membershipPlan}</td>
                        <td>
                          <span className={`badge ${isExpired ? 'badge-danger' : 'badge-success'}`}>
                            {new Date(member.membershipExpiryDate).toLocaleDateString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${member.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                            {member.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
