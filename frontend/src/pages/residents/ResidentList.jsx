import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { getResidents } from "../../services/residentService";
import { createFee } from "../../services/feeService";
import { getApartmentById } from "../../services/apartmentService";

const serviceFees = [
  { id: "F-001", label: "Phí vệ sinh", amount: 1250000 },
  { id: "F-002", label: "Tiền điện", amount: 850000 },
  { id: "F-003", label: "Tiền nước", amount: 420000 },
  { id: "F-004", label: "Phí internet", amount: 250000 },
  { id: "P-001", label: "Phí gửi xe", isParking: true, parkingBreakdown: [
    { label: "Ô tô", unitPrice: 1000000, vehicleType: "cars" },
    { label: "Xe máy", unitPrice: 200000, vehicleType: "motorbikes" },
    { label: "Xe đạp", unitPrice: 100000, vehicleType: "bicycles" },
  ] },
];

export default function ResidentList() {
  const [search, setSearch] = useState("");
  const [residents, setResidents] = useState([]);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [apartmentData, setApartmentData] = useState(null);
  const [extras, setExtras] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const loadResidents = async () => {
    try {
      const data = await getResidents();
      setResidents(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách cư dân:", err);
      setResidents([]);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const openFeeModal = async (resident) => {
    setSelectedResident(resident);
    setExtras({});
    setApartmentData(null);
    if (resident.apartment_id) {
      const apt = await getApartmentById(resident.apartment_id);
      setApartmentData(apt);
    }
    setIsNotifyModalOpen(true);
  };

  const calcFeeAmount = (fee) => {
    if (fee.isParking && apartmentData) {
      return (fee.parkingBreakdown || []).reduce((sum, item) => sum + (item.unitPrice || 0) * (apartmentData[item.vehicleType] || 0), 0);
    }
    return fee.amount || 0;
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleSendFeeNotification = async () => {
    if (!selectedResident) return;
    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const dueDate = new Date(year, month, 0);
      const dueDateStr = dueDate.toISOString().split("T")[0];
      const monthLabel = `tháng ${month}/${year}`;

      for (const fee of serviceFees) {
        const baseAmt = calcFeeAmount(fee);
        const extra = Number(extras[fee.id] || 0);
        const totalAmt = baseAmt + extra;
        if (totalAmt <= 0) continue;

        await createFee({
          name: `${fee.label} ${monthLabel}` + (fee.isParking && baseAmt > 0 ? " (các loại xe)" : ""),
          type: "mandatory",
          amount: totalAmt,
          apartment_id: selectedResident.apartment_id || null,
          due_date: dueDateStr,
          description: `Phí cho căn hộ ${selectedResident.apartment_code || selectedResident.apartment_building || "N/A"}`,
        });
      }

      window.alert(
        `Đã tạo hóa đơn cho ${selectedResident.full_name || selectedResident.username || "cư dân"} (${selectedResident.apartment_code || selectedResident.apartment_building || "N/A"}).`
      );
    } catch (err) {
      window.alert("Tạo hóa đơn thất bại: " + (err?.response?.data?.message || err.message));
    }
    setIsNotifyModalOpen(false);
  };

  const filteredResidents = useMemo(
    () =>
      residents.filter((item) => {
          const keyword = search.toLowerCase();
          return (
            (item.full_name || item.username || "").toLowerCase().includes(keyword) ||
            (item.apartment_code || item.apartment_building || "").toLowerCase().includes(keyword) ||
            (item.email || "").toLowerCase().includes(keyword)
          );
        }),
    [residents, search]
  );

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý cư dân</h2>
        <p>Danh sách cư dân, tình trạng thuê và thao tác quản lý nhanh.</p>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="resident-search">Tìm cư dân</label>
          <input
            id="resident-search"
            type="text"
            placeholder="Tên, tài khoản, căn hộ hoặc điện thoại..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="page-actions-right">
          <Link to="/admin/residents/add" className="primary-btn">
            Thêm cư dân
          </Link>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Tài khoản</th>
              <th>Căn hộ</th>
              <th>Số điện thoại</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident.id}>
                <td>{resident.resident_code || resident.id}</td>
                <td>{resident.full_name || "N/A"}</td>
                <td>{resident.linked_username || "—"}</td>
                <td>{resident.apartment_code || resident.apartment_building || "N/A"}</td>
                <td>{resident.phone || "N/A"}</td>
                <td>{resident.created_at ? new Date(resident.created_at).toLocaleDateString('vi-VN') : "N/A"}</td>
                <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/admin/residents/detail/${resident.id}`} className="secondary-btn">
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => openFeeModal(resident)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem' }}
                  >
                    Tạo hóa đơn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isNotifyModalOpen}
        title={`Tạo hóa đơn cho ${selectedResident?.full_name || "cư dân"} - ${selectedResident?.apartment_code || ""}`}
        onClose={() => setIsNotifyModalOpen(false)}
        onConfirm={handleSendFeeNotification}
        confirmText="Tạo hóa đơn"
      >
        <div className="search-field" style={{ marginBottom: "12px" }}>
          <label>Tháng áp dụng</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {serviceFees.map((fee) => {
            const baseAmt = calcFeeAmount(fee);
            const extra = Number(extras[fee.id] || 0);
            return (
              <div key={fee.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
                <div style={{ fontWeight: 600, marginBottom: "8px", fontSize: "0.95rem" }}>{fee.label}</div>

                {fee.isParking && apartmentData ? (
                  <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "8px" }}>
                    {(fee.parkingBreakdown || []).map((item) => {
                      const count = apartmentData[item.vehicleType] || 0;
                      return (
                        <div key={item.vehicleType} style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                          <span>{item.label}: {count} xe</span>
                          <span>{formatMoney((item.unitPrice || 0) * count)}</span>
                        </div>
                      );
                    })}
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, borderTop: "1px solid #d1d5db", paddingTop: "4px", marginTop: "4px" }}>
                      <span>Tổng phí xe</span>
                      <span>{formatMoney(baseAmt)}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "8px" }}>
                    Số tiền: <strong>{formatMoney(baseAmt)}</strong>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", whiteSpace: "nowrap", minWidth: "90px" }}>Phí phát sinh:</label>
                  <input
                    type="number"
                    min="0"
                    value={extras[fee.id] || ""}
                    onChange={(e) => setExtras((prev) => ({ ...prev, [fee.id]: e.target.value }))}
                    placeholder="0"
                    style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.85rem" }}
                  />
                </div>

                <div style={{ textAlign: "right", fontWeight: 700, marginTop: "6px", fontSize: "0.9rem", color: "#2563eb" }}>
                  Thành tiền: {formatMoney(baseAmt + extra)}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </section>
  );
}
