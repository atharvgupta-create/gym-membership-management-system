// src/pages/Login.jsx
// The admin login page. First thing the user sees when not authenticated.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError('');
    setLoading(true);

    try {
      // Call the backend login route
      const res = await api.post('/auth/login', { username, password });

      // Save token and username to context + localStorage
      login(res.data.token, res.data.username);

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show the error message returned by the server
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="logo">
          <h1>🏋️ <span>Gym</span> Manager</h1>
          <p>Admin Portal — Sign in to continue</p>
        </div>

        {/* Error Message */}
        {error && <div className="login-error">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
