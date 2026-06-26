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
  const [motorbikes, setMotorbikes] = useState(0);
  const [bicycles, setBicycles] = useState(0);
  const [cars, setCars] = useState(0);
  const [motorbikePlates, setMotorbikePlates] = useState("");
  const [carPlates, setCarPlates] = useState("");
  const [electricReading, setElectricReading] = useState(0);
  const [waterReading, setWaterReading] = useState(0);
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
      owner_phone: ownerPhone.trim() || null,
      motorbikes: Number(motorbikes) || 0,
      bicycles: Number(bicycles) || 0,
      cars: Number(cars) || 0,
      electricity_reading: Number(electricReading) || 0,
      water_reading: Number(waterReading) || 0,
      last_electricity_reading: Number(electricReading) || 0,
      last_water_reading: Number(waterReading) || 0,
      vehicle_plates: JSON.stringify({
        motorbikes: motorbikePlates.split(",").map(s => s.trim()).filter(Boolean),
        cars: carPlates.split(",").map(s => s.trim()).filter(Boolean),
      }),
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

        <h4 style={{ margin: "16px 0 8px", fontSize: "0.9rem" }}>Phương tiện</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div className="search-field">
            <label htmlFor="motorbikes">Xe máy</label>
            <input id="motorbikes" type="number" min="0" value={motorbikes} onChange={(e) => setMotorbikes(e.target.value)} placeholder="0" />
          </div>
          <div className="search-field">
            <label htmlFor="bicycles">Xe đạp</label>
            <input id="bicycles" type="number" min="0" value={bicycles} onChange={(e) => setBicycles(e.target.value)} placeholder="0" />
          </div>
          <div className="search-field">
            <label htmlFor="cars">Ô tô</label>
            <input id="cars" type="number" min="0" value={cars} onChange={(e) => setCars(e.target.value)} placeholder="0" />
          </div>
        </div>

        <h4 style={{ margin: "16px 0 8px", fontSize: "0.9rem" }}>Biển số xe (cách nhau bằng dấu phẩy)</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="search-field">
            <label htmlFor="motorbikePlates">Biển số xe máy</label>
            <input id="motorbikePlates" type="text" value={motorbikePlates} onChange={(e) => setMotorbikePlates(e.target.value)} placeholder="29F1-12345, 30B-67890" />
          </div>
          <div className="search-field">
            <label htmlFor="carPlates">Biển số ô tô</label>
            <input id="carPlates" type="text" value={carPlates} onChange={(e) => setCarPlates(e.target.value)} placeholder="30A-99999" />
          </div>
        </div>

        <h4 style={{ margin: "16px 0 8px", fontSize: "0.9rem" }}>Chỉ số đồng hồ</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="search-field">
            <label htmlFor="electricReading">Chỉ số điện ban đầu (kWh)</label>
            <input
              id="electricReading"
              type="number"
              min="0"
              value={electricReading}
              onChange={(event) => setElectricReading(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="search-field">
            <label htmlFor="waterReading">Chỉ số nước ban đầu (m³)</label>
            <input
              id="waterReading"
              type="number"
              min="0"
              value={waterReading}
              onChange={(event) => setWaterReading(event.target.value)}
              placeholder="0"
            />
          </div>
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
