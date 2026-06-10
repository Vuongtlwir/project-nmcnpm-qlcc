import api from "./api";

export async function getDashboardStats() {
  try {
    const response = await api.get("/dashboard/stats");
    return response.data?.data || {
      totalResidents: 0,
      totalApartments: 0,
      totalRevenue: 0,
    };
  } catch (error) {
    console.error("Không thể tải dữ liệu dashboard:", error);
    return {
      totalResidents: 0,
      totalApartments: 0,
      totalRevenue: 0,
    };
  }
}
