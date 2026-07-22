import api from "./axios";

export const requestExchange = async (bookId, message = "") => {
  const { data } = await api.post(`/exchange/${bookId}`, { message });
  return data;
};

export const getSentRequests = async () => {
  const { data } = await api.get("/exchange/sent");
  return data.requests;
};

export const getReceivedRequests = async () => {
  const { data } = await api.get("/exchange/received");
  return data.requests;
};

export const respondToExchange = async (id, action) => {
  const { data } = await api.patch(`/exchange/${id}`, { action });
  return data;
};

export const cancelExchange = async (id) => {
  const { data } = await api.patch(`/exchange/${id}/cancel`);
  return data;
};
