const express = require('express');
const { getDb } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const visibilityOptions = ['public', 'members', 'admin'];

function allowedVisibility(req) {
  if (req.user?.role === 'admin' || req.user?.role === 'president') return visibilityOptions;
  if (req.user?.role === 'member') return ['public', 'members'];
  return ['public'];
}

function validateAnnouncement(body) {
  if (!String(body.title || '').trim()) return 'Title is required.';
  if (!String(body.content || '').trim()) return 'Content is required.';
  if (!visibilityOptions.includes(String(body.visible_to || 'members'))) {
    return 'Visibility must be public, members, or admin.';
  }
  return null;
}

router.get('/', (req, res) => {
  const visible = allowedVisibility(req);
  const placeholders = visible.map(() => '?').join(', ');
  const rows = getDb()
    .prepare(`SELECT * FROM announcements WHERE visible_to IN (${placeholders}) ORDER BY created_at DESC`)
    .all(...visible);
  return res.json({ items: rows, itemCount: rows.length });
});

router.post('/', requireAuth, requireRole('admin', 'president'), (req, res) => {
  const error = validateAnnouncement(req.body || {});
  if (error) return res.status(400).json({ message: error });
  const payload = {
    title: String(req.body.title).trim(),
    content: String(req.body.content).trim(),
    visible_to: String(req.body.visible_to || 'members').trim(),
  };
  const result = getDb().prepare(`
    INSERT INTO announcements (title, content, visible_to)
    VALUES (@title, @content, @visible_to)
  `).run(payload);
  const announcement = getDb().prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ item: announcement });
});

router.put('/:id', requireAuth, requireRole('admin', 'president'), (req, res) => {
  const error = validateAnnouncement(req.body || {});
  if (error) return res.status(400).json({ message: error });
  const payload = {
    id: req.params.id,
    title: String(req.body.title).trim(),
    content: String(req.body.content).trim(),
    visible_to: String(req.body.visible_to || 'members').trim(),
  };
  const result = getDb().prepare(`
    UPDATE announcements
    SET title = @title,
        content = @content,
        visible_to = @visible_to,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run(payload);
  if (!result.changes) return res.status(404).json({ message: 'Announcement not found.' });
  const announcement = getDb().prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
  return res.json({ item: announcement });
});

router.delete('/:id', requireAuth, requireRole('admin', 'president'), (req, res) => {
  const result = getDb().prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Announcement not found.' });
  return res.json({ message: 'Announcement deleted.' });
});

module.exports = router;
