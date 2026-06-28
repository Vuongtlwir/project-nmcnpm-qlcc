import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getApartmentById, updateApartment } from "../../services/apartmentService";
import Modal from "../../components/Modal";

const getStatusText = (status) => {
  if (status === "empty") return "Trống";
  if (status === "occupied") return "Đang thuê";
  if (status === "maintenance") return "Bảo trì";
  return status || "N/A";
};

function parsePlates(apartment) {
  if (!apartment?.vehicle_plates) return null;
  try { return JSON.parse(apartment.vehicle_plates); } catch { return null; }
}

export default function ApartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPlatesModal, setShowPlatesModal] = useState(false);
  const [editPlates, setEditPlates] = useState({ motorbikes: [], cars: [] });
  const [saving, setSaving] = useState(false);

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

  const openPlatesModal = () => {
    const plates = parsePlates(apartment) || { motorbikes: [], cars: [] };
    setEditPlates({ motorbikes: [...(plates.motorbikes || [])], cars: [...(plates.cars || [])] });
    setShowPlatesModal(true);
  };

  const handleSavePlates = async () => {
    setSaving(true);
    try {
      const payload = { vehicle_plates: JSON.stringify(editPlates) };
      await updateApartment(id, payload);
      setApartment(prev => ({ ...prev, ...payload }));
      setShowPlatesModal(false);
    } catch (err) {
      console.error("Lỗi cập nhật biển số xe:", err);
    } finally {
      setSaving(false);
    }
  };

  const addPlate = (type) => {
    setEditPlates(prev => ({ ...prev, [type]: [...prev[type], ""] }));
  };

  const removePlate = (type, index) => {
    setEditPlates(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updatePlate = (type, index, value) => {
    setEditPlates(prev => {
      const updated = [...prev[type]];
      updated[index] = value;
      return { ...prev, [type]: updated };
    });
  };

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
          <div className="summary-card">
            <span className="summary-label">Xe máy</span>
            <strong>{apartment.motorbikes ?? 0}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Xe đạp</span>
            <strong>{apartment.bicycles ?? 0}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Ô tô</span>
            <strong>{apartment.cars ?? 0}</strong>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Biển số xe</h4>
            <button onClick={openPlatesModal} className="secondary-btn" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>
              {parsePlates(apartment) ? "Chỉnh sửa" : "Thêm biển số"}
            </button>
          </div>
          {(() => {
            const plates = parsePlates(apartment);
            if (!plates) return <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>Chưa có biển số xe</p>;
            return (
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {plates.motorbikes?.length > 0 && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Xe máy:</span>
                    <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
                      {plates.motorbikes.map((p, i) => (
                        <span key={i} style={{ fontSize: "0.82rem", background: "#e0e7ff", color: "#4338ca", padding: "2px 10px", borderRadius: "4px" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
                {plates.cars?.length > 0 && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Ô tô:</span>
                    <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
                      {plates.cars.map((p, i) => (
                        <span key={i} style={{ fontSize: "0.82rem", background: "#dbeafe", color: "#1d4ed8", padding: "2px 10px", borderRadius: "4px" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end", marginTop: "18px" }}>
          <Link to="/admin/apartments" className="secondary-btn">Quay lại</Link>
        </div>
      </div>

      <Modal
        isOpen={showPlatesModal}
        title="Quản lý biển số xe"
        onClose={() => setShowPlatesModal(false)}
        onConfirm={handleSavePlates}
        confirmText="Lưu"
        loading={saving}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.9rem" }}>Xe máy</strong>
              <button className="secondary-btn" style={{ padding: "2px 10px", fontSize: "0.8rem" }} onClick={() => addPlate("motorbikes")}>+ Thêm</button>
            </div>
            {editPlates.motorbikes.length === 0 && <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Chưa có biển số</p>}
            {editPlates.motorbikes.map((plate, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => updatePlate("motorbikes", i, e.target.value)}
                  placeholder="VD: 51F1-12345"
                  style={{ flex: 1, padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.85rem" }}
                />
                <button className="modal-cancel-btn" style={{ padding: "4px 10px" }} onClick={() => removePlate("motorbikes", i)}>Xóa</button>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.9rem" }}>Ô tô</strong>
              <button className="secondary-btn" style={{ padding: "2px 10px", fontSize: "0.8rem" }} onClick={() => addPlate("cars")}>+ Thêm</button>
            </div>
            {editPlates.cars.length === 0 && <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Chưa có biển số</p>}
            {editPlates.cars.map((plate, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => updatePlate("cars", i, e.target.value)}
                  placeholder="VD: 51A-12345"
                  style={{ flex: 1, padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.85rem" }}
                />
                <button className="modal-cancel-btn" style={{ padding: "4px 10px" }} onClick={() => removePlate("cars", i)}>Xóa</button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </section>
  );
}
