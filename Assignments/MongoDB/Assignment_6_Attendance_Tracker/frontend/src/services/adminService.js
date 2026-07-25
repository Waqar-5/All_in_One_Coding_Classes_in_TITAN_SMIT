// services/adminService.js
// Axios calls for admin-only user management endpoints.

import api from './attendanceService.js';

export const fetchAllUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const blockUser = async (userId) => {
  const { data } = await api.put(`/admin/users/${userId}/block`);
  return data;
};

export const unblockUser = async (userId) => {
  const { data } = await api.put(`/admin/users/${userId}/unblock`);
  return data;
};
