import api from "./axios";

// Thin service layer over the /books REST endpoints.
// Keeping these calls in one place means components never touch axios directly.

export const getBooks = async () => {
  const { data } = await api.get("/books");
  return data;
};

export const getBookById = async (id) => {
  const { data } = await api.get(`/books/${id}`);
  return data;
};

export const createBook = async (payload) => {
  const { data } = await api.post("/books", payload);
  return data;
};

export const updateBook = async (id, payload) => {
  const { data } = await api.put(`/books/${id}`, payload);
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};

export const getBooksByCategory = async (category) => {
  const { data } = await api.get(`/books/category/${encodeURIComponent(category)}`);
  return data;
};
