import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import { deleteResident, getResidentById, getMyResident } from "../../services/residentService";
import { getFees, getPaymentHistory } from "../../services/feeService";
import { changePassword } from "../../services/authService";

const statusColors = {
  empty: "#64748b",
  occupied: "#16a34a",
  maintenance: "#ea580c",
  sold: "#dc2626",
};

const formatStatus = (status) => {
  if (status === "empty") return "Trống";
  if (status === "occupied") return "Đang thuê";
  if (status === "maintenance") return "Bảo trì";
  if (status === "sold") return "Đã bán";
  return status || "N/A";
};

export default function ResidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resident, setResident] = useState(undefined);
  const [loadError, setLoadError] = useState("");
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const loadResident = async () => {
      setResident(undefined);
      setLoadError("");

      try {
        if (!id) {
          const data = await getMyResident();
          setResident(data);
        } else {
          const data = await getResidentById(id);
          setResident(data);
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Không thể tải thông tin.";
        setLoadError(msg);
        setResident(null);
      }
    };

    loadResident();
  }, [id]);

  useEffect(() => {
    if (resident?.apartment_id) {
      const loadFees = async () => {
        setLoadingFees(true);
        try {
          const [feeData, paymentData] = await Promise.all([
            getFees(),
            getPaymentHistory(),
          ]);
          setFees(feeData || []);
          setPayments(paymentData || []);
        } catch (err) {
          console.error("Lỗi tải danh sách phí:", err);
        } finally {
          setLoadingFees(false);
        }
      };
      loadFees();
    }
  }, [resident]);

  const getFeeStatus = (feeId) => {
    const payment = payments.find((p) => p.fee_id === feeId);
    return payment ? payment.status : null;
  };

  const handleDelete = async () => {
    if (!resident) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa cư dân này không?")) return;
    await deleteResident(resident.id);
    navigate("/admin/residents");
  };

  const formatMoney = (value) =>
    Number(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

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
      setPasswordError(err?.response?.data?.message || err?.message || "Lỗi khi đổi mật khẩu.");
    }
  };

  const profile = resident || user;
  const initials = (profile?.full_name || profile?.username || profile?.linked_username || "NG").slice(0, 2).toUpperCase();
  const displayName = profile?.full_name || profile?.username || profile?.linked_username || "Người dùng";
  const displayUnit = resident
    ? `${resident.apartment_code || ""}${resident.apartment_building ? ` - ${resident.apartment_building}` : ""}`.trim()
    : null;
  const displayIdCard = resident?.id_card || "—";
  const displayUsername = profile?.username || profile?.linked_username || "—";
  const displayEmail = profile?.email || "—";
  const displayPhone = profile?.phone || "—";
  const accountType = user?.role === "admin" ? "Quản trị viên" : "Cư dân";

  let displayStatus = "—";
  if (resident?.apartment_status) {
    displayStatus = formatStatus(resident.apartment_status);
  } else if (resident?.status) {
    displayStatus = resident.status;
  } else if (user?.role === "admin") {
    displayStatus = "Quản trị viên";
  } else {
    displayStatus = "Đang hoạt động";
  }

  const residentStatus = resident?.apartment_status || resident?.status || null;
  const statusColor = residentStatus ? statusColors[residentStatus] || "#64748b" : "#16a34a";

  const isLoading = resident === undefined;
  const hasNoData = !profile;

  return (
    <section className="profile-page">
      {isLoading ? (
        <div className="profile-loader">
          <div className="profile-loader-spinner" />
          <p>Đang tải thông tin...</p>
        </div>
      ) : hasNoData ? (
        <div className="profile-empty">
          <div className="profile-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h3>Không có dữ liệu hồ sơ</h3>
          {loadError && <p className="profile-empty-error">{loadError}</p>}
          <p>Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.</p>
        </div>
      ) : (
        <>
          <div className="profile-cover">
            <div className="profile-cover-bg" />
            <div className="profile-cover-content">
              <div className="profile-avatar-lg">{initials}</div>
              <div className="profile-cover-info">
                <h1>{displayName}</h1>
                {displayUnit && <p className="profile-cover-unit">{displayUnit}</p>}
                <span className="profile-status-badge" style={{ background: statusColor }}>{displayStatus}</span>
              </div>
              {!id && (
                <button type="button" className="profile-cover-action" onClick={() => setIsChangePasswordOpen(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Đổi mật khẩu
                </button>
              )}
            </div>
          </div>

          {loadError && (
            <div className="profile-error">{loadError}</div>
          )}

          <div className="profile-body">
            <div className="profile-section">
              <div className="profile-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Thông tin cá nhân</span>
              </div>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-info-label">Số căn cước</span>
                  <span className="profile-info-value">{displayIdCard}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Tên đăng nhập</span>
                  <span className="profile-info-value">{displayUsername}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{displayEmail}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Số điện thoại</span>
                  <span className="profile-info-value">{displayPhone}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Ngày tạo</span>
                  <span className="profile-info-value">{resident?.created_at ? new Date(resident.created_at).toLocaleDateString('vi-VN') : '—'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Loại tài khoản</span>
                  <span className="profile-info-value">{accountType}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Trạng thái</span>
                  <span className="profile-info-value">
                    <span className="profile-dot" style={{ background: statusColor }} />
                    {displayStatus}
                  </span>
                </div>
              </div>
            </div>

            {id && (
              <div className="profile-section profile-section-actions">
                <Link to={`/admin/residents/edit/${resident.id}`} className="profile-btn profile-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Chỉnh sửa
                </Link>
                <button type="button" className="profile-btn profile-btn-danger" onClick={handleDelete}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Xóa cư dân
                </button>
              </div>
            )}

            {id && resident?.apartment_id && (
              <div className="profile-section">
                <div className="profile-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>Hóa đơn căn hộ</span>
                </div>
                <div className="table-responsive" style={{ marginTop: "12px" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã hóa đơn</th>
                        <th>Nội dung</th>
                        <th>Hạn nộp</th>
                        <th>Số tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingFees ? (
                        <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Đang tải...</td></tr>
                      ) : fees.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Chưa có hóa đơn nào.</td></tr>
                      ) : (
                        fees.map((fee) => {
                          const status = getFeeStatus(fee.id);
                          let statusLabel = "Chưa thanh toán";
                          let statusClass = "status-pending";
                          if (status === "paid") { statusLabel = "Đã thanh toán"; statusClass = "status-paid"; }
                          else if (status === "pending") { statusLabel = "Chờ xác nhận"; statusClass = "status-pending"; }
                          return (
                            <tr key={fee.id}>
                              <td>{fee.fee_code || fee.id}</td>
                              <td>{fee.name}</td>
                              <td>{fee.due_date ? new Date(fee.due_date).toLocaleDateString("vi-VN") : "N/A"}</td>
                              <td>{Number(fee.amount || 0).toLocaleString("vi-VN")}đ</td>
                              <td><span className={`status-pill ${statusClass}`}>{statusLabel}</span></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <Modal isOpen={isChangePasswordOpen} title="Đổi mật khẩu" onClose={() => setIsChangePasswordOpen(false)} onConfirm={handleChangePassword} confirmText="Lưu mật khẩu" cancelText="Hủy">
            <div className="form-group"><label>Mật khẩu cũ</label><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
            <div className="form-group"><label>Mật khẩu mới</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <div className="form-group"><label>Xác nhận mật khẩu mới</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
            {passwordError && <p className="error-message" style={{ color: "#dc2626", fontSize: "0.85rem" }}>{passwordError}</p>}
          </Modal>
        </>
      )}
    </section>
  );
}
