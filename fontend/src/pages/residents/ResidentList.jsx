import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { loadResidents, deleteResident } from "../../services/residentService";

const serviceFees = [
  { id: "F-001", label: "Phí vệ sinh tháng 6", amount: 1250000 },
  { id: "F-002", label: "Tiền điện tháng 5", amount: 850000 },
  { id: "F-003", label: "Tiền nước tháng 5", amount: 420000 },
  { id: "F-004", label: "Phí internet", amount: 250000 },
];

const getStatusClass = (status) => {
  if (status === "Đang thuê") return "status-paid";
  return "status-pending";
};

export default function ResidentList() {
  const [search, setSearch] = useState("");
  const [residents, setResidents] = useState([]);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedFeeId, setSelectedFeeId] = useState(serviceFees[0].id);
  const [additionalFee, setAdditionalFee] = useState(0);

  useEffect(() => {
    setResidents(loadResidents());
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa cư dân này không?");
    if (!confirmed) return;

    await deleteResident(id);
    setResidents(loadResidents());
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
      `Đã gửi thông báo phí riêng cho ${selectedResident.name} (${selectedResident.unit}).\n` +
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
          item.name.toLowerCase().includes(keyword) ||
          item.unit.toLowerCase().includes(keyword) ||
          item.email.toLowerCase().includes(keyword)
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
            placeholder="Tên, căn hộ hoặc email..."
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
              <th>Mã</th>
              <th>Tên cư dân</th>
              <th>Căn hộ</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident.id}>
                <td>{resident.id}</td>
                <td>{resident.name}</td>
                <td>{resident.unit}</td>
                <td>{resident.email}</td>
                <td>
                  <span className={`status-pill ${getStatusClass(resident.status)}`}>
                    {resident.status}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/residents/detail/${resident.id}`} className="secondary-btn">
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isNotifyModalOpen}
        title={`Thông báo phí cho ${selectedResident?.name || "cư dân"}`}
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
