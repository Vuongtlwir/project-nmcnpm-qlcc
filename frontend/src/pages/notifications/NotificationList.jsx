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
                  <td className="cell-action">
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
        confirmText={modalMode === "create" ? "Thêm tin tức" : "Lưu thay đổi"}
        cancelText="Hủy"
        loading={saving}
        wide
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{
            background: '#f8fafc',
            borderRadius: 12,
            padding: 20,
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>📰</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>Thông tin cơ bản</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="news-title" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Tiêu đề tin tức <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="news-title"
                type="text"
                value={currentNews.title}
                onChange={(event) => setCurrentNews({ ...currentNews, title: event.target.value })}
                placeholder="Nhập tiêu đề tin tức..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  border: '2px solid #e2e8f0',
                  borderRadius: 10,
                  outline: 'none',
                  background: '#fff',
                  color: '#0f172a',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ minWidth: 140 }}>
                <label htmlFor="news-sort-order" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Thứ tự sắp xếp
                </label>
                <input
                  id="news-sort-order"
                  type="number"
                  min="0"
                  value={currentNews.sort_order}
                  onChange={(event) => setCurrentNews({ ...currentNews, sort_order: Number(event.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: 10,
                    outline: 'none',
                    background: '#fff',
                    color: '#0f172a',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <small style={{ display: 'block', marginTop: 4, color: '#64748b', fontSize: '0.8rem' }}>
                  Số nhỏ → hiển thị trước
                </small>
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                  Danh mục
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { value: 'general', label: 'Chung', color: '#3b82f6', bg: '#eff6ff' },
                    { value: 'fee', label: 'Phí', color: '#f59e0b', bg: '#fffbeb' },
                    { value: 'maintenance', label: 'Bảo trì', color: '#10b981', bg: '#ecfdf5' },
                    { value: 'event', label: 'Sự kiện', color: '#8b5cf6', bg: '#f5f3ff' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCurrentNews({ ...currentNews, type: cat.value })}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: currentNews.type === cat.value ? `2px solid ${cat.color}` : '2px solid #e2e8f0',
                        background: currentNews.type === cat.value ? cat.bg : '#fff',
                        color: currentNews.type === cat.value ? cat.color : '#64748b',
                        fontWeight: currentNews.type === cat.value ? 600 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: 12,
            padding: 20,
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>📝</span>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>Nội dung</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {currentNews.content.length} ký tự
              </span>
            </div>

            <textarea
              id="news-content"
              rows="6"
              value={currentNews.content}
              onChange={(event) => setCurrentNews({ ...currentNews, content: event.target.value })}
              placeholder="Nhập nội dung chi tiết của tin tức..."
              style={{
                width: '100%',
                minHeight: 160,
                padding: '14px 16px',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                border: '2px solid #e2e8f0',
                borderRadius: 10,
                outline: 'none',
                background: '#fff',
                color: '#0f172a',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {currentNews.title || currentNews.content ? (
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>👁️</span>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>Xem trước</span>
              </div>

              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: currentNews.type === 'general' ? '#eff6ff' : currentNews.type === 'fee' ? '#fffbeb' : currentNews.type === 'maintenance' ? '#ecfdf5' : '#f5f3ff',
                    color: currentNews.type === 'general' ? '#3b82f6' : currentNews.type === 'fee' ? '#f59e0b' : currentNews.type === 'maintenance' ? '#10b981' : '#8b5cf6',
                  }}>
                    {typeLabels[currentNews.type] || 'Chung'}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                    {currentNews.title || '(Chưa có tiêu đề)'}
                  </span>
                </div>
                <div style={{ padding: '14px 16px', fontSize: '0.9rem', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {currentNews.content || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có nội dung...</span>}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </section>
  );
}
