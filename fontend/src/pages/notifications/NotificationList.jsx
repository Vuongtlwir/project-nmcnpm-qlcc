import { useMemo, useState } from "react";

const notifications = [
  {
    id: "NT-001",
    title: "Lịch bảo trì thang máy",
    category: "Tiện ích",
    date: "05/06/2026",
    status: "Đã gửi",
  },
  {
    id: "NT-002",
    title: "Nhắc nộp phí dịch vụ",
    category: "Tài chính",
    date: "28/05/2026",
    status: "Chưa gửi",
  },
  {
    id: "NT-003",
    title: "Cập nhật quy định gửi xe",
    category: "Quy định",
    date: "18/05/2026",
    status: "Đã gửi",
  },
];

export default function NotificationList() {
  const [search, setSearch] = useState("");

  const handleSendGeneralNotification = () => {
    window.alert("Đã gửi thông báo chung tới toàn bộ cư dân.");
  };

  const handleSendApartmentFeeNotification = () => {
    window.alert("Đã gửi thông báo chi phí đến căn hộ cụ thể.");
  };

  const handleCreateNotification = () => {
    window.alert("Mở form tạo thông báo mới.");
  };

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((item) => {
        const keyword = search.toLowerCase();
        return (
          item.id.toLowerCase().includes(keyword) ||
          item.title.toLowerCase().includes(keyword) ||
          item.category.toLowerCase().includes(keyword)
        );
      }),
    [search]
  );

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Thông báo</h2>
        <p>Quản lý các thông báo gửi tới cư dân và trạng thái gửi thông báo.</p>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="notification-search">Tìm thông báo</label>
          <input
            id="notification-search"
            type="text"
            placeholder="Tìm theo mã hoặc nội dung..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="action-group">
          <button className="primary-btn" type="button" onClick={handleSendGeneralNotification}>
            Thông báo chung
          </button>
          <button className="secondary-btn" type="button" onClick={handleSendApartmentFeeNotification}>
            Thông báo phí riêng căn hộ
          </button>
          <button className="secondary-btn" type="button" onClick={handleCreateNotification}>
            Tạo thông báo mới
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`status-pill ${item.status === "Đã gửi" ? "status-paid" : "status-pending"}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
