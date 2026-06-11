import { useEffect, useState } from "react";
import api from "../../services/api";
import { getFees, getPaymentHistory } from "../../services/feeService";

const typeLabels = {
  general: "Chung",
  fee: "Phí",
  maintenance: "Bảo trì",
  event: "Sự kiện",
};

export default function UserHome() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ fees: 0, paid: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [notifResponse, feeData, paymentData] = await Promise.all([
          api.get("/notifications"),
          getFees(),
          getPaymentHistory(),
        ]);

        setNotifications(notifResponse.data?.data || []);

        const payments = paymentData || [];
        const fees = feeData || [];
        const paid = fees.filter((f) =>
          payments.some((p) => p.fee_id === f.id && p.status === "paid")
        ).length;
        const pending = fees.filter((f) =>
          payments.some((p) => p.fee_id === f.id && p.status === "pending")
        ).length;

        setStats({ fees: fees.length, paid, pending });
      } catch (error) {
        console.error("Không thể tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <div className="welcome-hero">
        <div className="welcome-hero-content">
          <h2>Chào mừng trở lại</h2>
          <p>Quản lý thanh toán, phản ánh và thông tin cá nhân của bạn tại đây.</p>

          <div className="welcome-stats">
            <div className="stat-card">
              <div className="stat-icon blue">📋</div>
              <div className="stat-info">
                <div className="stat-label">Tổng hóa đơn</div>
                <div className="stat-value">{loading ? "..." : stats.fees}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info">
                <div className="stat-label">Đã thanh toán</div>
                <div className="stat-value">{loading ? "..." : stats.paid}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">⏳</div>
              <div className="stat-info">
                <div className="stat-label">Chờ xác nhận</div>
                <div className="stat-value">{loading ? "..." : stats.pending}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">📢</div>
              <div className="stat-info">
                <div className="stat-label">Thông báo</div>
                <div className="stat-value">{loading ? "..." : notifications.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="notifications-section">
        <div className="notifications-section-header">
          <h3>Thông báo mới nhất</h3>
          <span>{loading ? "Đang tải..." : `${notifications.length} thông báo`}</span>
        </div>

        {loading ? (
          <div style={{ color: "#64748b", padding: "20px 0" }}>Đang tải thông báo...</div>
        ) : notifications.length === 0 ? (
          <div style={{ color: "#64748b", padding: "20px 0" }}>Hiện chưa có thông báo nào.</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <div className="notification-card-header">
                <h4>{notif.title}</h4>
                <span className={`notification-type-badge ${notif.type || "general"}`}>
                  {typeLabels[notif.type] || "Chung"}
                </span>
              </div>
              <p className="notification-meta">
                {new Date(notif.created_at).toLocaleDateString("vi-VN")} •{" "}
                {new Date(notif.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="notification-content">{notif.content}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
