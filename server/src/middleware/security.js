const rateLimit = require('express-rate-limit');

function applySecurityMiddleware(app) {
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Too many requests. Please try again later.' },
    }),
  );
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
});

module.exports = {
  applySecurityMiddleware,
  loginLimiter,
};
