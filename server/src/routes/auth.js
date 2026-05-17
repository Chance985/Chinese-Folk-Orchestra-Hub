const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');
const { requireAuth, signToken } = require('../middleware/auth');

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

module.exports = router;
