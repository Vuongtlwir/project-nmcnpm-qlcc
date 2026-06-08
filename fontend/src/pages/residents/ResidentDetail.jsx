import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { deleteResident, getResidentById } from "../../services/residentService";

const serviceFees = [
  { id: "F-001", label: "Phí vệ sinh tháng 6", amount: 1250000 },
  { id: "F-002", label: "Tiền điện tháng 5", amount: 850000 },
  { id: "F-003", label: "Tiền nước tháng 5", amount: 420000 },
];

export default function ResidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState(undefined);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(serviceFees[0].id);
  const [additionalFee, setAdditionalFee] = useState(0);

  useEffect(() => {
    const loadResident = async () => {
      if (!id) {
        setResident(null);
        return;
      }

      setResident(undefined);
      const data = await getResidentById(id);
      setResident(data);
    };

    loadResident();
  }, [id]);

  const handleDelete = async () => {
    if (!resident) return;
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa cư dân này không?");
    if (!confirmed) return;

    await deleteResident(resident.id);
    navigate("/admin/residents");
  };

  const openFeeNotification = () => {
    setSelectedFeeId(serviceFees[0].id);
    setAdditionalFee(0);
    setIsNotifyModalOpen(true);
  };

  const formatMoney = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const selectedFee = serviceFees.find((item) => item.id === selectedFeeId) || serviceFees[0];
  const baseAmount = selectedFee.amount;
  const totalAmount = baseAmount + Number(additionalFee || 0);

  const handleSendFeeNotification = () => {
    if (!resident) return;

    window.alert(
      `Đã gửi thông báo phí căn hộ cho ${resident.name} (${resident.unit}).\n` +
      `Loại phí: ${selectedFee.label}\n` +
      `Số tiền: ${formatMoney(baseAmount)}\n` +
      `Phí phát sinh: ${formatMoney(Number(additionalFee || 0))}\n` +
      `Tổng: ${formatMoney(totalAmount)}`
    );
    setIsNotifyModalOpen(false);
  };

  if (!id) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Hồ sơ của bạn</h2>
          <p>Quản lý thông tin cá nhân và tài khoản của bạn.</p>
        </div>
        <div className="profile-summary">
          <div className="profile-card">
            <h3>Không có cư dân được chọn</h3>
            <p>Vui lòng truy cập mục hồ sơ để xem thông tin cá nhân.</p>
          </div>
        </div>
      </section>
    );
  }

  if (resident === null) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Hồ sơ cư dân</h2>
          <p>Đang tải thông tin cư dân...</p>
        </div>
      </section>
    );
  }

  if (!resident) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Hồ sơ cư dân</h2>
          <p>Cư dân không tồn tại hoặc đã bị xóa.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Hồ sơ cư dân</h2>
        <p>Thông tin chi tiết cư dân và các thao tác quản lý.</p>
      </div>

      <div className="profile-summary">
        <div className="profile-card">
          <div className="profile-avatar">{resident.name.slice(0, 2).toUpperCase()}</div>
          <div className="profile-details">
            <div>
              <h3>{resident.name}</h3>
              <p style={{ color: "#6b7280", marginTop: "8px" }}>{resident.unit}</p>
            </div>
            <div className="profile-row">
              <span>Số căn cước</span>
              <span className="detail-value">{resident.nationalId || resident.username || "N/A"}</span>
            </div>
            <div className="profile-row">
              <span>Username</span>
              <span className="detail-value">{resident.username || resident.nationalId || "N/A"}</span>
            </div>
            <div className="profile-row">
              <span>Mật khẩu</span>
              <span className="detail-value">{resident.password || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="detail-row">
            <span>Email</span>
            <span className="detail-value">{resident.email}</span>
          </div>
          <div className="detail-row">
            <span>Số điện thoại</span>
            <span className="detail-value">{resident.phone}</span>
          </div>
          <div className="detail-row">
            <span>Trạng thái</span>
            <span className="detail-value">{resident.status}</span>
          </div>
          <div className="detail-row">
            <span>Loại cư dân</span>
            <span className="detail-value">Cư dân chính thức</span>
          </div>

          <div className="page-actions" style={{ marginTop: "18px", justifyContent: "flex-start" }}>
            <Link to={`/admin/residents/edit/${resident.id}`} className="primary-btn">
              Chỉnh sửa
            </Link>
            <button
              type="button"
              className="secondary-btn"
              onClick={openFeeNotification}
            >
              Thông báo phí căn hộ
            </button>
            <button
              type="button"
              className="secondary-btn"
              style={{ backgroundColor: "#e74c3c", borderColor: "#e74c3c", color: "#fff" }}
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isNotifyModalOpen}
        title={`Thông báo phí cho ${resident.name}`}
        onClose={() => setIsNotifyModalOpen(false)}
        onConfirm={handleSendFeeNotification}
        confirmText="Gửi thông báo"
        cancelText="Hủy"
      >
        <div className="search-field">
          <label>Loại phí</label>
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
          <label>Số tiền</label>
          <input type="text" value={formatMoney(baseAmount)} disabled />
        </div>
        <div className="search-field">
          <label>Phí phát sinh</label>
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
