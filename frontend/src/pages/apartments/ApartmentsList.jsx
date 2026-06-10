import { useEffect, useMemo, useState } from "react";
import { getApartments } from "../../services/apartmentService";

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
  return status || "N/A";
};

export default function ApartmentsList() {
  const [search, setSearch] = useState("");
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportDetails, setTransportDetails] = useState(null);

  const getTransportCounts = (item) => ({
    motorbikes: item.motorcycles ?? item.motorbikes ?? item.motorbike_count ?? item.motorcycle_count ?? 0,
    bicycles: item.bicycles ?? item.bikes ?? item.bicycle_count ?? 0,
    cars: item.cars ?? item.car_count ?? item.auto_count ?? item.cars_count ?? 0,
  });

  const showTransportDetails = (item) => {
    setTransportDetails({
      code: item.code,
      ...getTransportCounts(item),
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

        <div className="action-group">
          {/* Nút thêm căn hộ đã bị gỡ theo yêu cầu */}
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredApartments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
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
                    <span className={`status-pill ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
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
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <span>Xe máy</span>
                <strong>{transportDetails.motorbikes}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <span>Xe đạp</span>
                <strong>{transportDetails.bicycles}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <span>Ô tô</span>
                <strong>{transportDetails.cars}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
