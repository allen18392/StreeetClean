const { auth } = require('./admin');

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>".
// Attaches the decoded token (including custom claims) as req.user.
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: 'Missing bearer token.' });
  }
  try {
    req.user = await auth.verifyIdToken(match[1]);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// Must be used AFTER requireAuth. Checks the ROLE CUSTOM CLAIM on the
// verified token — never trust a role field the client sent in the body.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: `Requires one of roles: ${allowedRoles.join(', ')}.` });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
