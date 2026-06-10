import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import { deleteResident, getResidentById, getMyResident } from "../../services/residentService";
import { changePassword } from "../../services/authService";
import { updateApartment } from "../../services/apartmentService";

const apartmentStatusOptions = [
  { value: "empty", label: "Trống" },
  { value: "occupied", label: "Đang thuê" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "sold", label: "Đã bán" }
];

const formatStatus = (status) => {
  if (status === "empty") return "Trống";
  if (status === "occupied") return "Đang thuê";
  if (status === "maintenance") return "Bảo trì";
  if (status === "sold") return "Đã bán";
  return status || "N/A";
};

const serviceFees = [
  { id: "F-001", label: "Phí vệ sinh tháng 6", amount: 1250000 },
  { id: "F-002", label: "Tiền điện tháng 5", amount: 850000 },
  { id: "F-003", label: "Tiền nước tháng 5", amount: 420000 }
];

export default function ResidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState(undefined);
  const [apartmentStatus, setApartmentStatus] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(serviceFees[0].id);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { user } = useAuth();

    useEffect(() => {
      const loadResident = async () => {
        setResident(undefined);
      
        if (!id) {
          // Load current user's profile
          const data = await getMyResident();
          setResident(data);
          return;
        }

        // Load specific resident by id (admin mode)
        const data = await getResidentById(id);
        setResident(data);
      };

      loadResident();
    }, [id]);

    useEffect(() => {
      if (resident?.apartment_status) {
        setApartmentStatus(resident.apartment_status);
      }
    }, [resident]);

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
      const targetResident = resident;
      if (!targetResident) return;

      window.alert(
        `Đã gửi thông báo phí căn hộ cho ${targetResident.full_name || targetResident.username} (${targetResident.apartment_code || targetResident.apartment_building || 'N/A'}).\n` +
        `Loại phí: ${selectedFee.label}\n` +
        `Số tiền: ${formatMoney(baseAmount)}\n` +
        `Phí phát sinh: ${formatMoney(Number(additionalFee || 0))}\n` +
        `Tổng: ${formatMoney(totalAmount)}`
      );
      setIsNotifyModalOpen(false);
    };

    const handleOpenChangePassword = () => {
      setPasswordError("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordOpen(true);
    };

    const handleChangePassword = async () => {
      if (!oldPassword || !newPassword) {
        setPasswordError("Vui lòng nhập mật khẩu cũ và mật khẩu mới.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
      }

      try {
        await changePassword({ oldPassword, newPassword });
        window.alert("Đổi mật khẩu thành công.");
        setIsChangePasswordOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
      } catch (err) {
        const apiMessage = err?.response?.data?.message || err?.message || "Lỗi khi đổi mật khẩu.";
        setPasswordError(apiMessage);
      }
    };

    const profileTitle = !id ? "Hồ sơ của bạn" : "Hồ sơ cư dân";
    const profile = resident || user;
    const profileAvatar = (profile?.full_name || profile?.username || "NG").slice(0, 2).toUpperCase();
    const profileName = profile?.full_name || profile?.username || "Người dùng";
    const profileUnit = resident
      ? `${resident.apartment_code || ''}${resident.apartment_building ? ` - ${resident.apartment_building}` : ''}`.trim()
      : null;
    const profileIdNumber = resident?.id_card || profile?.username || "N/A";
    const profileUsername = profile?.username || "N/A";
    const profileEmail = profile?.email || "N/A";
    const profilePhone = profile?.phone || "N/A";
    const profileStatus = resident?.apartment_status
      ? formatStatus(resident.apartment_status)
      : resident?.status || (user ? (user.role === 'admin' ? 'Quản trị viên' : 'Đang hoạt động') : 'N/A');

    if (resident === undefined) {
      return (
        <section className="page-card">
          <div className="page-card-header">
            <h2>{profileTitle}</h2>
            <p>Đang tải thông tin...</p>
          </div>
        </section>
      );
    }

    if (!profile) {
      return (
        <section className="page-card">
          <div className="page-card-header">
            <h2>{profileTitle}</h2>
            <p>Quản lý thông tin cá nhân và tài khoản của bạn.</p>
          </div>
          <div className="profile-summary">
            <div className="profile-card">
              <h3>Không có dữ liệu hồ sơ</h3>
              <p>Vui lòng đăng nhập lại hoặc liên hệ quản trị viên để cập nhật thông tin.</p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>{profileTitle}</h2>
          <p>Thông tin chi tiết cư dân và tài khoản của bạn.</p>
        </div>

        <div className="profile-summary">
          <div className="profile-card">
            <div className="profile-avatar">{profileAvatar}</div>
            <div className="profile-details">
              <div>
                <h3>{profileName}</h3>
                {profileUnit && (
                  <p style={{ color: "#6b7280", marginTop: "8px" }}>{profileUnit}</p>
                )}
              </div>
              <div className="profile-row">
                <span>Số căn cước</span>
                <span className="detail-value">{profileIdNumber}</span>
              </div>
              <div className="profile-row">
                <span>Username</span>
                <span className="detail-value">{profileUsername}</span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="detail-row">
              <span>Email</span>
              <span className="detail-value">{profileEmail}</span>
            </div>
            <div className="detail-row">
              <span>Số điện thoại</span>
              <span className="detail-value">{profilePhone}</span>
            </div>
            <div className="detail-row">
              <span>Trạng thái</span>
              <span className="detail-value">{profileStatus}</span>
            </div>
            {id && resident?.apartment_id && (
              <div className="search-field status-select-card">
                <label htmlFor="apartment-status">Cập nhật trạng thái căn hộ</label>
                <select
                  id="apartment-status"
                  value={apartmentStatus}
                  onChange={(event) => setApartmentStatus(event.target.value)}
                >
                  {apartmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="detail-row">
              <span>Loại tài khoản</span>
              <span className="detail-value">{profile?.role === 'admin' ? 'Quản trị viên' : 'Cư dân'}</span>
            </div>

            {!id && (
              <div className="page-actions" style={{ marginTop: "18px", justifyContent: "flex-start" }}>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleOpenChangePassword}
                >
                  Đổi mật khẩu
                </button>
              </div>
            )}

            {id && resident && (
              <>
                <div className="status-update-row">
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={statusSaving || !resident?.apartment_id}
                    onClick={async () => {
                      if (!resident?.apartment_id) return;
                      setStatusSaving(true);
                      setStatusMessage("");
                      try {
                        await updateApartment(resident.apartment_id, { status: apartmentStatus });
                        setStatusMessage("Cập nhật trạng thái căn hộ thành công.");
                        setResident((prev) => prev ? { ...prev, apartment_status: apartmentStatus } : prev);
                      } catch (err) {
                        const apiMessage = err?.response?.data?.message || err?.message || "Lỗi khi cập nhật trạng thái";
                        setStatusMessage(apiMessage);
                      } finally {
                        setStatusSaving(false);
                      }
                    }}
                  >
                    {statusSaving ? "Đang cập nhật..." : "Lưu trạng thái"}
                  </button>
                  {statusMessage && <p className="success-message">{statusMessage}</p>}
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
              </>
            )}
          </div>
        </div>

        <Modal
          isOpen={isNotifyModalOpen}
          title={`Thông báo phí cho ${profileName}`}
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

        <Modal
          isOpen={isChangePasswordOpen}
          title="Đổi mật khẩu"
          onClose={() => setIsChangePasswordOpen(false)}
          onConfirm={handleChangePassword}
          confirmText="Lưu mật khẩu"
          cancelText="Hủy"
        >
          <div className="search-field">
            <label>Mật khẩu cũ</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </div>
          <div className="search-field">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div className="search-field">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}
        </Modal>
      </section>
    );
  }
