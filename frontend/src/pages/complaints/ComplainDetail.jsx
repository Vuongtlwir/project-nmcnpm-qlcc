import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getComplaintById } from "../../services/complaintService";

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  resolved: "Đã hoàn thành",
  rejected: "Bị từ chối",
};

export default function ComplainDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    try {
      const data = await getComplaintById(id);
      setComplaint(data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết phản ánh:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="page-card">
        <p style={{ color: "#94a3b8", padding: 20 }}>Đang tải dữ liệu...</p>
      </section>
    );
  }

  if (!complaint) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <div className="page-card-header-text">
            <h2>Không tìm thấy phản ánh</h2>
            <p>Vui lòng kiểm tra lại mã phản ánh hoặc trở về trang danh sách.</p>
          </div>
        </div>
        <Link to="/complaints" className="secondary-btn" style={{ marginTop: 16 }}>Quay lại</Link>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="page-card-header">
        <div className="page-card-header-text">
          <h2>Chi tiết phản ánh</h2>
          <p>Xem nội dung, trạng thái và lịch sử xử lý của phản ánh.</p>
        </div>
      </div>

      <div className="summary-grid" style={{ marginTop: 20 }}>
        <div className="summary-card">
          <span className="summary-label">Mã</span>
          <strong>#{complaint.id}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Tiêu đề</span>
          <strong>{complaint.title}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Loại</span>
          <strong>{complaint.type || "Khác"}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Ngày gửi</span>
          <strong>{formatDateTime(complaint.created_at)}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Trạng thái</span>
          <strong>{STATUS_LABELS[complaint.status] || complaint.status}</strong>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: "20px 24px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e8edf4" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>Nội dung phản ánh</h3>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
          {complaint.content}
        </p>
      </div>

      {complaint.response && (
        <div style={{ marginTop: 16, padding: "20px 24px", background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "0.95rem", fontWeight: 600, color: "#1d4ed8" }}>Phản hồi từ quản lý</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#1e3a5f", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
            {complaint.response}
          </p>
        </div>
      )}

      <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: 20 }}>
        <Link to="/complaints" className="secondary-btn">Quay lại</Link>
      </div>
    </section>
  );
}
