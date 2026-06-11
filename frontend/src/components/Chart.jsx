export function DonutChart({ data, size = 180, thickness = 28 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d) => {
    const pct = d.value / total;
    const len = pct * circ;
    const seg = { ...d, pct, len, offset };
    offset += len;
    return seg;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={thickness}
          strokeDasharray={`${seg.len} ${circ - seg.len}`}
          strokeDashoffset={-offset + seg.len}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="1.6rem" fontWeight="700" fill="#0f172a">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="0.7rem" fill="#64748b">
        Tổng căn hộ
      </text>
    </svg>
  );
}

export default function Chart({ title, value, loading }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="chart-placeholder">{loading ? "Loading..." : value}</div>
    </div>
  );
}

export function BarChart({ data, height = 200, barWidth = 32 }) {
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals, 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, paddingTop: 8 }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
              {d.value.toLocaleString("vi-VN")}đ
            </span>
            <div
              style={{
                width: "100%",
                maxWidth: barWidth,
                height: `${pct}%`,
                minHeight: 4,
                borderRadius: "6px 6px 0 0",
                background: d.color || "#3b82f6",
                transition: "height 0.5s ease",
              }}
            />
            <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 6, whiteSpace: "nowrap" }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
