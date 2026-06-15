import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import { getAdminBookings, updateBooking, getServices, createService, updateService } from '../../services/serviceService';

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const statusStyles = {
  pending: { backgroundColor: '#fbbf24', color: '#1f2937' },
  confirmed: { backgroundColor: '#38bdf8', color: '#0f172a' },
  completed: { backgroundColor: '#10b981', color: '#f8fafc' },
  cancelled: { backgroundColor: '#ef4444', color: '#f8fafc' },
};

export default function AdminServiceManagement() {
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [adminResponse, setAdminResponse] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', unit: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bks, svc] = await Promise.all([getAdminBookings(), getServices()]);
      setBookings(bks);
      setServices(svc);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedStatus(booking.status || 'pending');
    setAdminResponse(booking.admin_response || '');
    setDetailError(null);
  };

  const closeBookingModal = () => {
    setSelectedBooking(null);
    setDetailError(null);
  };

  const openServiceModal = (service = null) => {
    setEditingService(service);
    setServiceForm({
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price?.toString() || '',
      unit: service?.unit || '',
    });
    setShowServiceModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    setDetailError(null);
    try {
      await updateBooking(selectedBooking.id, { status: selectedStatus, admin_response: adminResponse });
      setBookings((prev) => prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: selectedStatus, admin_response: adminResponse } : b
      ));
      closeBookingModal();
    } catch (err) {
      setDetailError('Cập nhật thất bại.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveService = async () => {
    try {
      if (editingService) {
        await updateService(editingService.id, serviceForm);
      } else {
        await createService(serviceForm);
      }
      setShowServiceModal(false);
      loadData();
    } catch (err) {
      setDetailError(err.response?.data?.message || 'Lưu thất bại.');
    }
  };

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return bookings;
    return bookings.filter((b) =>
      [b.booking_code, b.service_name, b.user_fullname, b.apartment_code, b.status, b.notes]
        .filter(Boolean).some((v) => v.toString().toLowerCase().includes(keyword))
    );
  }, [search, bookings]);

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('vi-VN');
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý dịch vụ</h2>
        <p>Quản lý danh sách dịch vụ và đăng ký của cư dân.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setTab('bookings')}
          style={{
            padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
            background: tab === 'bookings' ? '#2563eb' : '#f1f5f9',
            color: tab === 'bookings' ? '#fff' : '#0f172a',
          }}
        >
          Đơn đăng ký
        </button>
        <button
          type="button"
          onClick={() => setTab('services')}
          style={{
            padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
            background: tab === 'services' ? '#2563eb' : '#f1f5f9',
            color: tab === 'services' ? '#fff' : '#0f172a',
          }}
        >
          Danh mục dịch vụ
        </button>
      </div>

      {tab === 'bookings' ? (
        <>
          <div className="page-actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div className="search-field" style={{ marginBottom: '20px' }}>
              <label htmlFor="booking-search">Tìm đơn đăng ký</label>
              <input
                id="booking-search"
                type="text"
                placeholder="Mã đơn, dịch vụ, cư dân, căn hộ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Dịch vụ</th>
                  <th>Cư dân</th>
                  <th>Căn hộ</th>
                  <th>Ngày ĐK</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>Đang tải...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>Không có đơn đăng ký.</td></tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id}>
                      <td>{b.booking_code}</td>
                      <td>{b.service_name}</td>
                      <td>{b.user_fullname || b.user_name}</td>
                      <td>{b.apartment_code || 'N/A'}</td>
                      <td>{formatDate(b.booking_date)}</td>
                      <td>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', ...statusStyles[b.status] || statusStyles.pending }}>
                          {STATUS_LABELS[b.status] || b.status}
                        </span>
                      </td>
                      <td>{formatDateTime(b.created_at)}</td>
                      <td>
                        <button className="secondary-btn" style={{ fontSize: '12px', padding: '6px 10px' }} onClick={() => openBookingModal(b)}>
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={Boolean(selectedBooking)}
            title={selectedBooking ? `Đơn: ${selectedBooking.booking_code}` : ''}
            onClose={closeBookingModal}
            onConfirm={handleUpdateBooking}
            confirmText="Cập nhật"
            cancelText="Đóng"
            loading={updatingStatus}
          >
            {selectedBooking && (
              <div>
                <div style={{ marginBottom: '14px' }}><strong>Dịch vụ:</strong> {selectedBooking.service_name}</div>
                <div style={{ marginBottom: '14px' }}><strong>Cư dân:</strong> {selectedBooking.user_fullname || selectedBooking.user_name}</div>
                <div style={{ marginBottom: '14px' }}><strong>Căn hộ:</strong> {selectedBooking.apartment_code || 'N/A'}</div>
                <div style={{ marginBottom: '14px' }}><strong>Ngày đăng ký:</strong> {formatDate(selectedBooking.booking_date)}</div>
                {selectedBooking.booking_time && <div style={{ marginBottom: '14px' }}><strong>Giờ:</strong> {selectedBooking.booking_time}</div>}
                {selectedBooking.notes && <div style={{ marginBottom: '14px' }}><strong>Ghi chú:</strong> {selectedBooking.notes}</div>}

                <div style={{ marginBottom: '14px' }}>
                  <strong>Trạng thái:</strong>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db' }}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <strong>Phản hồi:</strong>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                    style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', resize: 'vertical', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
                    placeholder="Nhập phản hồi cho cư dân..."
                  />
                </div>

                {detailError && <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#991b1b' }}>{detailError}</div>}
              </div>
            )}
          </Modal>
        </>
      ) : (
        <>
          <div className="page-actions" style={{ justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button className="primary-btn" onClick={() => openServiceModal()}>+ Thêm dịch vụ</button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên dịch vụ</th>
                  <th>Mô tả</th>
                  <th>Giá</th>
                  <th>Đơn vị</th>
                  <th>Kích hoạt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Chưa có dịch vụ.</td></tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td style={{ maxWidth: '250px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{s.description || ''}</td>
                      <td>{s.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(s.price)}</td>
                      <td>{s.unit || ''}</td>
                      <td>
                        <span style={{ color: s.is_active ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                          {s.is_active ? 'Có' : 'Không'}
                        </span>
                      </td>
                      <td>
                        <button className="secondary-btn" style={{ fontSize: '12px', padding: '6px 10px' }} onClick={() => openServiceModal(s)}>
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {showServiceModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '20px' }}
              onClick={() => setShowServiceModal(false)}>
              <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 60px rgba(15,23,42,0.2)' }}
                onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
                  </h2>
                  <button type="button" onClick={() => setShowServiceModal(false)}
                    style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.5rem', color: '#94a3b8', borderRadius: 8 }}>
                    ×
                  </button>
                </div>
                <div style={{ padding: '20px 28px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: '#0f172a', marginBottom: 5 }}>Tên dịch vụ</label>
                    <input type="text" value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px 13px', outline: 'none', fontSize: '0.88rem', background: '#f8fafc', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: '#0f172a', marginBottom: 5 }}>Mô tả</label>
                    <textarea value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      rows={3}
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px 13px', outline: 'none', fontSize: '0.88rem', background: '#f8fafc', resize: 'vertical', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: '#0f172a', marginBottom: 5 }}>Giá (VNĐ)</label>
                      <input type="number" value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px 13px', outline: 'none', fontSize: '0.88rem', background: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: '#0f172a', marginBottom: 5 }}>Đơn vị</label>
                      <input type="text" value={serviceForm.unit} placeholder="lượt, giờ, ngày..."
                        onChange={(e) => setServiceForm({ ...serviceForm, unit: e.target.value })}
                        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px 13px', outline: 'none', fontSize: '0.88rem', background: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  {detailError && <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#991b1b' }}>{detailError}</div>}
                </div>
                <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowServiceModal(false)}
                    style={{ padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-sans)', background: '#f1f5f9', color: '#0f172a' }}>
                    Hủy
                  </button>
                  <button type="button" onClick={handleSaveService}
                    style={{ padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-sans)', background: '#2563eb', color: '#fff' }}>
                    {editingService ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}