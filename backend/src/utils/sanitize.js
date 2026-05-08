const sanitizeHtml = require('sanitize-html');

function clean(value) {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function sanitizeObject(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, clean(v)]));
}

module.exports = { clean, sanitizeObject };
