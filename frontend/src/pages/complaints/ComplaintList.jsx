import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getComplaints, createComplaint } from "../../services/complaintService";

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  resolved: "Đã hoàn thành",
  rejected: "Bị từ chối",
};

export default function ComplaintList() {
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Cơ sở vật chất",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error("Lỗi khi tải phản ánh:", err);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const processing = complaints.filter((c) => c.status === "pending" || c.status === "processing").length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    return [
      { label: "Đang xử lý", value: processing },
      { label: "Hoàn thành", value: resolved },
    ];
  }, [complaints]);

  const filteredComplaints = useMemo(
    () => complaints.filter((item) => {
      const keyword = search.toLowerCase();
      return (
        (item.title || "").toLowerCase().includes(keyword) ||
        String(item.id || "").toLowerCase().includes(keyword) ||
        (item.type || "").toLowerCase().includes(keyword)
      );
    }),
    [search, complaints]
  );

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const openModal = () => {
    setFormData({ title: "", type: "Cơ sở vật chất", details: "" });
    setErrorMessage("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    if (!formData.title.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề phản ánh.");
      return;
    }
    if (!formData.details.trim()) {
      setErrorMessage("Vui lòng nhập nội dung phản ánh.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage("");

    try {
      await createComplaint({
        title: formData.title,
        type: formData.type,
        content: formData.details,
      });
      setShowModal(false);
      setSuccessMessage("Phản ánh của bạn đã được gửi. Chúng tôi sẽ xử lý sớm nhất.");
      setTimeout(() => setSuccessMessage(""), 5000);
      loadComplaints();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Gửi phản ánh thất bại. Vui lòng thử lại.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };



  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getStatusClass = (status) => {
    if (status === "resolved") return "status-paid";
    return "status-processing";
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <div className="page-card-header-text">
          <h2>Phản ánh của cư dân</h2>
          <p>Theo dõi tiến độ xử lý phản ánh và gửi yêu cầu mới nhanh chóng.</p>
        </div>
      </div>

      <div className="summary-grid">
        {summary.map((item) => (
          <article key={item.label} className="summary-card">
            <span className="summary-label">{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="complaint-search">Tìm phản ánh</label>
          <input
            id="complaint-search"
            type="text"
            placeholder="Mã, tiêu đề hoặc loại phản ánh..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="page-actions-right">
          <button type="button" className="primary-btn" onClick={openModal}>
            + Gửi phản ánh
          </button>
        </div>
      </div>

      {successMessage && (
        <div style={{ marginBottom: "20px", marginTop: "8px", padding: "14px 18px", background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: "12px", color: "#166534", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMessage}
        </div>
      )}

      <div className="complaint-list">
        {loading ? (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>Đang tải dữ liệu...</p>
        ) : filteredComplaints.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>Chưa có phản ánh nào.</p>
        ) : (
          filteredComplaints.map((complaint) => (
            <article key={complaint.id} className="complaint-card">
              <div className="detail-row">
                <div>
                  <h3>{complaint.title}</h3>
                  <div className="complaint-meta">
                    <span>#{complaint.id}</span>
                    <span>{formatDate(complaint.created_at)}</span>
                    <span>{complaint.type || "Khác"}</span>
                  </div>
                </div>
                <span className={`status-pill ${getStatusClass(complaint.status)}`}>
                  {STATUS_LABELS[complaint.status] || complaint.status}
                </span>
              </div>
              <p style={{ color: "#475569", marginTop: "14px", lineHeight: 1.75, fontSize: "0.88rem" }}>
                {complaint.content || "Phản ánh được ghi nhận và đang được bộ phận quản lý xử lý."}
              </p>
              <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
                <Link to={`/complaints/${complaint.id}`} className="secondary-btn">
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h2>Gửi phản ánh mới</h2>
              <button type="button" onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modal-body">
                <div className="search-field">
                  <label htmlFor="modal-title">Tiêu đề</label>
                  <input id="modal-title" type="text" placeholder="Ví dụ: Cửa thang máy kẹt, ống nước rò rỉ..." value={formData.title} onChange={handleChange("title")} />
                </div>

                <div className="search-field">
                  <label htmlFor="modal-type">Loại yêu cầu</label>
                  <select id="modal-type" value={formData.type} onChange={handleChange("type")}>
                    <option value="Cơ sở vật chất">Cơ sở vật chất</option>
                    <option value="An toàn">An toàn</option>
                    <option value="Vệ sinh">Vệ sinh</option>
                    <option value="Âm thanh">Âm thanh</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="search-field">
                  <label htmlFor="modal-details">Nội dung phản ánh</label>
                  <textarea id="modal-details" placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." value={formData.details} onChange={handleChange("details")} rows={4} />
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="secondary-btn">Hủy</button>
                <button type="button" disabled={submitting} onClick={handleSubmit} className="primary-btn" style={submitting ? { opacity: 0.6 } : {}}>
                  {submitting ? "Đang gửi..." : "Gửi phản ánh"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
