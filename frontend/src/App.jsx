// src/App.jsx
// The root component. Sets up React Router with all routes.
// Protected pages are wrapped in <ProtectedRoute> so unauthenticated
// users are always redirected to /login.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Members    from './pages/Members';
import AddMember  from './pages/AddMember';
import EditMember from './pages/EditMember';
import Plans      from './pages/Plans';

function App() {
  return (
    // AuthProvider gives all components access to login state
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route — no login required */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes — redirect to /login if not authenticated */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Layout><Members /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-member"
            element={
              <ProtectedRoute>
                <Layout><AddMember /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-member/:id"
            element={
              <ProtectedRoute>
                <Layout><EditMember /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <Layout><Plans /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Default: redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all: redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
