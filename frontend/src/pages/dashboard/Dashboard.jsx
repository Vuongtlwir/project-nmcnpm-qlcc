import { useEffect, useState } from "react";
import Chart from "../../components/Chart";
import { getDashboardStats } from "../../services/dashboardService";

export default function Dashboard() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] = useState({
    totalResidents: 0,
    totalApartments: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data =
        await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Trang quản trị</h2>
        <p>Đây là tổng quan ban đầu của hệ thống quản lý chung cư.</p>
      </div>

      <div className="summary-grid" style={{ marginTop: "20px" }}>
        <div className="chart-card">
          <h3>Tổng cư dân</h3>
          <div className="chart-placeholder">{loading ? "Loading..." : stats.totalResidents}</div>
        </div>
        <div className="chart-card">
          <h3>Tổng căn hộ</h3>
          <div className="chart-placeholder">{loading ? "Loading..." : stats.totalApartments}</div>
        </div>
        <div className="chart-card">
          <h3>Doanh thu</h3>
          <div className="chart-placeholder">{loading ? "Loading..." : stats.totalRevenue}</div>
        </div>
      </div>
    </section>
  );
}