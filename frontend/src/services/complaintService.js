import api from './api';

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data?.data || [];
};

export const createComplaint = async (complaintData) => {
  const response = await api.post('/complaints', complaintData);
  return response.data?.data;
};

export const updateComplaint = async (id, updateData) => {
  const response = await api.put(`/complaints/${id}`, updateData);
  return response.data;
};
