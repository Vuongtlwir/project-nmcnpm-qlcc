import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddApartments() {
  const [building, setBuilding] = useState("");
  const [unit, setUnit] = useState("");
  const [owner, setOwner] = useState("");
  const [area, setArea] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/admin/apartments");
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Thêm căn hộ mới</h2>
        <p>Thêm thông tin căn hộ để quản lý danh sách tòa nhà tốt hơn.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
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
          <label htmlFor="unit">Mã căn hộ</label>
          <input
            id="unit"
            type="text"
            placeholder="A-101"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="owner">Chủ sở hữu</label>
          <input
            id="owner"
            type="text"
            placeholder="Nguyễn Văn A"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="area">Diện tích</label>
          <input
            id="area"
            type="text"
            placeholder="80 m²"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          />
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <Link to="/admin/apartments" className="secondary-btn">
            Hủy
          </Link>
          <button type="submit" className="primary-btn">
            Lưu căn hộ
          </button>
        </div>
      </form>
    </section>
  );
}
