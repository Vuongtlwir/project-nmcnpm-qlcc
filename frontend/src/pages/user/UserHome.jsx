import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const typeLabels = {
  general: "Chung",
  fee: "Phí",
  maintenance: "Bảo trì",
  event: "Sự kiện",
};

export default function UserHome() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data?.data || []);
      } catch (error) {
        console.error("Không thể tải thông báo:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  return (
    <section className="welcome-card page-card">
      <div className="page-card-header">
        <h2>Chào mừng đến với trang cư dân</h2>
        <p>Quản lý thanh toán, phản ánh và hồ sơ của bạn trong một giao diện trực quan.</p>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.05rem" }}>Thông báo mới</h3>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
              Hiển thị các thông báo từ hệ thống theo thứ tự ưu tiên của admin.
            </p>
          </div>
          <span style={{ color: "#475569", fontWeight: 600 }}>
            {loading ? "Đang tải..." : `${notifications.length} thông báo`}
          </span>
        </div>

        {loading ? (
          <div style={{ marginTop: 20, color: "#6b7280" }}>Đang tải thông báo...</div>
        ) : notifications.length === 0 ? (
          <div style={{ marginTop: 20, color: "#6b7280" }}>Hiện chưa có thông báo nào.</div>
        ) : (
          <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
            {notifications.map((notification) => (
              <article
                key={notification.id}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1rem" }}>{notification.title}</h4>
                    <p style={{ margin: "8px 0 0", color: "#475569", fontSize: "0.95rem" }}>
                      {typeLabels[notification.type] || notification.type} • {new Date(notification.created_at).toLocaleDateString("vi-VN")} • {new Date(notification.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span style={{ background: "#eef2ff", color: "#3730a3", borderRadius: 9999, padding: "6px 12px", fontSize: "0.85rem", fontWeight: 600 }}>
                    {notification.is_read ? "Đã đọc" : "Chưa đọc"}
                  </span>
                </div>
                <p style={{ margin: "16px 0 0", color: "#334155", lineHeight: 1.7 }}>{notification.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
