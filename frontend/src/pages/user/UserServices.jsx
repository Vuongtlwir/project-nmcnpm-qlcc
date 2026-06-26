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

      <div className="tab-group">
        <button type="button" onClick={() => setTab("services")} className={`tab-btn ${tab === "services" ? "active" : ""}`}>
          Danh sách dịch vụ
        </button>
        <button type="button" onClick={() => setTab("bookings")} className={`tab-btn ${tab === "bookings" ? "active" : ""}`}>
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Đăng ký: {selectedService?.name}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modal-body">
                <div className="search-field">
                  <label htmlFor="booking-date">Ngày đăng ký <span style={{ color: "#ef4444" }}>*</span></label>
                  <input id="booking-date" type="date" value={formData.booking_date} onChange={handleChange("booking_date")} />
                </div>

                <div className="search-field">
                  <label htmlFor="booking-time">Giờ đăng ký</label>
                  <input id="booking-time" type="time" value={formData.booking_time} onChange={handleChange("booking_time")} />
                </div>

                <div className="search-field">
                  <label htmlFor="booking-notes">Ghi chú</label>
                  <textarea id="booking-notes" placeholder="Ghi chú thêm cho ban quản lý..." value={formData.notes} onChange={handleChange("notes")} rows={3} />
                </div>

                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="secondary-btn">Hủy</button>
                <button type="button" disabled={submitting} onClick={handleSubmit} className="primary-btn" style={submitting ? { opacity: 0.6 } : {}}>
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