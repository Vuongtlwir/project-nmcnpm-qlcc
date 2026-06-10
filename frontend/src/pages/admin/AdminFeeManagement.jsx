import { useEffect, useState } from "react";
import { getFees, createFee } from "../../services/feeService";
import { getApartments } from "../../services/apartmentService";
import { getResidents } from "../../services/residentService";
import api from "../../services/api";

const initialBillForm = {
  apartment_id: "",
  amount: "",
  due_date: "",
  description: "",
};

export default function AdminFeeManagement() {
  const [billForm, setBillForm] = useState(initialBillForm);
  const [bills, setBills] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    loadBills();
    loadApartmentsWithResidents();
  }, []);

  const loadBills = async () => {
    try {
      const data = await getFees();
      setBills(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách hóa đơn:", err);
    }
  };

  const loadApartmentsWithResidents = async () => {
    try {
      const [apartmentsData, residentsData] = await Promise.all([
        getApartments(),
        getResidents()
      ]);

      // Map residents vào apartments
      const enrichedApartments = apartmentsData
        .filter(apt => apt.status !== "empty") // Chỉ lấy căn hộ không trống
        .map(apt => {
          const resident = residentsData.find(r => r.apartment_id === apt.id);
          return {
            ...apt,
            resident_name: resident?.full_name || "Chưa có cư dân",
            resident_id: resident?.id
          };
        });

      setApartments(enrichedApartments);
      setResidents(residentsData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách căn hộ:", err);
    }
  };

  const handleBillFormChange = (field, value) => {
    setBillForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateBillCode = () => {
    const nextNumber = bills.length + 1;
    return `HDV-${nextNumber.toString().padStart(3, "0")}`;
  };

  const handleCreateBill = async () => {
    if (!billForm.apartment_id || !billForm.amount || !billForm.due_date) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    const selectedApartment = apartments.find(apt => apt.id == billForm.apartment_id);
    
    try {
      const result = await createFee({
        name: `Hóa đơn dịch vụ tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        type: 'mandatory',
        amount: Number(billForm.amount),
        description: billForm.description,
        apartment_id: Number(billForm.apartment_id),
        due_date: billForm.due_date,
        status: 'active'
      });

      alert(`Tạo hóa đơn thành công. Mã: ${result.fee_code || result.id}`);
      setBillForm(initialBillForm);
      loadBills();
    } catch (err) {
      alert("Tạo hóa đơn thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRemindResident = async (bill) => {
    try {
      await api.post("/notifications", {
        title: "Nhắc nhở thanh toán hóa đơn",
        content: `Hóa đơn mã ${bill.fee_code || bill.id} với số tiền ${Number(bill.amount || 0).toLocaleString("vi-VN")}đ đến hạn thanh toán vào ${new Date(bill.due_date).toLocaleDateString("vi-VN")}. Vui lòng thanh toán đúng hạn.`,
        type: "Nhắc nhở thanh toán",
        sort_order: 1
      });
      alert(`Đã gửi nhắc nhở cho cư dân về hóa đơn mã ${bill.fee_code || bill.id}.`);
    } catch (err) {
      alert("Gửi nhắc nhở thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const getPaymentStatus = (bill) => {
    return bill.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán";
  };

  const getPaymentStatusColor = (bill) => {
    return bill.status === "paid" ? "#10b981" : "#ef4444";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý hóa đơn</h2>
        <p>Tạo hóa đơn mới và theo dõi trạng thái thanh toán từ cư dân.</p>
      </div>

      {/* Form tạo hóa đơn mới */}
      <div className="page-card" style={{ marginTop: "24px" }}>
        <div className="page-card-header">
          <h3>Tạo hóa đơn mới</h3>
        </div>

        <div className="page-actions">
          <div className="search-field" style={{ flex: 1 }}>
            <label>Căn hộ / Cư dân</label>
            <select
              value={billForm.apartment_id}
              onChange={(event) => handleBillFormChange("apartment_id", event.target.value)}
            >
              <option value="">-- Chọn căn hộ --</option>
              {apartments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.code || apt.apartment_code || `Căn ${apt.id}`} - {apt.resident_name}
                </option>
              ))}
            </select>
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Số tiền</label>
            <input
              type="number"
              min="0"
              value={billForm.amount}
              onChange={(event) => handleBillFormChange("amount", event.target.value)}
              placeholder="Nhập số tiền"
            />
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Hạn thanh toán</label>
            <input
              type="date"
              value={billForm.due_date}
              onChange={(event) => handleBillFormChange("due_date", event.target.value)}
            />
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Mô tả</label>
            <input
              value={billForm.description}
              onChange={(event) => handleBillFormChange("description", event.target.value)}
              placeholder="Mô tả hóa đơn (không bắt buộc)"
            />
          </div>
          <div className="action-group">
            <button className="primary-btn" onClick={handleCreateBill}>
              Tạo hóa đơn
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách hóa đơn */}
      <div className="page-card" style={{ marginTop: "24px" }}>
        <div className="page-card-header">
          <h3>Danh sách hóa đơn</h3>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Cư dân</th>
                <th>Căn hộ</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Hạn thanh toán</th>
                <th>Thời gian thanh toán</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    Chưa có hóa đơn nào.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>
                      <strong>{bill.id}</strong>
                    </td>
                    <td>{bill.resident_name || bill.full_name || "N/A"}</td>
                    <td>{bill.apartment_code || "N/A"}</td>
                    <td>{Number(bill.amount || 0).toLocaleString("vi-VN")}đ</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          backgroundColor: getPaymentStatusColor(bill),
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {getPaymentStatus(bill)}
                      </span>
                    </td>
                    <td>{formatDate(bill.due_date)}</td>
                    <td>{bill.status === "paid" ? formatDate(bill.payment_date) : "-"}</td>
                    <td>
                      {bill.status !== "paid" && (
                        <button
                          className="secondary-btn"
                          onClick={() => handleRemindResident(bill)}
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          Nhắc nhở
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
