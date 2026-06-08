import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addResident } from "../../services/residentService";

const availableUnits = ["A-101", "B-302", "C-205"];

export default function AddResident() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState(availableUnits[0]);
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !unit.trim() || !nationalId.trim() || !phone.trim() || !email.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin cư dân.");
      return;
    }

    const newResident = addResident({ name, unit, nationalId, phone, email });
    window.alert(
      `Đã tạo cư dân mới. Tài khoản:
Username: ${newResident.username}
Password: ${newResident.password}
Thông tin đăng nhập đã được gửi về email: ${newResident.email}`
    );
    navigate("/admin/residents");
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Thêm cư dân mới</h2>
        <p>Nhập thông tin cư dân để bổ sung vào hệ thống quản lý.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
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
          <label htmlFor="unit">Căn hộ</label>
          <select
            id="unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          >
            {availableUnits.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="search-field">
          <label htmlFor="nationalId">Số căn cước công dân</label>
          <input
            id="nationalId"
            type="text"
            placeholder="012345678901"
            value={nationalId}
            onChange={(event) => setNationalId(event.target.value)}
          />
        </div>
        <div className="search-field">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="text"
            placeholder="0905 123 456"
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

        {error && <p className="error-message">{error}</p>}

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn" onClick={() => navigate("/admin/residents")}>Hủy</button>
          <button type="submit" className="primary-btn">Lưu cư dân</button>
        </div>
      </form>
    </section>
  );
}
