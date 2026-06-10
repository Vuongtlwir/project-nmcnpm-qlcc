import api from "./api";

export async function getUserSummary() {
  const response = await api.get("/user/summary");
  return response.data;
}
