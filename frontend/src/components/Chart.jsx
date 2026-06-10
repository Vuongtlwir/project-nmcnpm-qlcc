export default function Chart({
  title,
  value,
  loading = false,
}) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <div className="chart-placeholder">
        {loading ? "Loading..." : value}
      </div>
    </div>
  );
}