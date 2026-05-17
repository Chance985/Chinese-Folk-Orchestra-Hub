const jwt = require('jsonwebtoken');
const { getDb } = require('../db');

function jwtSecret() {
  return process.env.JWT_SECRET || 'development-only-change-this-secret';
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      member_id: user.member_id,
    },
    jwtSecret(),
    { expiresIn: '8h' },
  );
}

function readBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

function attachUser(req, _res, next) {
  const token = readBearerToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, jwtSecret());
    const user = getDb()
      .prepare('SELECT id, username, role, member_id, created_at FROM users WHERE id = ?')
      .get(payload.id);
    if (user) req.user = user;
  } catch (_error) {
    req.authError = 'Invalid or expired token.';
  }
  return next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: req.authError || 'Authentication required.' });
  }
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action.' });
    }
    return next();
  };
}

module.exports = {
  attachUser,
  requireAuth,
  requireRole,
  signToken,
};
