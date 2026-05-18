const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');
const { requireAuth, requireRole, signToken } = require('../middleware/auth');

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    member_id: user.member_id,
    created_at: user.created_at,
  };
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = getDb()
    .prepare('SELECT id, username, password_hash, role, member_id, created_at FROM users WHERE username = ?')
    .get(String(username).trim());

  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const safeUser = publicUser(user);
  return res.json({ token: signToken(safeUser), user: safeUser });
});

router.get('/me', requireAuth, (req, res) => {
  const user = getDb()
    .prepare('SELECT id, username, role, member_id, created_at FROM users WHERE id = ?')
    .get(req.user.id);
  return res.json({ user: publicUser(user) });
});

router.post('/logout', (_req, res) => {
  return res.json({ message: 'Logged out.' });
});

router.get('/users', requireAuth, requireRole('admin'), (req, res) => {
  const rows = getDb()
    .prepare(`
      SELECT u.id, u.username, u.role, u.member_id, u.created_at,
             m.name AS member_name, m.chinese_name AS member_chinese_name
      FROM users u
      LEFT JOIN members m ON u.member_id = m.id
      ORDER BY u.id
    `)
    .all();
  return res.json({ items: rows, itemCount: rows.length });
});

router.put('/users/:id/role', requireAuth, requireRole('admin'), (req, res) => {
  const { role } = req.body || {};
  if (!['admin', 'member', 'president'].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin, member, or president.' });
  }
  const result = getDb()
    .prepare('UPDATE users SET role = ? WHERE id = ?')
    .run(role, req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'User not found.' });
  const user = getDb()
    .prepare('SELECT id, username, role, member_id, created_at FROM users WHERE id = ?')
    .get(req.params.id);
  return res.json({ user: publicUser(user) });
});

module.exports = router;
