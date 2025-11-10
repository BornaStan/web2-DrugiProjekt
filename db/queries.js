// db/queries.js
const pool = require('./index');
const bcrypt = require('bcrypt');

// SETTINGS
async function getSetting(key) {
  const r = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return r.rowCount ? r.rows[0].value : null;
}

async function setSetting(key, value) {
  await pool.query(`
    INSERT INTO settings (key, value)
    VALUES ($1, $2)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `, [key, value]);
}

// USERS
async function createUser(username, password, sensitiveProtection) {
  if (sensitiveProtection) {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password_hash, password_plain) VALUES ($1, $2, NULL)',
      [username, hash]
    );
  } else {
    await pool.query(
      'INSERT INTO users (username, password_hash, password_plain) VALUES ($1, NULL, $2)',
      [username, password]
    );
  }
}

async function getUsers() {
  const res = await pool.query('SELECT * FROM users ORDER BY id DESC');
  return res.rows;
}

async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

// MESSAGES (for XSS demonstration)
async function createMessage(title, body) {
  await pool.query('INSERT INTO messages (title, body) VALUES ($1, $2)', [title, body]);
}
async function getMessages() {
  const r = await pool.query('SELECT * FROM messages ORDER BY id DESC');
  return r.rows;
}
async function deleteMessage(id) {
  await pool.query('DELETE FROM messages WHERE id = $1', [id]);
}

// LOGS
async function logXss(note) {
  await pool.query('INSERT INTO xss_logs (note) VALUES ($1)', [note]);
}
async function getXssLogs() {
  const r = await pool.query('SELECT * FROM xss_logs ORDER BY id DESC');
  return r.rows;
}
async function deleteXssLog(id) {
  await pool.query('DELETE FROM xss_logs WHERE id = $1', [id]);
}

module.exports = {
  getSetting,
  setSetting,
  createUser,
  getUsers,
  deleteUser,
  createMessage,
  getMessages,
  deleteMessage,
  logXss,
  getXssLogs,
  deleteXssLog
};
