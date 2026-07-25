// services/authService.js
// Axios calls for authentication endpoints (register, login, current user).
// Uses the same shared `api` instance as attendanceService so the base URL
// and error-normalizing interceptor stay consistent.

import api from './attendanceService.js';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
