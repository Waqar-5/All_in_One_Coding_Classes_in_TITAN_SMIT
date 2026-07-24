import api from "./axios";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // { success, message, token, user }
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data; // { success, message, token, user }
};

export const getMyProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data; // { success, user, stats: { booksListed, booksExchanged, exchangesCompleted } }
};

export const updateProfile = async (formData, onUploadProgress) => {
  const { data } = await api.put("/auth/profile", formData, {
    onUploadProgress: onUploadProgress
      ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total || e.loaded || 1)))
      : undefined,
  });
  return data.user;
};

export const changePassword = async (payload) => {
  const { data } = await api.put("/auth/change-password", payload);
  return data;
};
