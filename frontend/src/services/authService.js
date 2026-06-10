import api from "./api";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data?.data || response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data?.data || response.data;
};

export const changePassword = async (payload) => {
  const response = await api.put('/auth/change-password', payload);
  return response.data?.data || response.data || { success: true };
};