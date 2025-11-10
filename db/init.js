// db/init.js
const pool = require('./index');

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      password_plain TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      title TEXT,
      body TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS xss_logs (
      id SERIAL PRIMARY KEY,
      note TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  // Default settings
  const defaults = {
    sensitive_protection: 'true',
    stored_xss: 'false'
  };

  for (const [key, value] of Object.entries(defaults)) {
    const res = await pool.query('SELECT value FROM settings WHERE key=$1', [key]);
    if (res.rowCount === 0) {
      await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, value]);
    }
  }

  console.log('✅ Database initialized');
}

module.exports = initDb;
