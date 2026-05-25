require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { seedDatabase } = require('./db');
const { attachUser } = require('./middleware/auth');
const { applySecurityMiddleware, loginLimiter } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const applicationRoutes = require('./routes/applications');
const announcementRoutes = require('./routes/announcements');
const eventRoutes = require('./routes/events');
const dashboardRoutes = require('./routes/dashboard');

seedDatabase();

const app = express();
const port = Number(process.env.PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ── Security (must come first) ────────────────────────────────────────────────
applySecurityMiddleware(app);

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(attachUser);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Chinese Folk Orchestra Hub API' });
});

// Login gets its own stricter limiter
app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Error handlers ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const message = process.env.NODE_ENV === 'production'
    ? 'Server error. Please try again.'
    : error.message;
  res.status(500).json({ message });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Chinese Folk Orchestra Hub API running at http://127.0.0.1:${port}`);
});
