const express = require('express');
const { getDb } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const statuses = ['Pending', 'Interview Scheduled', 'Rejected', 'Passed', 'Joined'];

function validateApplication(body) {
  const required = [
    'full_name',
    'student_id',
    'email',
    'phone',
    'instrument_interest',
    'experience',
    'introduction',
    'available_time',
  ];
  const missing = required.filter((field) => !String(body[field] || '').trim());
  if (missing.length) return `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required.`;
  if (!/^\S+@\S+\.\S+$/.test(String(body.email || ''))) {
    return 'A valid email address is required.';
  }
  return null;
}

router.post('/', (req, res) => {
  const error = validateApplication(req.body || {});
  if (error) return res.status(400).json({ message: error });

  const payload = {
    full_name: String(req.body.full_name).trim(),
    student_id: String(req.body.student_id).trim(),
    email: String(req.body.email).trim(),
    phone: String(req.body.phone).trim(),
    instrument_interest: String(req.body.instrument_interest).trim(),
    experience: String(req.body.experience).trim(),
    introduction: String(req.body.introduction).trim(),
    portfolio_url: String(req.body.portfolio_url || '').trim(),
    available_time: String(req.body.available_time).trim(),
    message: String(req.body.message || '').trim(),
  };
  const result = getDb().prepare(`
    INSERT INTO applications
      (full_name, student_id, email, phone, instrument_interest, experience, introduction, portfolio_url, available_time, message)
    VALUES
      (@full_name, @student_id, @email, @phone, @instrument_interest, @experience, @introduction, @portfolio_url, @available_time, @message)
  `).run(payload);

  const application = getDb().prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ item: application });
});

router.get('/', requireAuth, requireRole('admin'), (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
  return res.json({ items: rows, itemCount: rows.length });
});

router.get('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const application = getDb().prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  if (!application) return res.status(404).json({ message: 'Application not found.' });
  return res.json({ item: application });
});

router.put('/:id/status', requireAuth, requireRole('admin'), (req, res) => {
  const status = String(req.body.status || '').trim();
  if (!statuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${statuses.join(', ')}.` });
  }
  const result = getDb().prepare(`
    UPDATE applications
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Application not found.' });
  const application = getDb().prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  return res.json({ item: application });
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const result = getDb().prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Application not found.' });
  return res.json({ message: 'Application deleted.' });
});

module.exports = router;
