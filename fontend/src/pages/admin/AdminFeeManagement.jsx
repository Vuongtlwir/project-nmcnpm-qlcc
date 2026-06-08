import { useEffect, useMemo, useState } from "react";
import {
  loadParkingVehicles,
  loadUtilityCharges,
  saveParkingVehicles,
  saveUtilityCharges,
  PARKING_RATES,
} from "../../services/adminFeeService";

const initialVehicle = {
  household: "",
  plate: "",
  vehicleType: "Xe máy",
  month: "",
};

const initialUtility = {
  serviceType: "Điện",
  provider: "",
  month: "",
  amount: "",
};

export default function AdminFeeManagement() {
  const [vehicleForm, setVehicleForm] = useState(initialVehicle);
  const [utilityForm, setUtilityForm] = useState(initialUtility);
  const [vehicles, setVehicles] = useState([]);
  const [utilities, setUtilities] = useState([]);

  useEffect(() => {
    setVehicles(loadParkingVehicles());
    setUtilities(loadUtilityCharges());
  }, []);

  useEffect(() => {
    saveParkingVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    saveUtilityCharges(utilities);
  }, [utilities]);

  const handleVehicleChange = (field, value) => {
    setVehicleForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUtilityChange = (field, value) => {
    setUtilityForm((prev) => ({ ...prev, [field]: value }));
  };

  const addVehicle = () => {
    if (!vehicleForm.household || !vehicleForm.plate || !vehicleForm.month) {
      return;
    }

    const fee = PARKING_RATES[vehicleForm.vehicleType] || 0;
    const newVehicle = {
      id: `${vehicleForm.plate}-${vehicleForm.month}`,
      ...vehicleForm,
      fee,
    };

    setVehicles((prev) => [...prev, newVehicle]);
    setVehicleForm(initialVehicle);
  };

  const addUtility = () => {
    if (!utilityForm.provider || !utilityForm.month || !utilityForm.amount) {
      return;
    }

    const newUtility = {
      id: `${utilityForm.serviceType}-${utilityForm.month}-${utilityForm.provider}`,
      ...utilityForm,
      amount: Number(utilityForm.amount),
    };

    setUtilities((prev) => [...prev, newUtility]);
    setUtilityForm(initialUtility);
  };

  const removeVehicle = (id) => {
    setVehicles((prev) => prev.filter((item) => item.id !== id));
  };

  const removeUtility = (id) => {
    setUtilities((prev) => prev.filter((item) => item.id !== id));
  };

  const parkingTotal = useMemo(
    () => vehicles.reduce((sum, item) => sum + item.fee, 0),
    [vehicles]
  );

  const utilityTotal = useMemo(
    () => utilities.reduce((sum, item) => sum + item.amount, 0),
    [utilities]
  );

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý các khoản thu</h2>
        <p>
          Quản lý phí gửi xe hàng tháng và chi phí điện, nước, internet theo thông báo từ nhà cung cấp.
        </p>
      </div>

      <div className="page-actions">
        <div className="search-field" style={{ flex: 1 }}>
          <label>Loại phương tiện</label>
          <select
            value={vehicleForm.vehicleType}
            onChange={(event) => handleVehicleChange("vehicleType", event.target.value)}
          >
            <option>Xe máy</option>
            <option>Ô tô</option>
          </select>
        </div>
        <div className="search-field" style={{ flex: 1 }}>
          <label>Hộ gia đình</label>
          <input
            value={vehicleForm.household}
            onChange={(event) => handleVehicleChange("household", event.target.value)}
            placeholder="Tên hộ gia đình"
          />
        </div>
        <div className="search-field" style={{ flex: 1 }}>
          <label>Biển số</label>
          <input
            value={vehicleForm.plate}
            onChange={(event) => handleVehicleChange("plate", event.target.value)}
            placeholder="Biển số phương tiện"
          />
        </div>
        <div className="search-field" style={{ flex: 1 }}>
          <label>Tháng</label>
          <input
            type="month"
            value={vehicleForm.month}
            onChange={(event) => handleVehicleChange("month", event.target.value)}
          />
        </div>
        <div className="action-group">
          <button className="primary-btn" onClick={addVehicle}>
            Thêm phí gửi xe
          </button>
        </div>
      </div>

      <div className="page-card" style={{ marginTop: "24px" }}>
        <div className="page-card-header">
          <h3>Quản lý chi phí dịch vụ</h3>
          <p>Nhập chi phí điện, nước, internet theo tháng và nhà cung cấp.</p>
        </div>

        <div className="page-actions" style={{ flexWrap: "wrap" }}>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Loại dịch vụ</label>
            <select
              value={utilityForm.serviceType}
              onChange={(event) => handleUtilityChange("serviceType", event.target.value)}
            >
              <option>Điện</option>
              <option>Nước</option>
              <option>Internet</option>
            </select>
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Nhà cung cấp</label>
            <input
              value={utilityForm.provider}
              onChange={(event) => handleUtilityChange("provider", event.target.value)}
              placeholder="Tên nhà cung cấp"
            />
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Tháng</label>
            <input
              type="month"
              value={utilityForm.month}
              onChange={(event) => handleUtilityChange("month", event.target.value)}
            />
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <label>Số tiền</label>
            <input
              type="number"
              min="0"
              value={utilityForm.amount}
              onChange={(event) => handleUtilityChange("amount", event.target.value)}
              placeholder="Nhập số tiền"
            />
          </div>
          <div className="action-group">
            <button className="primary-btn" onClick={addUtility}>
              Thêm chi phí
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive" style={{ marginTop: "24px" }}>
        <h3>Danh sách phí gửi xe</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Hộ gia đình</th>
              <th>Loại</th>
              <th>Biển số</th>
              <th>Tháng</th>
              <th>Phí</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Chưa có dữ liệu phí gửi xe.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.household}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.plate}</td>
                  <td>{vehicle.month}</td>
                  <td>{vehicle.fee.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <button className="secondary-btn" onClick={() => removeVehicle(vehicle.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-responsive" style={{ marginTop: "24px" }}>
        <h3>Danh sách chi phí dịch vụ</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Loại dịch vụ</th>
              <th>Nhà cung cấp</th>
              <th>Tháng</th>
              <th>Số tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {utilities.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  Chưa có dữ liệu chi phí dịch vụ.
                </td>
              </tr>
            ) : (
              utilities.map((item) => (
                <tr key={item.id}>
                  <td>{item.serviceType}</td>
                  <td>{item.provider}</td>
                  <td>{item.month}</td>
                  <td>{item.amount.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <button className="secondary-btn" onClick={() => removeUtility(item.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="summary-grid" style={{ marginTop: "28px" }}>
        <article className="summary-card">
          <span className="summary-label">Tổng phí gửi xe</span>
          <strong>{parkingTotal.toLocaleString("vi-VN")}đ</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Tổng chi phí dịch vụ</span>
          <strong>{utilityTotal.toLocaleString("vi-VN")}đ</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Tổng thu tháng</span>
          <strong>{(parkingTotal + utilityTotal).toLocaleString("vi-VN")}đ</strong>
        </article>
      </div>
    </section>
  );
}
