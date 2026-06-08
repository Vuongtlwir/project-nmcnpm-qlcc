require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/config/database');

const users = [
  {
    username: 'admin',
    email: 'admin@qlcc.com',
    password: '123456',
    role: 'admin',
    full_name: 'Administrator',
    phone: '0912345678',
  },
  {
    username: 'user1',
    email: 'user1@qlcc.com',
    password: '123456',
    role: 'user',
    full_name: 'Người dùng mẫu',
    phone: '0987654321',
  },
];

const seedUsers = async () => {
  try {
    for (const user of users) {
      const [existing] = await db.execute('SELECT id FROM users WHERE username = ? OR email = ?', [user.username, user.email]);
      if (existing.length > 0) {
        console.log(`User ${user.username} already exists, skipping.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.execute(
        'INSERT INTO users (username, email, password, role, full_name, phone, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [user.username, user.email, hashedPassword, user.role, user.full_name, user.phone]
      );
      console.log(`Created sample user: ${user.username}`);
    }
  } catch (error) {
    console.error('Seeding error:', error.message || error);
    process.exit(1);
  } finally {
    await db.end();
    process.exit(0);
  }
};

seedUsers();
