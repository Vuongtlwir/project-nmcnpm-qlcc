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
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

    if (!name.trim() || !apartmentId || !dateOfBirth || !nationalId.trim() || !phone.trim() || !email.trim() || !moveInDate) {
      setError("Vui lòng nhập đầy đủ thông tin cư dân.");
      return;
    }

    const payload = {
      full_name: name.trim(),
      apartment_id: Number(apartmentId),
      date_of_birth: dateOfBirth,
      gender,
      id_card: nationalId.trim(),
      phone: phone.trim(),
      email: email.trim(),
      relation,
      move_in_date: moveInDate
    };

    try {
      setLoading(true);
      const created = await createResident(payload);
      let message = "Thêm cư dân thành công.";
      if (created?.user_credentials) {
        message += `\nTài khoản:\nUsername: ${created.user_credentials.username}\nPassword: ${created.user_credentials.password}`;
      }
      window.alert(message);
      navigate("/admin/residents");
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
        <h2>Thêm cư dân mới</h2>
        <p>Nhập đầy đủ thông tin cư dân và chọn căn hộ có sẵn trong hệ thống để quản lý hiệu quả.</p>
      </div>

      <div className="highlight-card">
        <p>Form này sẽ tự động tạo tài khoản cư dân khi bạn lưu. Hệ thống sẽ dùng số CMND/CCCD làm tên đăng nhập.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
        <div className="form-grid">
          <div className="form-card">
            <h3>Thông tin cá nhân</h3>
            <div className="search-field">
              <label htmlFor="name">Họ và tên</label>
              <input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="nationalId">Số CMND/CCCD</label>
              <input
                id="nationalId"
                type="text"
                placeholder="012345678901"
                value={nationalId}
                onChange={(event) => setNationalId(event.target.value)}
              />
            </div>
          </div>

          <div className="form-card">
            <h3>Thông tin liên hệ & căn hộ</h3>
            <div className="search-field">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="text"
                placeholder="0905123456"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="a@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="apartment">Chọn căn hộ (chỉ căn hộ trống)</label>
              {apartments.length > 0 ? (
                <select
                  id="apartment"
                  value={apartmentId}
                  onChange={(event) => setApartmentId(event.target.value)}
                >
                  {apartments.map((apartment) => (
                    <option key={apartment.id} value={apartment.id}>
                      {apartment.code} - {apartment.building} ({apartment.area ? `${apartment.area} m²` : "N/A"})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="section-note">
                  Hiện không có căn hộ trống để thêm cư dân. Vui lòng tạo hoặc cập nhật trạng thái căn hộ trước khi tiếp tục.
                </div>
              )}
            </div>
            <div className="search-field">
              <label htmlFor="relation">Mối quan hệ</label>
              <select
                id="relation"
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
              >
                <option value="owner">Chủ sở hữu</option>
                <option value="tenant">Người thuê</option>
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="moveInDate">Ngày chuyển vào</label>
              <input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(event) => setMoveInDate(event.target.value)}
              />
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="page-actions" style={{ justifyContent: "space-between", gap: "16px" }}>
          <button type="button" className="secondary-btn" onClick={() => navigate("/admin/residents")}>Hủy</button>
          <button
            type="button"
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading || apartments.length === 0}
          >
            {loading ? "Đang lưu..." : "Lưu cư dân"}
          </button>
        </div>
      </form>
    </section>
  );
}
