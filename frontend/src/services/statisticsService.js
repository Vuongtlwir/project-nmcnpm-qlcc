import api from "./api";

export async function getStatisticsOverview() {
  try {
    const response = await api.get("/statistics/overview");
    return response.data?.data || {
      totalResidents: 0,
      totalApartments: 0,
      totalRevenue: 0,
      openRequests: 0,
    };
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    return {
      totalResidents: 0,
      totalApartments: 0,
      totalRevenue: 0,
      openRequests: 0,
    };
  }
}

export async function getUsageTrends() {
  try {
    const response = await api.get("/statistics/trends");
    return response.data?.data || [];
  } catch (error) {
    console.error("Lỗi lấy xu hướng thống kê:", error);
    return [];
  }
}
