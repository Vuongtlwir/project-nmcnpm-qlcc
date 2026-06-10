import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createApartment } from "../../services/apartmentService";

export default function AddApartments() {
  const [code, setCode] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState(1);
  const [area, setArea] = useState("");
  const [numRooms, setNumRooms] = useState(1);
  const [status, setStatus] = useState("empty");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!code.trim() || !building.trim() || !area || !ownerName.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    const payload = {
      code: code.trim(),
      floor: Number(floor) || 1,
      building: building.trim(),
      area: parseFloat(area) || 0,
      num_rooms: Number(numRooms) || 1,
      status,
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim() || null
    };

    try {
      setLoading(true);
      await createApartment(payload);
      window.alert("Thêm căn hộ thành công.");
      navigate("/admin/apartments");
    } catch (err) {
      console.error("Lỗi tạo căn hộ:", err);
      const apiMessage = err?.response?.data?.message || err?.message || "Lỗi khi thêm căn hộ";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Thêm căn hộ mới</h2>
        <p>Thêm thông tin căn hộ để quản lý danh sách tòa nhà tốt hơn.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
        <div className="search-field">
          <label htmlFor="code">Mã căn hộ</label>
          <input
            id="code"
            type="text"
            placeholder="A-101"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="building">Tòa nhà</label>
          <input
            id="building"
            type="text"
            placeholder="Tòa A"
            value={building}
            onChange={(event) => setBuilding(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="floor">Tầng</label>
          <input
            id="floor"
            type="number"
            min="1"
            value={floor}
            onChange={(event) => setFloor(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="area">Diện tích (m²)</label>
          <input
            id="area"
            type="number"
            min="0"
            step="0.1"
            placeholder="80"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="numRooms">Số phòng</label>
          <input
            id="numRooms"
            type="number"
            min="1"
            value={numRooms}
            onChange={(event) => setNumRooms(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="empty">Trống</option>
            <option value="occupied">Đang thuê</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="ownerName">Chủ sở hữu</label>
          <input
            id="ownerName"
            type="text"
            placeholder="Nguyễn Văn A"
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="ownerPhone">Số điện thoại chủ</label>
          <input
            id="ownerPhone"
            type="text"
            placeholder="0905123456"
            value={ownerPhone}
            onChange={(event) => setOwnerPhone(event.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <Link to="/admin/apartments" className="secondary-btn">
            Hủy
          </Link>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu căn hộ"}
          </button>
        </div>
      </form>
    </section>
  );
}
