import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import { getComplaints, updateComplaint } from '../../services/complaintService';

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  resolved: 'Đã hoàn thành',
  rejected: 'Bị từ chối',
};

const statusStyles = {
  pending: { backgroundColor: '#fbbf24', color: '#1f2937' },
  processing: { backgroundColor: '#38bdf8', color: '#0f172a' },
  resolved: { backgroundColor: '#10b981', color: '#f8fafc' },
  rejected: { backgroundColor: '#ef4444', color: '#f8fafc' },
};

export default function AdminRequestManagement() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getComplaints();
        setRequests(data);
      } catch (err) {
        console.error('Lỗi khi tải yêu cầu:', err);
        setError('Không thể tải dữ liệu yêu cầu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setSelectedStatus(request.status || 'pending');
    setDetailError(null);
  };

  const closeRequestModal = () => {
    setSelectedRequest(null);
    setDetailError(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    setUpdatingStatus(true);
    setDetailError(null);

    try {
      await updateComplaint(selectedRequest.id, { status: selectedStatus });
      setRequests((prev) => prev.map((request) => (
        request.id === selectedRequest.id
          ? { ...request, status: selectedStatus }
          : request
      )));
      setSelectedRequest((prev) => prev && ({ ...prev, status: selectedStatus }));
      closeRequestModal();
    } catch (err) {
      console.error('Không thể cập nhật trạng thái:', err);
      setDetailError('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return requests;
    return requests.filter((request) => {
      return [
        request.id,
        request.title,
        request.apartment_code,
        request.type,
        request.content,
        request.status,
      ]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(keyword));
    });
  }, [search, requests]);

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý yêu cầu</h2>
        <p>Danh sách yêu cầu phản ánh của cư dân với thông tin ID, tiêu đề, căn hộ, loại, nội dung, trạng thái và thời gian gửi.</p>
      </div>

      <div className="page-actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="search-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="request-search">Tìm yêu cầu</label>
          <input
            id="request-search"
            type="text"
            placeholder="Tìm theo ID, tiêu đề, căn hộ, loại hoặc trạng thái..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '16px', padding: '14px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '14px' }}>
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Căn hộ</th>
              <th>Loại yêu cầu</th>
              <th>Nội dung</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                  Không tìm thấy yêu cầu nào.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.title}</td>
                  <td>{request.apartment_code || 'N/A'}</td>
                  <td>{request.type || 'Khác'}</td>
                  <td style={{ maxWidth: '320px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{request.content}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        ...statusStyles[request.status] || statusStyles.pending,
                      }}
                    >
                      {STATUS_LABELS[request.status] || request.status}
                    </span>
                  </td>
                  <td>{formatDateTime(request.created_at)}</td>
                  <td>
                    <button
                      className="secondary-btn"
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                      onClick={() => openRequestModal(request)}
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

      <Modal
        isOpen={Boolean(selectedRequest)}
        title={selectedRequest ? `Yêu cầu ${selectedRequest.id}` : ''}
        onClose={closeRequestModal}
        onConfirm={handleUpdateStatus}
        confirmText="Cập nhật trạng thái"
        cancelText="Đóng"
        loading={updatingStatus}
      >
        {selectedRequest ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Tiêu đề:</strong> {selectedRequest.title}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Căn hộ:</strong> {selectedRequest.apartment_code || 'N/A'}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Loại yêu cầu:</strong> {selectedRequest.type || 'Khác'}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Nội dung:</strong>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{selectedRequest.content}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Trạng thái hiện tại:</strong>
              <div style={{ marginTop: '8px' }}>
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db' }}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Ngày tạo:</strong> {formatDateTime(selectedRequest.created_at)}
            </div>
            {detailError && (
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                {detailError}
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
