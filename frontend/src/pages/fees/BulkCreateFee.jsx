import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { getApartments, updateApartment } from "../../services/apartmentService";
import { createFee } from "../../services/feeService";

const ELECTRICITY_PRICE = 3000;
const WATER_PRICE = 8500;
const INTERNET_FEE = 250000;

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function BulkCreateFee() {
  const fileRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);

  const downloadSample = () => {
    const [y, m] = month.split("-").map(Number);
    const label = `tháng ${m}/${y}`;
    const wb = XLSX.utils.book_new();
    const data = [
      ["Mã căn hộ", `Chỉ số điện ${label}`, `Chỉ số nước ${label}`],
      ["A-101", 180, 30],
      ["A-102", 160, 36],
      ["A-201", 280, 48],
      ["A-302", 220, 36],
      ["B-101", 120, 24],
      ["B-102", 160, 28],
      ["B-201", 250, 44],
      ["B-302", 190, 33],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Mẫu");
    XLSX.writeFile(wb, `mau_nhap_so_dien_nuoc_${m}_${y}.xlsx`);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);

    try {
      const allApts = await getApartments();
      setApartments(allApts);

      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const parsed = json.slice(1).filter((r) => r[0] && String(r[0]).trim());

      const [year, monthNum] = month.split("-").map(Number);
      const dueDate = new Date(Date.UTC(year, monthNum, 0));
      const dueDateStr = dueDate.toISOString().split("T")[0];

      const mapped = parsed.map((r) => {
        const code = String(r[0]).trim().toUpperCase();
        const apt = allApts.find((a) => a.code.toUpperCase() === code);
        const newElectric = Number(r[1]) || 0;
        const newWater = Number(r[2]) || 0;

        if (!apt) {
          return { code, error: "Không tìm thấy căn hộ", electricUsage: 0, waterUsage: 0, electricAmount: 0, waterAmount: 0, parkingAmount: 0, internetFee: 0, total: 0 };
        }

        const lastElectric = apt.last_electricity_reading ?? 0;
        const lastWater = apt.last_water_reading ?? 0;
        const electricUsage = Math.max(0, newElectric - lastElectric);
        const waterUsage = Math.max(0, newWater - lastWater);
        const electricAmount = electricUsage * ELECTRICITY_PRICE;
        const waterAmount = waterUsage * WATER_PRICE;
        const parkingAmount = (apt.motorbikes ?? 0) * 200000 + (apt.bicycles ?? 0) * 100000 + (apt.cars ?? 0) * 1000000;
        const total = electricAmount + waterAmount + parkingAmount + INTERNET_FEE;

        return {
          code,
          aptId: apt.id,
          owner: apt.owner_name || "—",
          motorbikes: apt.motorbikes ?? 0,
          bicycles: apt.bicycles ?? 0,
          cars: apt.cars ?? 0,
          lastElectric,
          lastWater,
          newElectric,
          newWater,
          electricUsage,
          waterUsage,
          electricAmount,
          waterAmount,
          parkingAmount,
          internetFee: INTERNET_FEE,
          total,
          dueDateStr,
          monthLabel: `tháng ${monthNum}/${year}`,
          error: null,
        };
      });

      setRows(mapped);
    } catch (err) {
      window.alert("Đọc file thất bại: " + err.message);
    }
  };

  const handleCreateAll = async () => {
    if (rows.length === 0) return;
    setCreating(true);
    setResult(null);

    const success = [];
    const failed = [];

    for (const row of rows) {
      if (row.error) {
        failed.push({ code: row.code, reason: row.error });
        continue;
      }

      try {
        const feesToCreate = [
          { label: `Tiền internet ${row.monthLabel}`, amount: INTERNET_FEE },
        ];
        if (row.parkingAmount > 0) {
          feesToCreate.push({ label: `Phí gửi xe ${row.monthLabel}`, amount: row.parkingAmount });
        }
        if (row.electricAmount > 0) {
          feesToCreate.push({ label: `Tiền điện ${row.monthLabel}`, amount: row.electricAmount });
        }
        if (row.waterAmount > 0) {
          feesToCreate.push({ label: `Tiền nước ${row.monthLabel}`, amount: row.waterAmount });
        }

        for (const fee of feesToCreate) {
          await createFee({
            name: fee.label,
            type: "mandatory",
            amount: fee.amount,
            apartment_id: row.aptId,
            due_date: row.dueDateStr,
            description: `Phí cho căn hộ ${row.code}`,
          });
        }

        await updateApartment(row.aptId, {
          last_electricity_reading: row.newElectric,
          electricity_reading: row.newElectric,
          last_water_reading: row.newWater,
          water_reading: row.newWater,
        });

        success.push(row.code);
      } catch (err) {
        failed.push({ code: row.code, reason: err?.response?.data?.message || err.message });
      }
    }

    setResult({ success, failed });
    setCreating(false);
  };

  const validRows = rows.filter((r) => !r.error);
  const totalAll = validRows.reduce((s, r) => s + r.total, 0);
  const [yearNum, monthNum] = month.split("-").map(Number);
  const prevMonthLabel = monthNum > 1 ? `tháng ${monthNum - 1}` : `tháng 12 (năm ${yearNum - 1})`;
  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Nhập hóa đơn hàng loạt</h2>
        <p>Tải lên file Excel để tạo hóa đơn cho nhiều căn hộ cùng lúc.</p>
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="search-field" style={{ minWidth: 200 }}>
            <label>Tháng</label>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
          </div>
          <button type="button" className="secondary-btn" onClick={downloadSample} style={{ marginBottom: 2 }}>
            Tải file mẫu
          </button>
        </div>

        <div className="search-field">
          <label>File Excel (.xlsx)</label>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            style={{ padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", width: "100%" }}
          />
          <span style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 4, display: "block" }}>
            Cột A: Mã căn hộ, Cột B: Chỉ số điện tháng, Cột C: Chỉ số nước tháng
          </span>
        </div>

        {rows.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: "0.82rem" }}>
                <thead>
                  <tr>
                    <th>Căn hộ</th>
                    <th>Chủ hộ</th>
                    <th>Xe máy/Xe đạp/Ô tô</th>
                    <th>Điện ({prevMonthLabel} → tháng {monthNum})</th>
                    <th>Nước ({prevMonthLabel} → tháng {monthNum})</th>
                    <th>Tiền điện</th>
                    <th>Tiền nước</th>
                    <th>Phí gửi xe</th>
                    <th>Internet</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={r.error ? { background: "#fef2f2" } : {}}>
                      <td><strong>{r.code}</strong></td>
                      <td>{r.error ? <span style={{ color: "#ef4444" }}>{r.error}</span> : r.owner}</td>
                      <td>{r.error ? "—" : `${r.motorbikes}/${r.bicycles}/${r.cars}`}</td>
                      <td>{r.error ? "—" : `${r.electricUsage} kWh (${r.lastElectric} → ${r.newElectric})`}</td>
                      <td>{r.error ? "—" : `${r.waterUsage} m³ (${r.lastWater} → ${r.newWater})`}</td>
                      <td>{r.error ? "—" : formatMoney(r.electricAmount)}</td>
                      <td>{r.error ? "—" : formatMoney(r.waterAmount)}</td>
                      <td>{r.error ? "—" : formatMoney(r.parkingAmount)}</td>
                      <td>{r.error ? "—" : formatMoney(r.internetFee)}</td>
                      <td><strong>{r.error ? "—" : formatMoney(r.total)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#eff6ff", borderRadius: 8 }}>
              <span style={{ fontWeight: 600 }}>Tổng tất cả: <strong style={{ fontSize: "1.1rem", color: "#2563eb" }}>{formatMoney(totalAll)}</strong></span>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{validRows.length} căn hộ hợp lệ</span>
            </div>

            {result && (
              <div style={{ padding: 12, borderRadius: 8, background: result.failed.length === 0 ? "#dcfce7" : "#fef3c7", fontSize: "0.85rem" }}>
                <strong>Kết quả:</strong> Thành công {result.success.length} căn{result.failed.length > 0 ? `, thất bại ${result.failed.length} căn (${result.failed.map(f => `${f.code}: ${f.reason}`).join("; ")})` : ""}
              </div>
            )}

            <div className="page-actions" style={{ justifyContent: "flex-end" }}>
              <Link to="/admin/bills" className="secondary-btn">Quay lại</Link>
              <button type="button" className="primary-btn" onClick={handleCreateAll} disabled={creating || validRows.length === 0}>
                {creating ? "Đang tạo..." : `Tạo hóa đơn (${validRows.length} căn)`}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
