import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getApartmentById } from "../../services/apartmentService";

const getStatusText = (status) => {
  if (status === "empty") return "Trống";
  if (status === "occupied") return "Đang thuê";
  if (status === "maintenance") return "Bảo trì";
  return status || "N/A";
};

export default function ApartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApartment = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getApartmentById(id);
        if (!data) {
          setError("Không tìm thấy căn hộ.");
          setApartment(null);
        } else {
          setApartment(data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết căn hộ:", err);
        setError("Không thể tải thông tin căn hộ.");
        setApartment(null);
      } finally {
        setLoading(false);
      }
    };

    loadApartment();
  }, [id]);

  if (loading) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Chi tiết căn hộ</h2>
          <p>Đang tải thông tin...</p>
        </div>
      </section>
    );
  }

  if (error || !apartment) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Không tìm thấy căn hộ</h2>
          <p>{error || "Không có căn hộ phù hợp với mã bạn cung cấp."}</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate("/admin/apartments")}>Quay lại danh sách</button>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chi tiết căn hộ {apartment.code}</h2>
        <p>Xem thông tin đầy đủ của căn hộ và trạng thái quản lý.</p>
      </div>

      <div className="page-card" style={{ marginTop: "18px", padding: "22px" }}>
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Mã căn hộ</span>
            <strong>{apartment.code}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tòa nhà</span>
            <strong>{apartment.building || "N/A"}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tầng</span>
            <strong>{apartment.floor ?? "N/A"}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Diện tích</span>
            <strong>{apartment.area ? `${apartment.area} m²` : "N/A"}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Số phòng</span>
            <strong>{apartment.num_rooms ?? "N/A"}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Chủ sở hữu</span>
            <strong>{apartment.owner_name || "N/A"}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Số điện thoại chủ</span>
            <strong>{apartment.owner_phone || "N/A"}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Trạng thái</span>
            <strong>{getStatusText(apartment.status)}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Chỉ số điện</span>
            <strong>{apartment.electricity_reading ?? 0} kWh</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Chỉ số nước</span>
            <strong>{apartment.water_reading ?? 0} m³</strong>
          </div>
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "18px" }}>
          <Link to="/admin/apartments" className="secondary-btn">Quay lại</Link>
        </div>
      </div>
    </section>
  );
}
