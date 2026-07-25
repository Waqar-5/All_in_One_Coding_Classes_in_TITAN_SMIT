import api from "./axios";

export const getFavoriteIds = async () => {
  const { data } = await api.get("/favorites/ids");
  return data.favoriteIds; // string[]
};

export const getMyFavorites = async () => {
  const { data } = await api.get("/favorites");
  return data.books;
};

export const toggleFavorite = async (bookId) => {
  const { data } = await api.post(`/favorites/${bookId}`);
  return data; // { success, isFavorite, message }
};
