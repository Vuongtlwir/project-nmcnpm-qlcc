import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { getResidents, deleteResident } from "../../services/residentService";

const serviceFees = [
  { id: "F-001", label: "Phí vệ sinh tháng 6", amount: 1250000 },
  { id: "F-002", label: "Tiền điện tháng 5", amount: 850000 },
  { id: "F-003", label: "Tiền nước tháng 5", amount: 420000 },
  { id: "F-004", label: "Phí internet", amount: 250000 },
];

const getStatusClass = (status) => {
  if (status === "active") return "status-paid";
  return "status-pending";
};

const getStatusText = (status) => {
  if (status === "active") return "Đang thuê";
  if (status === "moved_out") return "Đã chuyển đi";
  return status || "N/A";
};

export default function ResidentList() {
  const [search, setSearch] = useState("");
  const [residents, setResidents] = useState([]);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedFeeId, setSelectedFeeId] = useState(serviceFees[0].id);
  const [additionalFee, setAdditionalFee] = useState(0);

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa cư dân này không?");
    if (!confirmed) return;

    await deleteResident(id);
    loadResidents();
  };

  const openFeeNotification = (resident) => {
    setSelectedResident(resident);
    setSelectedFeeId(serviceFees[0].id);
    setAdditionalFee(0);
    setIsNotifyModalOpen(true);
  };

  const selectedFee = serviceFees.find((item) => item.id === selectedFeeId) || serviceFees[0];
  const baseAmount = selectedFee?.amount || 0;
  const totalAmount = baseAmount + Number(additionalFee || 0);

  const formatMoney = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleSendFeeNotification = () => {
    if (!selectedResident) return;
    window.alert(
      `Đã gửi thông báo phí riêng cho ${selectedResident.full_name || selectedResident.username || "cư dân"} (${selectedResident.apartment_code || selectedResident.apartment_building || "N/A"}).\n` +
      `Phí dịch vụ: ${selectedFee.label}\n` +
      `Số tiền phải trả: ${formatMoney(baseAmount)}\n` +
      `Phí phát sinh: ${formatMoney(Number(additionalFee || 0))}\n` +
      `Tổng: ${formatMoney(totalAmount)}`
    );
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

        <div className="action-group">
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
                    className="secondary-btn"
                    onClick={() => handleDelete(resident.id)}
                    style={{ backgroundColor: '#ef4444', borderColor: '#dc2626', color: '#fff' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isNotifyModalOpen}
        title={`Thông báo phí cho ${selectedResident?.full_name || "cư dân"}`}
        onClose={() => setIsNotifyModalOpen(false)}
        onConfirm={handleSendFeeNotification}
        confirmText="Gửi thông báo"
      >
        <div className="search-field">
          <label>Chi phí dịch vụ</label>
          <select
            value={selectedFeeId}
            onChange={(event) => setSelectedFeeId(event.target.value)}
          >
            {serviceFees.map((fee) => (
              <option key={fee.id} value={fee.id}>
                {fee.label}
              </option>
            ))}
          </select>
        </div>
        <div className="search-field">
          <label>Số tiền phải trả</label>
          <input type="text" value={formatMoney(baseAmount)} disabled />
        </div>
        <div className="search-field">
          <label>Chi phí phát sinh</label>
          <input
            type="number"
            min="0"
            value={additionalFee}
            onChange={(event) => setAdditionalFee(event.target.value)}
            placeholder="Nhập phí phát sinh"
          />
        </div>
        <div className="search-field">
          <label>Tổng</label>
          <input type="text" value={formatMoney(totalAmount)} disabled />
        </div>
      </Modal>
    </section>
  );
}
