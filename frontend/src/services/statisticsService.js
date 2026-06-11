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

export async function getApartmentStatus() {
  try {
    const response = await api.get("/statistics/apartment-status");
    return response.data?.data || { occupied: 0, empty: 0, maintenance: 0 };
  } catch (error) {
    console.error("Lỗi lấy trạng thái căn hộ:", error);
    return { occupied: 0, empty: 0, maintenance: 0 };
  }
}

export async function getRevenueByMonth() {
  try {
    const response = await api.get("/statistics/revenue");
    return response.data?.data || [];
  } catch (error) {
    console.error("Lỗi lấy doanh thu:", error);
    return [];
  }
}
