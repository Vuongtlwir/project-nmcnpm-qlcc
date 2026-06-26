import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResident } from "../../services/residentService";
import { getApartments } from "../../services/apartmentService";

export default function AddResident() {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [apartmentId, setApartmentId] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState("tenant");
  const [moveInDate, setMoveInDate] = useState("");
  const [motorbikes, setMotorbikes] = useState(0);
  const [bicycles, setBicycles] = useState(0);
  const [cars, setCars] = useState(0);
  const [motorbikePlates, setMotorbikePlates] = useState("");
  const [carPlates, setCarPlates] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await getApartments();
        const available = (data || []).filter((item) => item.status === "empty");
        setApartments(available);
        if (available.length > 0) {
          setApartmentId(available[0].id.toString());
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách căn hộ:", err);
      }
    };

    loadApartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(null);

    if (!name.trim() || !apartmentId || !dateOfBirth || !nationalId.trim() || !email.trim() || !moveInDate) {
      setError("Vui lòng nhập đầy đủ thông tin cư dân.");
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, "");

    const payload = {
      full_name: name.trim(),
      apartment_id: Number(apartmentId),
      date_of_birth: dateOfBirth,
      gender,
      id_card: nationalId.trim(),
      phone: cleanPhone || null,
      email: email.trim(),
      relation,
      move_in_date: moveInDate,
      motorbikes: Number(motorbikes) || 0,
      bicycles: Number(bicycles) || 0,
      cars: Number(cars) || 0,
      vehicle_plates: JSON.stringify({
        motorbikes: motorbikePlates.split(",").map(s => s.trim()).filter(Boolean),
        cars: carPlates.split(",").map(s => s.trim()).filter(Boolean),
      }),
    };

    try {
      setLoading(true);
      const created = await createResident(payload);
      setSuccess({ ...created, passwordSent: true });
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.message || "Lỗi khi thêm cư dân";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <div className="page-card-header-text">
          <h2>Thêm cư dân mới</h2>
          <p>Nhập đầy đủ thông tin cư dân và chọn căn hộ có sẵn trong hệ thống.</p>
        </div>
      </div>

      {success ? (
        <div style={{ marginTop: 24 }}>
          <div style={{ padding: "20px 24px", background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 style={{ margin: 0, color: "#166534", fontSize: "1.05rem" }}>Thêm cư dân thành công!</h3>
            </div>
            <p style={{ margin: 0, color: "#15803d", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Cư dân <strong>{success.full_name}</strong> đã được thêm vào căn hộ.
              {success.passwordSent && " Thông tin đăng nhập đã được gửi đến email của cư dân."}
            </p>
          </div>

          {success.user_credentials && (
            <div style={{ padding: "20px 24px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, marginBottom: 20 }}>
              <h4 style={{ margin: "0 0 10px", color: "#92400e", fontSize: "0.95rem" }}>Thông tin tài khoản</h4>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 16px", fontSize: "0.88rem" }}>
                <span style={{ color: "#92400e", fontWeight: 600 }}>Tên đăng nhập:</span>
                <span style={{ color: "#0f172a", fontWeight: 700, fontFamily: "monospace", fontSize: "1rem" }}>{success.user_credentials.username}</span>
                <span style={{ color: "#92400e", fontWeight: 600 }}>Mật khẩu:</span>
                <span style={{ color: "#0f172a", fontWeight: 700, fontFamily: "monospace", fontSize: "1rem" }}>{success.user_credentials.password}</span>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: "0.82rem", color: "#92400e" }}>
                Cư dân có thể đăng nhập bằng tên đăng nhập và email đã đăng ký.
              </p>
            </div>
          )}

          <div className="page-actions" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="primary-btn" onClick={() => navigate("/admin/residents")}>
              Quay lại danh sách
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div className="form-row">
            <div className="page-card" style={{ padding: "24px" }}>
              <h3 style={{ margin: "0 0 18px", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Thông tin cá nhân</h3>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input id="name" type="text" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-row" style={{ gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Ngày sinh</label>
                  <input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Giới tính</label>
                  <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="nationalId">Số CMND/CCCD</label>
                <input id="nationalId" type="text" placeholder="012345678901" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
                <small style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 4, display: "block" }}>
                  Số CMND/CCCD sẽ được dùng làm tên đăng nhập cho cư dân.
                </small>
              </div>
            </div>

            <div className="page-card" style={{ padding: "24px" }}>
              <h3 style={{ margin: "0 0 18px", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Thông tin liên hệ & căn hộ</h3>
              <div className="form-row" style={{ gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input id="phone" type="text" placeholder="0905123456" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="a@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="apartment">Chọn căn hộ</label>
                {apartments.length > 0 ? (
                  <select id="apartment" value={apartmentId} onChange={(e) => setApartmentId(e.target.value)}>
                    {apartments.map((apartment) => (
                      <option key={apartment.id} value={apartment.id}>
                        {apartment.code} - {apartment.building} ({apartment.area ? `${apartment.area} m²` : "N/A"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ padding: "12px 14px", background: "#fef3c7", borderRadius: 9, fontSize: "0.85rem", color: "#92400e" }}>
                    Hiện không có căn hộ trống. Vui lòng tạo hoặc cập nhật trạng thái căn hộ trước.
                  </div>
                )}
              </div>
              <div className="form-row" style={{ gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="relation">Mối quan hệ</label>
                  <select id="relation" value={relation} onChange={(e) => setRelation(e.target.value)}>
                    <option value="owner">Chủ sở hữu</option>
                    <option value="tenant">Người thuê</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="moveInDate">Ngày chuyển vào</label>
                  <input id="moveInDate" type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="page-card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Phương tiện</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label htmlFor="motorbikes">Xe máy</label>
                <input id="motorbikes" type="number" min="0" value={motorbikes} onChange={(e) => setMotorbikes(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label htmlFor="bicycles">Xe đạp</label>
                <input id="bicycles" type="number" min="0" value={bicycles} onChange={(e) => setBicycles(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label htmlFor="cars">Ô tô</label>
                <input id="cars" type="number" min="0" value={cars} onChange={(e) => setCars(e.target.value)} placeholder="0" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label htmlFor="motorbikePlates">Biển số xe máy</label>
                <input id="motorbikePlates" type="text" value={motorbikePlates} onChange={(e) => setMotorbikePlates(e.target.value)} placeholder="29F1-12345, 30B-67890" />
                <small style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 4, display: "block" }}>Nhiều biển số cách nhau bằng dấu phẩy</small>
              </div>
              <div className="form-group">
                <label htmlFor="carPlates">Biển số ô tô</label>
                <input id="carPlates" type="text" value={carPlates} onChange={(e) => setCarPlates(e.target.value)} placeholder="30A-99999" />
                <small style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 4, display: "block" }}>Nhiều biển số cách nhau bằng dấu phẩy</small>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: "14px 18px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b", fontSize: "0.88rem", marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" className="secondary-btn" onClick={() => navigate("/admin/residents")}>Hủy</button>
            <button type="submit" className="primary-btn" disabled={loading || apartments.length === 0}>
              {loading ? "Đang lưu..." : "Lưu cư dân"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
