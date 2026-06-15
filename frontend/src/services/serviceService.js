import api from './api';

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data?.data || [];
};

export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data?.data;
};

export const createService = async (data) => {
  const response = await api.post('/services', data);
  return response.data?.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

export const getBookings = async (params = {}) => {
  const response = await api.get('/services/bookings', { params });
  return response.data?.data || [];
};

export const getAdminBookings = async (params = {}) => {
  const response = await api.get('/services/bookings/all', { params });
  return response.data?.data || [];
};

export const getBookingById = async (id) => {
  const response = await api.get(`/services/bookings/${id}`);
  return response.data?.data;
};

export const createBooking = async (data) => {
  const response = await api.post('/services/bookings', data);
  return response.data?.data;
};

export const updateBooking = async (id, data) => {
  const response = await api.put(`/services/bookings/${id}`, data);
  return response.data;
};