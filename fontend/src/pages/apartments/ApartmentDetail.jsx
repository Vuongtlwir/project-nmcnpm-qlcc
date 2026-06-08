import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const apartments = [
  { id: "A-101", building: "Tòa A", owner: "Nguyễn Văn A", area: "78 m²", bedrooms: 2, status: "Đã bán", rent: "3.200.000đ" },
  { id: "B-302", building: "Tòa B", owner: "Trần Thị B", area: "60 m²", bedrooms: 1, status: "Trống", rent: "2.100.000đ" },
  { id: "C-205", building: "Tòa C", owner: "Lê Văn C", area: "95 m²", bedrooms: 3, status: "Đã bán", rent: "4.800.000đ" },
];

export default function ApartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const apartment = useMemo(
    () => apartments.find((item) => item.id === id),
    [id]
  );

  if (!apartment) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Không tìm thấy căn hộ</h2>
          <p>Không có căn hộ phù hợp với mã bạn cung cấp.</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate("/admin/apartments")}>Quay lại danh sách</button>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chi tiết căn hộ {apartment.id}</h2>
        <p>Xem thông tin đầy đủ của căn hộ và trạng thái quản lý.</p>
      </div>

      <div className="page-card" style={{ marginTop: "18px", padding: "22px" }}>
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Tòa nhà</span>
            <strong>{apartment.building}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Chủ sở hữu</span>
            <strong>{apartment.owner}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Diện tích</span>
            <strong>{apartment.area}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Số phòng</span>
            <strong>{apartment.bedrooms}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tiền thuê</span>
            <strong>{apartment.rent}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Trạng thái</span>
            <strong>{apartment.status}</strong>
          </div>
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "18px" }}>
          <Link to="/admin/apartments" className="secondary-btn">Quay lại</Link>
        </div>
      </div>
    </section>
  );
}
