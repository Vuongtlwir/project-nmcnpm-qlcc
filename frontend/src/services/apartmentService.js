import api from "./api";

export async function getApartments(query = {}) {
  try {
    const response = await api.get("/apartments", { params: query });
    return response.data?.data || [];
  } catch (error) {
    console.error("Lỗi lấy danh sách căn hộ:", error);
    return [];
  }
}

export async function getApartmentById(id) {
  try {
    const response = await api.get(`/apartments/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Lỗi lấy thông tin căn hộ ${id}:`, error);
    return null;
  }
}

export async function createApartment(payload) {
  const response = await api.post("/apartments", payload);
  return response.data?.data || response.data || { success: true };
}

export async function updateApartment(id, payload) {
  const response = await api.put(`/apartments/${id}`, payload);
  return response.data?.data || response.data || { success: true };
}

export async function deleteApartment(id) {
  const response = await api.delete(`/apartments/${id}`);
  return response.data?.data || response.data || { success: true };
}
