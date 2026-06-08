import api from "./api";

export async function getFees(query = {}) {
  try {
    const response = await api.get("/fees", { params: query });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách phí:", error);
    return [];
  }
}

export async function getFeeById(id) {
  try {
    const response = await api.get(`/fees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi lấy hóa đơn ${id}:`, error);
    return null;
  }
}

export async function createFee(payload) {
  const response = await api.post("/fees", payload);
  return response.data;
}

export async function payFee(id, paymentData) {
  const response = await api.post(`/fees/${id}/pay`, paymentData);
  return response.data;
}

export async function getPaymentHistory(query = {}) {
  try {
    const response = await api.get("/payments", { params: query });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy lịch sử thanh toán:", error);
    return [];
  }
}
