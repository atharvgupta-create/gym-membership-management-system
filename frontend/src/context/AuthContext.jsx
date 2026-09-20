// src/context/AuthContext.jsx
// React Context for global authentication state.
// Any component in the app can use useAuth() to get the login status,
// the admin's name, or call login/logout functions.

import { createContext, useContext, useState } from 'react';

// 1. Create the context object
const AuthContext = createContext();

// 2. AuthProvider wraps the whole app (see App.jsx)
//    It holds the state and exposes it to all children.
export function AuthProvider({ children }) {
  // Initialize state from localStorage so login persists on page refresh
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [adminName, setAdminName] = useState(() => localStorage.getItem('adminName') || '');

  // Called after a successful login API response
  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('adminName', username);
    setToken(token);
    setAdminName(username);
  };

  // Called when admin clicks "Logout"
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    setToken(null);
    setAdminName('');
  };

  return (
    <AuthContext.Provider value={{ token, adminName, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — import this in any component to access auth state
export function useAuth() {
  return useContext(AuthContext);
}
