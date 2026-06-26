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
  const paymentQuery = `
    SELECT p.status, SUM(p.amount) AS total_amount
    FROM payments p
    GROUP BY p.status
  `;
  const [paymentRows] = await db.query(paymentQuery);

  const [[{ totalFees }]] = await db.query(`
    SELECT COALESCE(SUM(amount), 0) AS totalFees FROM fees WHERE status = 'active'
  `);

  let paid = 0;
  let pending = 0;
  let cancelled = 0;

  paymentRows.forEach(row => {
    if (row.status === 'paid') paid = parseFloat(row.total_amount);
    else if (row.status === 'pending') pending = parseFloat(row.total_amount);
    else if (row.status === 'cancelled') cancelled = parseFloat(row.total_amount);
  });

  const unpaid = Math.max(0, parseFloat(totalFees) - paid);

  return {
    paid,
    pending,
    cancelled,
    unpaid,
    collectionRate: totalFees > 0 ? parseFloat(((paid / parseFloat(totalFees)) * 100).toFixed(2)) : 0
  };
};

const getApartmentStatus = async () => {
  const [rows] = await db.query(`
    SELECT status, COUNT(*) as count
    FROM apartments
    GROUP BY status
  `);
  const result = { occupied: 0, empty: 0, maintenance: 0, sold: 0 };
  rows.forEach(row => {
    if (row.status === 'occupied') result.occupied = row.count;
    else if (row.status === 'empty') result.empty = row.count;
    else if (row.status === 'maintenance') result.maintenance = row.count;
    else if (row.status === 'sold') result.sold = row.count;
  });
  return result;
};

module.exports = {
  getOverview,
  getRevenueByMonth,
  getFeeCollectionRate,
  getApartmentStatus
};
