import { useEffect, useMemo, useState } from "react";
import { getApartments, updateApartment } from "../../services/apartmentService";

const statusOptions = [
  { value: "empty", label: "Trống" },
  { value: "occupied", label: "Đang thuê" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "sold", label: "Đã bán" },
];

const getStatusClass = (status) => {
  if (status === "empty") return "status-pending";
  if (status === "occupied") return "status-paid";
  if (status === "maintenance") return "status-overdue";
  return "status-pending";
};

const getStatusText = (status) => {
  if (status === "empty") return "Trống";
  if (status === "occupied") return "Đang thuê";
  if (status === "maintenance") return "Bảo trì";
  if (status === "sold") return "Đã bán";
  return status || "N/A";
};

export default function ApartmentsList() {
  const [search, setSearch] = useState("");
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportDetails, setTransportDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [savingId, setSavingId] = useState(null);

  const getTransportCounts = (item) => ({
    motorbikes: item.motorcycles ?? item.motorbikes ?? item.motorbike_count ?? item.motorcycle_count ?? 0,
    bicycles: item.bicycles ?? item.bikes ?? item.bicycle_count ?? 0,
    cars: item.cars ?? item.car_count ?? item.auto_count ?? item.cars_count ?? 0,
  });

  const parsePlates = (json) => {
    try { return JSON.parse(json); } catch { return null; }
  };

  const showTransportDetails = (item) => {
    setTransportDetails({
      code: item.code,
      ...getTransportCounts(item),
      plates: parsePlates(item.vehicle_plates),
    });
  };

  const closeTransportDetails = () => setTransportDetails(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getApartments();
        setApartments(data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách căn hộ:", error);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingStatus(item.status || "empty");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingStatus("");
  };

  const saveStatus = async () => {
    if (!editingId) return;
    setSavingId(editingId);
    try {
      await updateApartment(editingId, { status: editingStatus });
      setApartments((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, status: editingStatus } : a))
      );
      setEditingId(null);
      setEditingStatus("");
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    } finally {
      setSavingId(null);
    }
  };

  const filteredApartments = useMemo(
    () =>
      apartments.filter((item) => {
        const keyword = search.toLowerCase();
        return (
          (item.code || "").toLowerCase().includes(keyword) ||
          (item.building || "").toLowerCase().includes(keyword) ||
          (item.owner_name || "").toLowerCase().includes(keyword)
        );
      }),
    [apartments, search]
  );

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý căn hộ</h2>
        <p>Xem danh sách căn hộ, trạng thái và truy cập nhanh chi tiết mỗi căn.</p>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="apartment-search">Tìm căn hộ</label>
          <input
            id="apartment-search"
            type="text"
            placeholder="Mã căn hộ, tòa nhà hoặc chủ sở hữu..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="page-actions-right">
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Mã căn hộ</th>
              <th>Tòa nhà</th>
              <th>Chủ sở hữu</th>
              <th>Diện tích</th>
              <th>Trạng thái</th>
              <th>Số phòng</th>
              <th>Phương tiện</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredApartments.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Không có căn hộ phù hợp.
                </td>
              </tr>
            ) : (
              filteredApartments.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.building || "N/A"}</td>
                  <td>{item.owner_name || "N/A"}</td>
                  <td>{item.area ? `${item.area} m²` : "N/A"}</td>
                  <td>
                    {editingId === item.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            border: "1px solid #d1d5db",
                            fontSize: "0.8rem",
                          }}
                          autoFocus
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="primary-btn"
                          style={{ padding: "4px 12px", fontSize: "0.78rem" }}
                          onClick={saveStatus}
                          disabled={savingId === item.id}
                        >
                          {savingId === item.id ? "..." : "Lưu"}
                        </button>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "4px 12px", fontSize: "0.78rem" }}
                          onClick={cancelEdit}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <span className={`status-pill ${getStatusClass(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    )}
                  </td>
                  <td>{item.num_rooms ?? "N/A"}</td>
                  <td>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => showTransportDetails(item)}
                    >
                      Chi tiết
                    </button>
                  </td>
                  <td>
                    {editingId !== item.id && (
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => startEdit(item)}
                        title="Đổi trạng thái"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {transportDetails && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={closeTransportDetails}
        >
          <div
            className="modal-container"
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              minWidth: "320px",
              maxWidth: "420px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0 }}>Phương tiện căn hộ {transportDetails.code}</h3>
                <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Số lượng xe theo loại</p>
              </div>
              <button type="button" className="secondary-btn" onClick={closeTransportDetails}>
                Đóng
              </button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: transportDetails.plates?.motorbikes?.length ? 8 : 0 }}>
                  <span>Xe máy</span>
                  <strong>{transportDetails.motorbikes}</strong>
                </div>
                {transportDetails.plates?.motorbikes?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {transportDetails.plates.motorbikes.map((p, i) => (
                      <span key={i} style={{ fontSize: "0.78rem", background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: "4px" }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Xe đạp</span>
                  <strong>{transportDetails.bicycles}</strong>
                </div>
              </div>
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: transportDetails.plates?.cars?.length ? 8 : 0 }}>
                  <span>Ô tô</span>
                  <strong>{transportDetails.cars}</strong>
                </div>
                {transportDetails.plates?.cars?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {transportDetails.plates.cars.map((p, i) => (
                      <span key={i} style={{ fontSize: "0.78rem", background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: "4px" }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
