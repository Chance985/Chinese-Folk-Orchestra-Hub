const express = require('express');
const { getDb } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', requireAuth, (req, res) => {
  const database = getDb();
  const summary = {
    members: database.prepare('SELECT COUNT(*) AS count FROM members').get().count,
    pendingApplications: req.user.role === 'admin'
      ? database.prepare("SELECT COUNT(*) AS count FROM applications WHERE status = 'Pending'").get().count
      : 0,
    upcomingEvents: database.prepare("SELECT COUNT(*) AS count FROM events WHERE event_date >= datetime('now')").get().count,
    announcements: database.prepare('SELECT COUNT(*) AS count FROM announcements').get().count,
  };
  return res.json({ summary });
});

module.exports = router;
