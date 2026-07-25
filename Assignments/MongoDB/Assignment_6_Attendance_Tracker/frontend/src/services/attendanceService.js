// services/attendanceService.js
// Centralized Axios instance and API call functions for the Attendance resource.
// Keeping all HTTP logic here keeps components clean and makes the base URL
// easy to change (e.g. for production deployment) in a single place.

import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendance-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor to normalize error messages and handle
// expired/invalid sessions (401) or a mid-session account block (403)
// by clearing local auth state and redirecting to /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';

    const isBlockedMessage = status === 403 && message.toLowerCase().includes('blocked');

    if (status === 401 || isBlockedMessage) {
      localStorage.removeItem('attendance-token');
      localStorage.removeItem('attendance-user');
      if (!window.location.pathname.startsWith('/login')) {
        if (isBlockedMessage) {
          Swal.fire({
            icon: 'error',
            title: 'Account Blocked',
            text: message,
            confirmButtonColor: '#6366f1',
          });
        }
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

/**
 * Fetch attendance records with optional search/filter/sort/pagination params.
 * @param {Object} params - { search, status, date, sortBy, order, page, limit }
 */
export const fetchAttendanceRecords = async (params = {}) => {
  const { data } = await api.get('/attendance', { params });
  return data;
};

/**
 * Fetch a single attendance record by ID.
 */
export const fetchAttendanceById = async (id) => {
  const { data } = await api.get(`/attendance/${id}`);
  return data;
};

/**
 * Create a new attendance record.
 */
export const createAttendanceRecord = async (payload) => {
  const { data } = await api.post('/attendance', payload);
  return data;
};

/**
 * Update an existing attendance record.
 */
export const updateAttendanceRecord = async (id, payload) => {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return data;
};

/**
 * Delete an attendance record.
 */
export const deleteAttendanceRecord = async (id) => {
  const { data } = await api.delete(`/attendance/${id}`);
  return data;
};

/**
 * Fetch dashboard statistics (total, present, absent, percentage).
 */
export const fetchAttendanceStats = async () => {
  const { data } = await api.get('/attendance/count');
  return data;
};

export default api;
