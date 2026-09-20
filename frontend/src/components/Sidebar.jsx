// src/components/Sidebar.jsx
// The left navigation sidebar shown on all protected pages.

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { logout, adminName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo / Brand */}
      <div className="sidebar-logo">
        <h2>🏋️ <span>Gym</span> Manager</h2>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
          Admin: {adminName}
        </p>
      </div>

      {/* Navigation Links */}
      {/* NavLink automatically adds the "active" class when its route is current */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/members">
          <span className="nav-icon">👥</span> Members
        </NavLink>
        <NavLink to="/add-member">
          <span className="nav-icon">➕</span> Add Member
        </NavLink>
        <NavLink to="/plans">
          <span className="nav-icon">📋</span> Membership Plans
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
