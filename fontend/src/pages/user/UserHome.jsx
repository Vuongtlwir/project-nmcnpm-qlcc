import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserSummary } from "../../services/userService";

const initialSummary = {
  upcomingFees: 0,
  processingComplaints: 0,
  unreadNotifications: 0,
};

export default function UserHome() {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getUserSummary();
        setSummary({
          upcomingFees: data.upcomingFees ?? 0,
          processingComplaints: data.processingComplaints ?? 0,
          unreadNotifications: data.unreadNotifications ?? 0,
        });
      } catch (error) {
        console.error("Không thể tải dữ liệu tổng quan:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <section className="welcome-card page-card">
      <div className="page-card-header">
        <h2>Chào mừng đến với trang cư dân</h2>
        <p>Quản lý thanh toán, phản ánh và hồ sơ của bạn trong một giao diện trực quan.</p>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span className="summary-label">Hóa đơn sắp đến</span>
          <strong>{loading ? "Đang tải..." : summary.upcomingFees}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Phản ánh đang xử lý</span>
          <strong>{loading ? "Đang tải..." : summary.processingComplaints}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Thông báo mới</span>
          <strong>{loading ? "Đang tải..." : summary.unreadNotifications}</strong>
        </article>
      </div>

      <div className="page-actions" style={{ justifyContent: "center" }}>
        <Link to="/fees" className="primary-btn">Xem hóa đơn</Link>
        <Link to="/complaints" className="secondary-btn">Xem phản ánh</Link>
        <Link to="/profile" className="secondary-btn">Hồ sơ của tôi</Link>
      </div>
    </section>
  );
}
