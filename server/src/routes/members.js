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

router.put('/:id/profile', requireAuth, (req, res) => {
  const existing = getDb().prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Member not found.' });

  const isOwnProfile =
    req.user.role === 'member' && Number(req.user.member_id) === Number(req.params.id);
  if (req.user.role !== 'admin' && !isOwnProfile) {
    return res.status(403).json({ message: 'You can only edit your linked member profile.' });
  }

  const hasField = (field) => Object.prototype.hasOwnProperty.call(req.body || {}, field);
  const payload = {
    id: req.params.id,
    bio: hasField('bio') ? String(req.body.bio || '').trim() : existing.bio,
    photo_url: hasField('photo_url')
      ? String(req.body.photo_url || '').trim()
      : existing.photo_url || '',
    video_url: hasField('video_url')
      ? String(req.body.video_url || '').trim()
      : existing.video_url || '',
    tags: hasField('tags') ? JSON.stringify(parseTags(req.body.tags)) : existing.tags,
  };

  if (!payload.bio) return res.status(400).json({ message: 'Bio is required.' });

  getDb().prepare(`
    UPDATE members
    SET bio = @bio,
        photo_url = @photo_url,
        video_url = @video_url,
        tags = @tags,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run(payload);

  const member = getDb().prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
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
    chinese_name: String(req.body.chinese_name || '').trim(),
    pinyin_name: String(req.body.pinyin_name || '').trim(),
    gender: String(req.body.gender || '').trim(),
    student_id: String(req.body.student_id || '').trim(),
    kean_email: String(req.body.kean_email || '').trim(),
    membership_period: String(req.body.membership_period || '').trim(),
  };

  const result = getDb().prepare(`
    INSERT INTO members (name, instrument, section, role, bio, photo_url, video_url, tags, source_note, is_demo, chinese_name, pinyin_name, gender, student_id, kean_email, membership_period)
    VALUES (@name, @instrument, @section, @role, @bio, @photo_url, @video_url, @tags, @source_note, @is_demo, @chinese_name, @pinyin_name, @gender, @student_id, @kean_email, @membership_period)
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
    chinese_name: String(merged.chinese_name || '').trim(),
    pinyin_name: String(merged.pinyin_name || '').trim(),
    gender: String(merged.gender || '').trim(),
    student_id: String(merged.student_id || '').trim(),
    kean_email: String(merged.kean_email || '').trim(),
    membership_period: String(merged.membership_period || '').trim(),
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
        chinese_name = @chinese_name,
        pinyin_name = @pinyin_name,
        gender = @gender,
        student_id = @student_id,
        kean_email = @kean_email,
        membership_period = @membership_period,
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

router.get('/export/csv', requireAuth, requireRole('admin', 'president'), (req, res) => {
  const rows = getDb().prepare('SELECT * FROM members ORDER BY section, instrument, name').all();
  const headers = ['ID', 'Name', 'Chinese Name', 'Pinyin', 'Instrument', 'Section', 'Role', 'Gender', 'Student ID', 'Kean Email', 'Membership Period', 'Bio'];
  const csvRows = [headers.join(',')];
  rows.forEach((row) => {
    csvRows.push([
      row.id,
      `"${(row.name || '').replace(/"/g, '""')}"`,
      `"${(row.chinese_name || '').replace(/"/g, '""')}"`,
      `"${(row.pinyin_name || '').replace(/"/g, '""')}"`,
      `"${(row.instrument || '').replace(/"/g, '""')}"`,
      `"${(row.section || '').replace(/"/g, '""')}"`,
      `"${(row.role || '').replace(/"/g, '""')}"`,
      row.gender || '',
      row.student_id || '',
      row.kean_email || '',
      row.membership_period || '',
      `"${(row.bio || '').replace(/"/g, '""')}"`,
    ].join(','));
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
  return res.send('\uFEFF' + csvRows.join('\n'));
});

module.exports = router;
