const crypto = require('crypto');

const TOKEN_VERSION = 'v1';
const IV_LENGTH = 12;

function tokenSecret() {
  return process.env.URL_TOKEN_SECRET || process.env.JWT_SECRET || 'development-only-change-this-secret';
}

function encryptionKey() {
  return crypto.createHash('sha256').update(tokenSecret()).digest();
}

function encryptId(id) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(id), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [TOKEN_VERSION, iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join('.');
}

function decryptId(value) {
  const token = String(value || '').trim();
  if (!token) return null;

  // Keep legacy numeric IDs working for internal API calls and existing bookmarks.
  if (/^\d+$/.test(token)) return Number(token);

  const [version, ivText, tagText, encryptedText] = token.split('.');
  if (version !== TOKEN_VERSION || !ivText || !tagText || !encryptedText) return null;

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivText, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagText, 'base64url'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'base64url')),
      decipher.final(),
    ]).toString('utf8');

    return /^\d+$/.test(decrypted) ? Number(decrypted) : null;
  } catch (_error) {
    return null;
  }
}

module.exports = {
  decryptId,
  encryptId,
};
