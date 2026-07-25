import api from "./axios";

// ===========================
// Books (Admin)
// ===========================

export const getAllBooksAdmin = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries({ page: 1, limit: 20, ...params }).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  const { data } = await api.get("/books/admin/all", { params: cleanParams });
  return data; // { success, totalBooks, currentPage, totalPages, books }
};

export const restoreBook = async (id) => {
  const { data } = await api.patch(`/books/restore/${id}`);
  return data;
};

export const permanentlyDeleteBook = async (id) => {
  const { data } = await api.delete(`/books/permanent/${id}`);
  return data;
};

// ===========================
// Users (Admin)
// ===========================

export const getAllUsers = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries({ page: 1, limit: 20, ...params }).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  const { data } = await api.get("/auth/users", { params: cleanParams });
  return data; // { success, totalUsers, currentPage, totalPages, users }
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.patch(`/auth/users/${id}/role`, { role });
  return data;
};

export const toggleUserDeleted = async (id) => {
  const { data } = await api.patch(`/auth/users/${id}/toggle-delete`);
  return data;
};
