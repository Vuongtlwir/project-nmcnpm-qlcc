import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function ComplaintList() {
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([
    { id: "PH-001", title: "Ống nước rò rỉ", date: "28/05/2026", status: "Đang xử lý", type: "Cơ sở vật chất" },
    { id: "PH-002", title: "Trung tâm thang máy chập chờn", date: "22/05/2026", status: "Hoàn thành", type: "An toàn" },
    { id: "PH-003", title: "Phát sinh rác thải không đúng quy định", date: "30/05/2026", status: "Đang xử lý", type: "Vệ sinh" },
  ]);

  const summary = [
    { label: "Đang xử lý", value: 2, status: "processing" },
    { label: "Hoàn thành", value: 1, status: "paid" },
  ];

  const [formData, setFormData] = useState({
    title: "",
    type: "Cơ sở vật chất",
    details: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const filteredComplaints = useMemo(
    () => complaints.filter((item) => {
      const keyword = search.toLowerCase();
      return item.title.toLowerCase().includes(keyword) || item.id.toLowerCase().includes(keyword) || item.type.toLowerCase().includes(keyword);
    }),
    [search, complaints]
  );

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.details.trim()) {
      return;
    }

    const nextId = `PH-${String(complaints.length + 1).padStart(3, "0")}`;
    const newComplaint = {
      id: nextId,
      title: formData.title,
      type: formData.type,
      date: new Date().toLocaleDateString("vi-VN"),
      status: "Đang xử lý",
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setFormData({ title: "", type: "Cơ sở vật chất", details: "" });
    setSuccessMessage("Phản ánh của bạn đã được gửi. Chúng tôi sẽ xử lý sớm nhất.");

    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Phản ánh của cư dân</h2>
        <p>Theo dõi tiến độ xử lý phản ánh và gửi yêu cầu mới nhanh chóng.</p>
      </div>

      <div className="summary-grid">
        {summary.map((item) => (
          <article key={item.label} className="summary-card">
            <span className="summary-label">{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="page-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
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

        <div className="complaint-form page-card" style={{ marginTop: "24px", padding: "20px" }}>
          <h3 style={{ marginBottom: "16px" }}>Gửi phản ánh mới</h3>
          {successMessage && (
            <div style={{ marginBottom: "16px", color: "#166534", background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: "14px", padding: "14px" }}>
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="search-field">
              <label htmlFor="complaint-title">Tiêu đề</label>
              <input
                id="complaint-title"
                type="text"
                placeholder="Ví dụ: Cửa thang máy kẹt"
                value={formData.title}
                onChange={handleChange("title")}
              />
            </div>

            <div className="search-field">
              <label htmlFor="complaint-type">Loại yêu cầu</label>
              <select
                id="complaint-type"
                value={formData.type}
                onChange={handleChange("type")}
                style={{ padding: "14px 16px", borderRadius: "14px", border: "1px solid #d1d5db", background: "white", width: "100%" }}
              >
                <option>Cơ sở vật chất</option>
                <option>An toàn</option>
                <option>Vệ sinh</option>
                <option>Âm thanh</option>
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="complaint-details">Nội dung phản ánh</label>
              <textarea
                id="complaint-details"
                placeholder="Mô tả chi tiết vấn đề..."
                value={formData.details}
                onChange={handleChange("details")}
                rows={4}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="action-group" style={{ justifyContent: "flex-end", marginTop: "14px" }}>
              <button type="submit" className="primary-btn">Gửi phản ánh</button>
            </div>
          </form>
        </div>
      </div>

      <div className="complaint-list">
        {filteredComplaints.map((complaint) => (
          <article key={complaint.id} className="complaint-card">
            <div className="detail-row">
              <div>
                <h3>{complaint.title}</h3>
                <div className="complaint-meta">
                  <span>{complaint.id}</span>
                  <span>{complaint.date}</span>
                  <span>{complaint.type}</span>
                </div>
              </div>
              <span className={`status-pill ${complaint.status === "Hoàn thành" ? "status-paid" : "status-processing"}`}>
                {complaint.status}
              </span>
            </div>
            <p style={{ color: "#475569", marginTop: "14px", lineHeight: 1.75 }}>
              Phản ánh được ghi nhận và đang được bộ phận quản lý xử lý. Bạn sẽ nhận được thông báo ngay khi có cập nhật.
            </p>
            <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
              <Link to={`/complaints/${complaint.id}`} className="secondary-btn">
                Xem chi tiết
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
