// src/components/ProtectedRoute.jsx
// A wrapper component that checks if the admin is logged in.
// If not, it redirects to the /login page automatically.
// Wrap any private page with <ProtectedRoute> in App.jsx.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  // If not logged in, send to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the actual page
  return children;
}

export default ProtectedRoute;
