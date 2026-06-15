import { useEffect, useMemo, useRef, useState } from "react";
import { getServices, createBooking, getBookings, updateBooking } from "../../services/serviceService";

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function UserServices() {
  const [tab, setTab] = useState("services");
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    booking_date: "",
    booking_time: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [svc, bks] = await Promise.all([getServices(), getBookings()]);
      setServices(svc);
      setBookings(bks);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") return "status-paid";
    if (status === "completed") return "status-paid";
    if (status === "cancelled") return "status-processing";
    return "status-processing";
  };

  const openBookingModal = (service) => {
    setSelectedService(service);
    setFormData({
      booking_date: "",
      booking_time: "",
      notes: "",
    });
    setErrorMessage("");
    setShowModal(true);
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    if (!formData.booking_date) {
      setErrorMessage("Vui lòng chọn ngày đăng ký.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage("");

    try {
      await createBooking({
        service_id: selectedService.id,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time || null,
        notes: formData.notes || null,
      });
      setShowModal(false);
      setSuccessMessage("Đăng ký dịch vụ thành công! Chúng tôi sẽ xác nhận sớm nhất.");
      setTimeout(() => setSuccessMessage(""), 5000);
      loadData();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Bạn có chắc muốn hủy đăng ký này?")) return;
    try {
      await updateBooking(bookingId, { status: "cancelled" });
      setSuccessMessage("Đã hủy đăng ký dịch vụ.");
      setTimeout(() => setSuccessMessage(""), 5000);
      loadData();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Hủy đăng ký thất bại.");
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <div className="page-card-header-text">
          <h2>Dịch vụ chung cư</h2>
          <p>Đăng ký các dịch vụ tiện ích tại chung cư.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setTab("services")}
          style={{
            padding: "8px 18px", borderRadius: "8px", border: "none",
            cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
            fontFamily: "var(--font-sans)",
            background: tab === "services" ? "#2563eb" : "#f1f5f9",
            color: tab === "services" ? "#fff" : "#0f172a",
            transition: "all 0.15s ease",
          }}
        >
          Danh sách dịch vụ
        </button>
        <button
          type="button"
          onClick={() => setTab("bookings")}
          style={{
            padding: "8px 18px", borderRadius: "8px", border: "none",
            cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
            fontFamily: "var(--font-sans)",
            background: tab === "bookings" ? "#2563eb" : "#f1f5f9",
            color: tab === "bookings" ? "#fff" : "#0f172a",
            transition: "all 0.15s ease",
          }}
        >
          Đăng ký của tôi
        </button>
      </div>

      {successMessage && (
        <div style={{ marginBottom: "20px", padding: "14px 18px", background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: "12px", color: "#166534", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMessage}
        </div>
      )}

      {loading ? (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>Đang tải dữ liệu...</p>
      ) : tab === "services" ? (
        <div className="complaint-list">
          {services.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>Chưa có dịch vụ nào.</p>
          ) : (
            services.map((service) => (
              <article key={service.id} className="complaint-card">
                <div className="detail-row">
                  <div>
                    <h3>{service.name}</h3>
                    <div className="complaint-meta">
                      <span>{formatPrice(service.price)}</span>
                      {service.unit && <span>/{service.unit}</span>}
                    </div>
                  </div>
                </div>
                <p style={{ color: "#475569", marginTop: "14px", lineHeight: 1.75, fontSize: "0.88rem" }}>
                  {service.description || "Không có mô tả."}
                </p>
                <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
                  <button
                    type="button"
                    className="primary-btn"
                    style={{ fontSize: "0.83rem", padding: "8px 16px" }}
                    onClick={() => openBookingModal(service)}
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="complaint-list">
          {bookings.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>Bạn chưa đăng ký dịch vụ nào.</p>
          ) : (
            bookings.map((booking) => (
              <article key={booking.id} className="complaint-card">
                <div className="detail-row">
                  <div>
                    <h3>{booking.service_name}</h3>
                    <div className="complaint-meta">
                      <span>Mã: {booking.booking_code}</span>
                      <span>Ngày: {formatDate(booking.booking_date)}</span>
                      {booking.booking_time && <span>Giờ: {booking.booking_time}</span>}
                    </div>
                  </div>
                  <span className={`status-pill ${getStatusClass(booking.status)}`}>
                    {STATUS_LABELS[booking.status] || booking.status}
                  </span>
                </div>
                {booking.notes && (
                  <p style={{ color: "#475569", marginTop: "10px", lineHeight: 1.75, fontSize: "0.88rem" }}>
                    Ghi chú: {booking.notes}
                  </p>
                )}
                {booking.admin_response && (
                  <p style={{ color: "#2563eb", marginTop: "6px", lineHeight: 1.75, fontSize: "0.85rem" }}>
                    Phản hồi: {booking.admin_response}
                  </p>
                )}
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "10px", fontSize: "0.8rem", color: "#94a3b8" }}>
                  <span>Đăng ký: {formatDateTime(booking.created_at)}</span>
                </div>
                {booking.status === "pending" && (
                  <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "8px" }}>
                    <button
                      type="button"
                      className="secondary-btn"
                      style={{ fontSize: "0.8rem", padding: "6px 14px", color: "#ef4444", borderColor: "#fecaca" }}
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Hủy đăng ký
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}

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
              background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "480px",
              boxShadow: "0 25px 60px rgba(15,23,42,0.2)", overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                Đăng ký: {selectedService?.name}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  width: 32, height: 32, border: "none", background: "transparent",
                  cursor: "pointer", fontSize: "1.5rem", color: "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{ padding: "20px 28px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }} htmlFor="booking-date">
                    Ngày đăng ký <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={formData.booking_date}
                    onChange={handleChange("booking_date")}
                    style={{
                      width: "100%", border: "1px solid #e2e8f0", borderRadius: 9,
                      padding: "9px 13px", outline: "none", fontSize: "0.88rem",
                      background: "#f8fafc", color: "#0f172a",
                      fontFamily: "var(--font-sans)", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }} htmlFor="booking-time">
                    Giờ đăng ký
                  </label>
                  <input
                    id="booking-time"
                    type="time"
                    value={formData.booking_time}
                    onChange={handleChange("booking_time")}
                    style={{
                      width: "100%", border: "1px solid #e2e8f0", borderRadius: 9,
                      padding: "9px 13px", outline: "none", fontSize: "0.88rem",
                      background: "#f8fafc", color: "#0f172a",
                      fontFamily: "var(--font-sans)", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#0f172a", marginBottom: 5 }} htmlFor="booking-notes">
                    Ghi chú
                  </label>
                  <textarea
                    id="booking-notes"
                    placeholder="Ghi chú thêm cho ban quản lý..."
                    value={formData.notes}
                    onChange={handleChange("notes")}
                    rows={3}
                    style={{
                      width: "100%", border: "1px solid #e2e8f0", borderRadius: 9,
                      padding: "9px 13px", outline: "none", fontSize: "0.88rem",
                      background: "#f8fafc", color: "#0f172a",
                      fontFamily: "var(--font-sans)", boxSizing: "border-box",
                      resize: "vertical", minHeight: "80px",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                </div>

                {errorMessage && (
                  <div style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b", fontSize: "0.85rem" }}>
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
                  }}
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
                  }}
                >
                  {submitting ? "Đang gửi..." : "Xác nhận đăng ký"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}