const express = require('express');
const { getDb } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM resources ORDER BY id ASC').all();
  return res.json({ items: rows, itemCount: rows.length });
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const required = ['resource_type', 'website_source', 'what_was_used', 'how_modified'];
  const missing = required.filter((field) => !String(req.body?.[field] || '').trim());
  if (missing.length) {
    return res.status(400).json({ message: `${missing.join(', ')} required.` });
  }

  const payload = {
    resource_type: String(req.body.resource_type).trim(),
    website_source: String(req.body.website_source).trim(),
    what_was_used: String(req.body.what_was_used).trim(),
    how_modified: String(req.body.how_modified).trim(),
  };
  const result = getDb().prepare(`
    INSERT INTO resources (resource_type, website_source, what_was_used, how_modified)
    VALUES (@resource_type, @website_source, @what_was_used, @how_modified)
  `).run(payload);
  const resource = getDb().prepare('SELECT * FROM resources WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ item: resource });
});

module.exports = router;
