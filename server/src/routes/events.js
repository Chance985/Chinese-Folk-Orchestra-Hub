const express = require('express');
const { getDb } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const visibilityOptions = ['public', 'members'];

function validateEvent(body) {
  const required = ['title', 'type', 'event_date', 'location', 'description'];
  const missing = required.filter((field) => !String(body[field] || '').trim());
  if (missing.length) return `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required.`;
  if (!visibilityOptions.includes(String(body.visibility || 'public'))) {
    return 'Visibility must be public or members.';
  }
  return null;
}

function allowedVisibility(req) {
  if (req.user?.role === 'admin' || req.user?.role === 'member') return visibilityOptions;
  return ['public'];
}

router.get('/', (req, res) => {
  const visible = allowedVisibility(req);
  const placeholders = visible.map(() => '?').join(', ');
  const rows = getDb()
    .prepare(`SELECT * FROM events WHERE visibility IN (${placeholders}) ORDER BY event_date ASC`)
    .all(...visible);
  return res.json({ items: rows, itemCount: rows.length });
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const error = validateEvent(req.body || {});
  if (error) return res.status(400).json({ message: error });
  const payload = {
    title: String(req.body.title).trim(),
    type: String(req.body.type).trim(),
    event_date: String(req.body.event_date).trim(),
    location: String(req.body.location).trim(),
    description: String(req.body.description).trim(),
    visibility: String(req.body.visibility || 'public').trim(),
  };
  const result = getDb().prepare(`
    INSERT INTO events (title, type, event_date, location, description, visibility)
    VALUES (@title, @type, @event_date, @location, @description, @visibility)
  `).run(payload);
  const event = getDb().prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ item: event });
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const error = validateEvent(req.body || {});
  if (error) return res.status(400).json({ message: error });
  const payload = {
    id: req.params.id,
    title: String(req.body.title).trim(),
    type: String(req.body.type).trim(),
    event_date: String(req.body.event_date).trim(),
    location: String(req.body.location).trim(),
    description: String(req.body.description).trim(),
    visibility: String(req.body.visibility || 'public').trim(),
  };
  const result = getDb().prepare(`
    UPDATE events
    SET title = @title,
        type = @type,
        event_date = @event_date,
        location = @location,
        description = @description,
        visibility = @visibility,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run(payload);
  if (!result.changes) return res.status(404).json({ message: 'Event not found.' });
  const event = getDb().prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  return res.json({ item: event });
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const result = getDb().prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Event not found.' });
  return res.json({ message: 'Event deleted.' });
});

module.exports = router;
