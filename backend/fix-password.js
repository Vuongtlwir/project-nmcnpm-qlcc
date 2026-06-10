const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    // Generate hash for '123456'
    const hash = await bcrypt.hash('123456', 10);
    console.log('Generated hash:', hash);

    // Update database
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE id IN (1,2,3)',
      [hash]
    );
    console.log('Updated rows:', result.affectedRows);

    // Verify
    const [rows] = await db.execute(
      'SELECT id, username, password FROM users WHERE id IN (1,2,3)'
    );
    rows.forEach(row => {
      console.log(`${row.username}: ${row.password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
