import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResidents } from "../../services/residentService";
import { getApartmentById, updateApartment } from "../../services/apartmentService";
import { createFee } from "../../services/feeService";

const ELECTRICITY_PRICE = 3000;
const WATER_PRICE = 8500;
const INTERNET_FEE = 250000;

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function CreateFee() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [apartment, setApartment] = useState(null);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [electricReading, setElectricReading] = useState("");
  const [waterReading, setWaterReading] = useState("");
  const [extraFees, setExtraFees] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getResidents({ limit: 100 }).then(setResidents).catch(() => setResidents([]));
  }, []);

  const resident = residents.find((r) => r.id === Number(selectedId));

  useEffect(() => {
    if (resident?.apartment_id) {
      getApartmentById(resident.apartment_id).then(setApartment).catch(() => setApartment(null));
    } else {
      setApartment(null);
    }
  }, [resident]);

  const [yearNum, monthNum] = month.split("-").map(Number);
  const dueDate = new Date(Date.UTC(yearNum, monthNum, 0));
  const dueDateStr = dueDate.toISOString().split("T")[0];

  const lastElectric = apartment?.last_electricity_reading ?? 0;
  const lastWater = apartment?.last_water_reading ?? 0;
  const newElectric = Number(electricReading) || 0;
  const newWater = Number(waterReading) || 0;
  const electricUsage = Math.max(0, newElectric - lastElectric);
  const waterUsage = Math.max(0, newWater - lastWater);
  const electricAmount = electricUsage * ELECTRICITY_PRICE;
  const waterAmount = waterUsage * WATER_PRICE;

  const bikeCount = apartment?.motorbikes ?? 0;
  const bicycleCount = apartment?.bicycles ?? 0;
  const carCount = apartment?.cars ?? 0;
  const parkingAmount = bikeCount * 200000 + bicycleCount * 100000 + carCount * 1000000;

  const extraTotal = extraFees.reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const totalAmount = INTERNET_FEE + parkingAmount + electricAmount + waterAmount + extraTotal;

  const addExtra = () => setExtraFees([...extraFees, { label: "", amount: "" }]);
  const updateExtra = (i, field, val) => {
    const copy = [...extraFees];
    copy[i] = { ...copy[i], [field]: val };
    setExtraFees(copy);
  };
  const removeExtra = (i) => setExtraFees(extraFees.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!selectedId) return window.alert("Vui lòng chọn cư dân.");
    if (!resident?.apartment_id) return window.alert("Cư dân chưa có căn hộ.");
    if (!month) return window.alert("Vui lòng chọn tháng.");
    setSubmitting(true);

    try {
      const monthLabel = `tháng ${monthNum}/${yearNum}`;
      const aptCode = resident.apartment_code || "N/A";
      const feesToCreate = [
        { label: `Tiền internet ${monthLabel}`, amount: INTERNET_FEE },
      ];

      if (parkingAmount > 0) {
        feesToCreate.push({ label: `Phí gửi xe ${monthLabel}`, amount: parkingAmount });
      }
      if (electricAmount > 0) {
        feesToCreate.push({ label: `Tiền điện ${monthLabel}`, amount: electricAmount });
      }
      if (waterAmount > 0) {
        feesToCreate.push({ label: `Tiền nước ${monthLabel}`, amount: waterAmount });
      }
      extraFees.forEach((f) => {
        if (f.label && Number(f.amount) > 0) {
          feesToCreate.push({ label: `${f.label} ${monthLabel}`, amount: Number(f.amount) });
        }
      });

      for (const fee of feesToCreate) {
        await createFee({
          name: fee.label,
          type: "mandatory",
          amount: fee.amount,
          apartment_id: resident.apartment_id,
          due_date: dueDateStr,
          description: `Phí cho căn hộ ${aptCode}`,
        });
      }

      if (electricReading) {
        await updateApartment(resident.apartment_id, {
          last_electricity_reading: newElectric,
          electricity_reading: newElectric,
        });
      }
      if (waterReading) {
        await updateApartment(resident.apartment_id, {
          last_water_reading: newWater,
          water_reading: newWater,
        });
      }

      window.alert("Tạo hóa đơn thành công!");
      navigate("/admin/bills");
    } catch (err) {
      window.alert("Tạo hóa đơn thất bại: " + (err?.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Tạo hóa đơn</h2>
        <p>Chọn cư dân, nhập chỉ số điện/nước và tạo hóa đơn cho căn hộ.</p>
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="search-field">
          <label>Cư dân</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
            <option value="">-- Chọn cư dân --</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>{r.full_name || r.linked_username} - {r.apartment_code || "N/A"}</option>
            ))}
          </select>
        </div>

        {resident && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: "0.85rem" }}>
            <span>Căn hộ: <strong>{resident.apartment_code || "N/A"}</strong></span>
            <span>Chủ hộ: <strong>{resident.full_name || "N/A"}</strong></span>
            <span>Xe máy: <strong>{apartment?.motorbikes ?? 0}</strong></span>
            <span>Ô tô: <strong>{apartment?.cars ?? 0}</strong></span>
            <span>Xe đạp: <strong>{apartment?.bicycles ?? 0}</strong></span>
            <span>Chỉ số điện cũ: <strong>{lastElectric}</strong></span>
            <span>Chỉ số nước cũ: <strong>{lastWater}</strong></span>
          </div>
        )}

        <div className="search-field">
          <label>Tháng</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="search-field">
            <label>Chỉ số điện mới</label>
            <input type="number" min="0" value={electricReading} onChange={(e) => setElectricReading(e.target.value)} placeholder={String(lastElectric)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            {electricAmount > 0 && <span style={{ fontSize: "0.78rem", color: "#2563eb" }}>Tiền điện: {formatMoney(electricAmount)} ({electricUsage} kWh × 3.000đ)</span>}
          </div>
          <div className="search-field">
            <label>Chỉ số nước mới</label>
            <input type="number" min="0" value={waterReading} onChange={(e) => setWaterReading(e.target.value)} placeholder={String(lastWater)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            {waterAmount > 0 && <span style={{ fontSize: "0.78rem", color: "#2563eb" }}>Tiền nước: {formatMoney(waterAmount)} ({waterUsage} m³ × 8.500đ)</span>}
          </div>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
          <h4 style={{ margin: "0 0 12px", fontSize: "0.95rem" }}>Các khoản phí</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <span>Internet</span>
              <span>{formatMoney(INTERNET_FEE)}</span>
            </div>
            {parkingAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span>Phí gửi xe</span>
                <span>{formatMoney(parkingAmount)}</span>
              </div>
            )}
            {electricAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span>Tiền điện ({electricUsage} kWh)</span>
                <span style={{ color: "#2563eb" }}>{formatMoney(electricAmount)}</span>
              </div>
            )}
            {waterAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span>Tiền nước ({waterUsage} m³)</span>
                <span style={{ color: "#2563eb" }}>{formatMoney(waterAmount)}</span>
              </div>
            )}
            {extraFees.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text" placeholder="Tên phí" value={f.label}
                  onChange={(e) => updateExtra(i, "label", e.target.value)}
                  style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: "0.82rem" }}
                />
                <input
                  type="number" placeholder="Số tiền" min="0" value={f.amount}
                  onChange={(e) => updateExtra(i, "amount", e.target.value)}
                  style={{ width: 140, padding: "6px 8px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: "0.82rem" }}
                />
                <button type="button" className="secondary-btn" style={{ padding: "4px 8px", fontSize: "0.78rem" }} onClick={() => removeExtra(i)}>X</button>
              </div>
            ))}
            <button type="button" className="secondary-btn" style={{ alignSelf: "flex-start", fontSize: "0.82rem", padding: "6px 12px" }} onClick={addExtra}>
              + Thêm phí
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#eff6ff", borderRadius: 8 }}>
          <span style={{ fontWeight: 600 }}>Tổng cộng</span>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#2563eb" }}>{formatMoney(totalAmount)}</span>
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn" onClick={() => navigate("/admin/bills")}>Hủy</button>
          <button type="button" className="primary-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Đang tạo..." : "Tạo hóa đơn"}
          </button>
        </div>
      </div>
    </section>
  );
}
