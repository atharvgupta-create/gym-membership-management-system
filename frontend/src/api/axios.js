// src/api/axios.js
// Creates a pre-configured Axios instance so we don't repeat the base URL
// and Authorization header in every single API call.

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // All requests go to our Express backend
});

// ── Request Interceptor ───────────────────────────────────────
// Before every request is sent, this function runs automatically.
// It reads the JWT token from localStorage and attaches it to the
// Authorization header so protected routes know the admin is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
