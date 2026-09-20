// src/pages/Members.jsx
// Displays all members in a table with search, payment toggle, and delete.

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Members() {
  const [members, setMembers]   = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // fetchMembers is wrapped in useCallback so it can be safely called
  // from multiple places without causing infinite re-renders
  const fetchMembers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/members${query ? `?q=${query}` : ''}`);
      setMembers(res.data);
    } catch (err) {
      setError('Failed to load members.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load members on first render
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Search: triggered when the admin types in the search box
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    // Debounce-lite: wait 400ms after typing stops before querying
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => fetchMembers(val), 400);
  };

  // Toggle payment status between "Paid" and "Not Paid"
  const handlePaymentToggle = async (member) => {
    const newStatus = member.paymentStatus === 'Paid' ? 'Not Paid' : 'Paid';
    try {
      await api.patch(`/members/${member._id}/payment`, { paymentStatus: newStatus });
      // Update the member in local state to avoid a full refetch
      setMembers((prev) =>
        prev.map((m) => m._id === member._id ? { ...m, paymentStatus: newStatus } : m)
      );
    } catch (err) {
      alert('Failed to update payment status.');
    }
  };

  // Delete a member after confirmation
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert('Failed to delete member.');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Members</h1>
          <p>{members.length} member{members.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/add-member" className="btn btn-primary">
          ➕ Add Member
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search + Table */}
      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Members Table */}
        {loading ? (
          <div className="loading">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p>No members found. <Link to="/add-member">Add one now</Link></p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => {
                  const isExpired = new Date(member.membershipExpiryDate) < new Date();
                  return (
                    <tr key={member._id}>
                      <td style={{ color: 'var(--text-light)' }}>{index + 1}</td>
                      <td>
                        <strong>{member.fullName}</strong>
                        <br />
                        <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                          {member.email}
                        </span>
                      </td>
                      <td>{member.phone}</td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: '11px' }}>
                          {member.membershipPlan}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isExpired ? 'badge-danger' : 'badge-success'}`}>
                          {new Date(member.membershipExpiryDate).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isExpired ? 'badge-danger' : 'badge-success'}`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td>
                        {/* One-click payment status toggle */}
                        <button
                          className={`btn btn-sm ${member.paymentStatus === 'Paid' ? 'btn-success' : 'btn-outline'}`}
                          onClick={() => handlePaymentToggle(member)}
                        >
                          {member.paymentStatus === 'Paid' ? '✅ Paid' : '❌ Not Paid'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Link
                            to={`/edit-member/${member._id}`}
                            className="btn btn-sm btn-outline"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(member._id, member.fullName)}
                          >
                            🗑️
                          </button>
                        </div>
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
  );
}

export default Members;
