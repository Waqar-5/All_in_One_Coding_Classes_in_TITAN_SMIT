import api from "./axios";

// Thin service layer over the /books REST endpoints.
// Keeping these calls in one place means components never touch axios directly.
// NOTE: response shapes come straight from the backend controllers —
// list endpoints return { success, totalBooks, currentPage, totalPages, books },
// single-book endpoints return { success, book }.

export const getBooks = async ({ page = 1, limit = 12 } = {}) => {
  const { data } = await api.get("/books", { params: { page, limit } });
  return data;
};

export const getBookById = async (id) => {
  const { data } = await api.get(`/books/${id}`);
  return data.book;
};

export const getMyBooks = async () => {
  const { data } = await api.get("/books/my-books");
  return data; // { success, totalBooks, books }
};

export const createBook = async (formData, onUploadProgress) => {
  const { data } = await api.post("/books", formData, {
    onUploadProgress: onUploadProgress
      ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total || e.loaded || 1)))
      : undefined,
  });
  return data.book;
};

export const updateBook = async (id, formData, onUploadProgress) => {
  const { data } = await api.put(`/books/${id}`, formData, {
    onUploadProgress: onUploadProgress
      ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total || e.loaded || 1)))
      : undefined,
  });
  return data.book;
};

export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};

export const getBookStats = async () => {
  const { data } = await api.get("/books/stats");
  return data; // { success, totalBooks, byStatus, byCategory }
};
