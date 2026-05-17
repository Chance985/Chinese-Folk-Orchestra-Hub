const express = require('express');
const { getDb } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

function parseTags(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    if (!value.trim()) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch (_error) {
      return value.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapMember(row) {
  if (!row) return null;
  return {
    ...row,
    tags: parseTags(row.tags),
    is_demo: Boolean(row.is_demo),
  };
}

function validateMember(body) {
  const required = ['name', 'instrument', 'section', 'role', 'bio'];
  const missing = required.filter((field) => !String(body[field] || '').trim());
  if (missing.length) return `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required.`;
  return null;
}

router.get('/', (req, res) => {
  const search = String(req.query.search || '').trim();
  const instrument = String(req.query.instrument || '').trim();
  const section = String(req.query.section || '').trim();
  const conditions = [];
  const params = {};

  if (search) {
    conditions.push('(name LIKE @search OR instrument LIKE @search OR section LIKE @search OR role LIKE @search OR bio LIKE @search OR tags LIKE @search)');
    params.search = `%${search}%`;
  }
  if (instrument) {
    conditions.push('instrument = @instrument');
    params.instrument = instrument;
  }
  if (section) {
    conditions.push('section = @section');
    params.section = section;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = getDb()
    .prepare(`SELECT * FROM members ${where} ORDER BY section, instrument, name`)
    .all(params);
  return res.json({
    items: rows.map(mapMember),
    itemCount: rows.length,
  });
});

router.get('/:id', (req, res) => {
  const member = getDb().prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found.' });
  return res.json({ item: mapMember(member) });
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const error = validateMember(req.body || {});
  if (error) return res.status(400).json({ message: error });

  const payload = {
    name: String(req.body.name).trim(),
    instrument: String(req.body.instrument).trim(),
    section: String(req.body.section).trim(),
    role: String(req.body.role).trim(),
    bio: String(req.body.bio).trim(),
    photo_url: String(req.body.photo_url || '').trim(),
    video_url: String(req.body.video_url || '').trim(),
    tags: JSON.stringify(parseTags(req.body.tags)),
    source_note: String(req.body.source_note || 'Created by admin in local system.').trim(),
    is_demo: req.body.is_demo ? 1 : 0,
  };

  const result = getDb().prepare(`
    INSERT INTO members (name, instrument, section, role, bio, photo_url, video_url, tags, source_note, is_demo)
    VALUES (@name, @instrument, @section, @role, @bio, @photo_url, @video_url, @tags, @source_note, @is_demo)
  `).run(payload);

  const member = getDb().prepare('SELECT * FROM members WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ item: mapMember(member) });
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const existing = getDb().prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Member not found.' });
  const merged = { ...existing, ...(req.body || {}) };
  const error = validateMember(merged);
  if (error) return res.status(400).json({ message: error });

  const payload = {
    id: req.params.id,
    name: String(merged.name).trim(),
    instrument: String(merged.instrument).trim(),
    section: String(merged.section).trim(),
    role: String(merged.role).trim(),
    bio: String(merged.bio).trim(),
    photo_url: String(merged.photo_url || '').trim(),
    video_url: String(merged.video_url || '').trim(),
    tags: JSON.stringify(parseTags(merged.tags)),
    source_note: String(merged.source_note || '').trim(),
    is_demo: merged.is_demo ? 1 : 0,
  };

  getDb().prepare(`
    UPDATE members
    SET name = @name,
        instrument = @instrument,
        section = @section,
        role = @role,
        bio = @bio,
        photo_url = @photo_url,
        video_url = @video_url,
        tags = @tags,
        source_note = @source_note,
        is_demo = @is_demo,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run(payload);

  const member = getDb().prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  return res.json({ item: mapMember(member) });
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const result = getDb().prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Member not found.' });
  return res.json({ message: 'Member deleted.' });
});

module.exports = router;
