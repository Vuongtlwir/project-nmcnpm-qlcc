import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/Modal";
import api from "../../services/api";

const typeLabels = {
  general: "Chung",
  fee: "Phí",
  maintenance: "Bảo trì",
  event: "Sự kiện"
};

const initialForm = {
  id: null,
  sort_order: 0,
  title: "",
  content: "",
  type: "general"
};

export default function NotificationList() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalTitle, setModalTitle] = useState("");
  const [currentNews, setCurrentNews] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Không thể tải dữ liệu thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setModalTitle("Thêm tin tức mới");
    setCurrentNews(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (notification) => {
    setModalMode("edit");
    setModalTitle("Chỉnh sửa tin tức");
    setCurrentNews({
      id: notification.id,
      sort_order: notification.sort_order || 0,
      title: notification.title || "",
      content: notification.content || "",
      type: notification.type || "general"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNews(initialForm);
  };

  const handleSaveNotification = async () => {
    if (!currentNews.title.trim()) {
      window.alert("Tiêu đề không được để trống.");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "create") {
        await api.post("/notifications", {
          sort_order: currentNews.sort_order,
          title: currentNews.title,
          content: currentNews.content,
          type: currentNews.type
        });
      } else {
        await api.put(`/notifications/${currentNews.id}`, {
          sort_order: currentNews.sort_order,
          title: currentNews.title,
          content: currentNews.content,
          type: currentNews.type
        });
      }
      await fetchNotifications();
      closeModal();
    } catch (error) {
      console.error("Lưu thông báo thất bại:", error);
      window.alert("Có lỗi xảy ra khi lưu tin tức.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin tức này không?")) {
      return;
    }

    try {
      await api.delete(`/notifications/${id}`);
      await fetchNotifications();
    } catch (error) {
      console.error("Xóa thông báo thất bại:", error);
      window.alert("Có lỗi xảy ra khi xóa tin tức.");
    }
  };

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((item) => {
        const keyword = search.toLowerCase();
        return (
          item.id?.toString().toLowerCase().includes(keyword) ||
          item.title?.toLowerCase().includes(keyword) ||
          item.type?.toLowerCase().includes(keyword)
        );
      }),
    [notifications, search]
  );

  return (
    <section className="page-card">
      <div className="page-card-header">
        <div>
          <h2>Bảng tin tòa nhà</h2>
          <p>Quản lý nội dung tin tức và thông báo gửi tới cư dân.</p>
        </div>
        <button className="primary-btn" type="button" onClick={openCreateModal}>
          Thêm tin tức
        </button>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="notification-search">Tìm tin tức</label>
          <input
            id="notification-search"
            type="text"
            placeholder="Tìm theo mã, tiêu đề hoặc danh mục..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 18,
          borderRadius: 16,
          background: '#f8fbff',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          color: '#0f172a'
        }}
      >
        <strong style={{ display: 'block', marginBottom: 6 }}>Sắp xếp tin tức</strong>
        <span style={{ color: '#475569' }}>
          Giá trị sắp xếp được cấu hình trong form thêm/sửa. Tin tức có số sắp xếp nhỏ hơn sẽ được ưu tiên hiển thị phía trên.
        </span>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-loading">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{typeLabels[item.type] || item.type}</td>
                  <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => openEditModal(item)}
                      style={{
                        backgroundColor: '#F59E0B',
                        borderColor: '#D97706',
                        color: '#111827'
                      }}
                    >
                      ✎ Sửa
                    </button>
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => handleDeleteNews(item.id)}
                      style={{
                        backgroundColor: '#EF4444',
                        borderColor: '#DC2626',
                        color: '#FFFFFF'
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-row">Không có tin tức phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        onConfirm={handleSaveNotification}
        confirmText={modalMode === "create" ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        loading={saving}
      >
        <div
          style={{
            display: 'grid',
            gap: '18px',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'start'
          }}
        >
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="news-sort-order">Sắp xếp</label>
            <input
              id="news-sort-order"
              type="number"
              min="0"
              value={currentNews.sort_order}
              onChange={(event) => setCurrentNews({ ...currentNews, sort_order: Number(event.target.value) })}
              placeholder="Nhập số để ưu tiên hiển thị"
            />
            <small style={{ marginTop: 6, color: '#475569' }}>
              Giá trị nhỏ hơn sẽ xuất hiện trước.
            </small>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="news-type">Danh mục</label>
            <select
              id="news-type"
              value={currentNews.type}
              onChange={(event) => setCurrentNews({ ...currentNews, type: event.target.value })}
            >
              <option value="general">Chung</option>
              <option value="fee">Phí</option>
              <option value="maintenance">Bảo trì</option>
              <option value="event">Sự kiện</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="news-title">Tiêu đề</label>
            <input
              id="news-title"
              type="text"
              value={currentNews.title}
              onChange={(event) => setCurrentNews({ ...currentNews, title: event.target.value })}
              placeholder="Nhập tiêu đề tin tức"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="news-content">Nội dung</label>
            <textarea
              id="news-content"
              rows="5"
              value={currentNews.content}
              onChange={(event) => setCurrentNews({ ...currentNews, content: event.target.value })}
              placeholder="Nhập nội dung chi tiết của tin tức"
              style={{ minHeight: 130, resize: 'vertical' }}
            />
          </div>
        </div>
      </Modal>
    </section>
  );
}
