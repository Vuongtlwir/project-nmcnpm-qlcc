import api from "./api";

const RESIDENT_KEY = "residents";

const defaultResidents = [
  {
    id: "R-001",
    name: "Nguyễn Văn A",
    unit: "A-101",
    phone: "0905 123 456",
    email: "a@example.com",
    status: "Đang thuê",
    nationalId: "012345678901",
    username: "012345678901",
    password: "A101admin",
  },
];

export function loadResidents() {
  try {
    const data = localStorage.getItem(RESIDENT_KEY);
    return data ? JSON.parse(data) : defaultResidents;
  } catch {
    return defaultResidents;
  }
}

export function saveResidents(residents) {
  localStorage.setItem(RESIDENT_KEY, JSON.stringify(residents));
}

export async function getResidents(query = {}) {
  try {
    const response = await api.get('/residents', { params: query });
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch residents:', error);
    return [];
  }
}

export async function getResidentById(id) {
  try {
    const response = await api.get(`/residents/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch resident ${id}:`, error);
    return null;
  }
}

export async function getMyResident() {
  try {
    const response = await api.get('/residents/my-profile');
    return response.data?.data || null;
  } catch (error) {
    console.error('Failed to fetch my resident:', error);
    return null;
  }
}

export async function createResident(payload) {
  try {
    const response = await api.post('/residents', payload);
    return response.data?.data || null;
  } catch (error) {
    console.error('Failed to create resident:', error);
    throw error;
  }
}

export async function updateResident(id, payload) {
  try {
    const response = await api.put(`/residents/${id}`, payload);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to update resident ${id}:`, error);
    throw error;
  }
}

export async function deleteResident(id) {
  try {
    const response = await api.delete(`/residents/${id}`);
    return response.data || { success: true };
  } catch (error) {
    console.error(`Failed to delete resident ${id}:`, error);
    throw error;
  }
}

export async function addResident(payload) {
  return createResident(payload);
}

