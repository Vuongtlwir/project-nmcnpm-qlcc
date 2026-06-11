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
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, backdropFilter: "blur(4px)", padding: "20px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "520px",
              boxShadow: "0 25px 60px rgba(15,23,42,0.2)", overflow: "hidden",
              animation: "fadeIn 0.25s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                Gửi phản ánh mới
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  width: 32, height: 32, border: "none", background: "transparent",
                  cursor: "pointer", fontSize: "1.5rem", color: "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 8, transition: "all 0.15s ease",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{ padding: "20px 28px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }} htmlFor="modal-title">
                    Tiêu đề
                  </label>
                  <input
                    id="modal-title"
                    type="text"
                    placeholder="Ví dụ: Cửa thang máy kẹt, ống nước rò rỉ..."
                    value={formData.title}
                    onChange={handleChange("title")}
                    style={{
                      width: "100%", border: "1px solid #e2e8f0", borderRadius: 9,
                      padding: "9px 13px", outline: "none", fontSize: "0.88rem",
                      background: "#f8fafc", color: "#0f172a", transition: "all 0.2s ease",
                      fontFamily: "var(--font-sans)", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }} htmlFor="modal-type">
                    Loại yêu cầu
                  </label>
                  <select
                    id="modal-type"
                    value={formData.type}
                    onChange={handleChange("type")}
                    style={{
                      width: "100%", border: "1px solid #e2e8f0", borderRadius: 9,
                      padding: "9px 13px", outline: "none", fontSize: "0.88rem",
                      background: "#f8fafc", color: "#0f172a", transition: "all 0.2s ease",
                      fontFamily: "var(--font-sans)", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
                  >
                    <option value="Cơ sở vật chất">Cơ sở vật chất</option>
                    <option value="An toàn">An toàn</option>
                    <option value="Vệ sinh">Vệ sinh</option>
                    <option value="Âm thanh">Âm thanh</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }} htmlFor="modal-details">
                    Nội dung phản ánh
                  </label>
                  <textarea
                    id="modal-details"
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    value={formData.details}
                    onChange={handleChange("details")}
                    rows={4}
                    style={{
                      width: "100%", border: "1px solid #e2e8f0", borderRadius: 9,
                      padding: "9px 13px", outline: "none", fontSize: "0.88rem",
                      background: "#f8fafc", color: "#0f172a", transition: "all 0.2s ease",
                      fontFamily: "var(--font-sans)", boxSizing: "border-box",
                      resize: "vertical", minHeight: "100px",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {errorMessage && (
                  <div style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {errorMessage}
                  </div>
                )}
              </div>

              <div style={{ padding: "16px 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px", borderRadius: 9, border: "none",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.88rem",
                    fontFamily: "var(--font-sans)", background: "#f1f5f9", color: "#0f172a",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 20px", borderRadius: 9, border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontWeight: 600, fontSize: "0.88rem",
                    fontFamily: "var(--font-sans)", background: submitting ? "#93c5fd" : "#2563eb", color: "#fff",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => { if (!submitting) e.currentTarget.style.background = "#1d4ed8"; }}
                  onMouseOut={(e) => { if (!submitting) e.currentTarget.style.background = "#2563eb"; }}
                >
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
