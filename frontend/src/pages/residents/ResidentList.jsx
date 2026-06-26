import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getResidents } from "../../services/residentService";
import { createFee } from "../../services/feeService";
import Modal from "../../components/Modal";

export default function ResidentList() {
  const [search, setSearch] = useState("");
  const [residents, setResidents] = useState([]);
  const [showExtraFee, setShowExtraFee] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [extraLabel, setExtraLabel] = useState("");
  const [extraAmount, setExtraAmount] = useState("");

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

  const openExtraFee = (resident) => {
    setSelectedResident(resident);
    setExtraLabel("");
    setExtraAmount("");
    setShowExtraFee(true);
  };

  const handleCreateExtraFee = async () => {
    if (!selectedResident || !extraLabel.trim() || !extraAmount) return;
    try {
      await createFee({
        name: extraLabel.trim(),
        type: "mandatory",
        amount: Number(extraAmount),
        apartment_id: selectedResident.apartment_id || null,
        due_date: new Date().toISOString().split("T")[0],
        description: `Phí phát sinh cho căn hộ ${selectedResident.apartment_code || "N/A"}`,
      });
      window.alert("Tạo phí phát sinh thành công.");
      setShowExtraFee(false);
    } catch (err) {
      window.alert("Lỗi: " + (err?.response?.data?.message || err.message));
    }
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
              <th>Thu phí</th>
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
                <td>
                  <span className={`status-pill ${resident.fee_status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                    {resident.fee_status === 'paid' ? 'Đã nộp' : 'Chưa nộp'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/admin/residents/detail/${resident.id}`} className="secondary-btn">
                    Chi tiết
                  </Link>
                  <button type="button" className="primary-btn" style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem' }} onClick={() => openExtraFee(resident)}>
                    Phí phát sinh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showExtraFee}
        title={`Phí phát sinh - ${selectedResident?.full_name || selectedResident?.linked_username || ""} (${selectedResident?.apartment_code || "N/A"})`}
        onClose={() => setShowExtraFee(false)}
        onConfirm={handleCreateExtraFee}
        confirmText="Tạo phí"
      >
        <div className="search-field">
          <label>Tên phí</label>
          <input
            type="text"
            placeholder="VD: Phí sửa chữa, Phí dịch vụ đặc biệt..."
            value={extraLabel}
            onChange={(e) => setExtraLabel(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>
        <div className="search-field" style={{ marginTop: 12 }}>
          <label>Số tiền</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={extraAmount}
            onChange={(e) => setExtraAmount(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>
      </Modal>
    </section>
  );
}
