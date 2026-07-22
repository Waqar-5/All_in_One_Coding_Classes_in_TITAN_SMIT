import api from "./axios";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // { success, message, token, user }
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data; // { success, message, token, user }
};
