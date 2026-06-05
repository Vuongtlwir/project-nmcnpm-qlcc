const db = require('../config/database');

const getOverview = async () => {
  // 1. Total apartments
  const [[{ totalApartments }]] = await db.query('SELECT COUNT(*) as totalApartments FROM apartments');
  
  // 2. Occupied apartments
  const [[{ occupiedApartments }]] = await db.query("SELECT COUNT(*) as occupiedApartments FROM apartments WHERE status = 'occupied'");

  // 3. Total residents
  const [[{ totalResidents }]] = await db.query("SELECT COUNT(*) as totalResidents FROM residents WHERE status = 'active'");

  // 4. Total registered users
  const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');

  // 5. Total revenue (sum of paid payments)
  const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM payments WHERE status = 'paid'");

  // 6. Total pending complaints
  const [[{ pendingComplaints }]] = await db.query("SELECT COUNT(*) as pendingComplaints FROM complaints WHERE status = 'pending'");

  return {
    totalApartments,
    occupiedApartments,
    totalResidents,
    totalUsers,
    totalRevenue: parseFloat(totalRevenue),
    pendingComplaints
  };
};

const getRevenueByMonth = async () => {
  const query = `
    SELECT 
      DATE_FORMAT(payment_date, '%Y-%m') AS month,
      SUM(amount) AS revenue
    FROM payments
    WHERE status = 'paid'
    GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
    ORDER BY month ASC
    LIMIT 12
  `;
  const [rows] = await db.query(query);
  return rows.map(row => ({
    month: row.month,
    revenue: parseFloat(row.revenue)
  }));
};

const getFeeCollectionRate = async () => {
  const query = `
    SELECT 
      p.status,
      SUM(p.amount) AS total_amount
    FROM payments p
    GROUP BY p.status
  `;
  const [rows] = await db.query(query);
  
  let paid = 0;
  let pending = 0;
  let cancelled = 0;

  rows.forEach(row => {
    if (row.status === 'paid') paid = parseFloat(row.total_amount);
    else if (row.status === 'pending') pending = parseFloat(row.total_amount);
    else if (row.status === 'cancelled') cancelled = parseFloat(row.total_amount);
  });

  const total = paid + pending;
  const collectionRate = total > 0 ? ((paid / total) * 100).toFixed(2) : 0;

  return {
    paid,
    pending,
    cancelled,
    total,
    collectionRate: parseFloat(collectionRate)
  };
};

module.exports = {
  getOverview,
  getRevenueByMonth,
  getFeeCollectionRate
};
