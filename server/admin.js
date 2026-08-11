/**
 * StreetClean — Firebase Admin SDK bootstrap.
 *
 * This runs on YOUR server (not Firebase Cloud Functions), so it stays
 * outside anything Firebase bills for. Firestore/Auth usage still counts
 * against the normal Spark free quotas, same as the client SDK does.
 *
 * Requires a service account key. Get one from:
 *   Firebase console -> Project settings -> Service accounts -> Generate new private key
 *
 * Put the downloaded JSON at server/service-account.json (gitignored),
 * OR set GOOGLE_APPLICATION_CREDENTIALS to its path, e.g.:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
 *
 * NEVER commit the service account file — it grants full admin access to
 * your Firebase project (bypasses every Firestore rule).
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const LOCAL_KEY_PATH = path.join(__dirname, 'service-account.json');

function loadCredential() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Let the Admin SDK pick this up itself.
    return admin.credential.applicationDefault();
  }
  if (fs.existsSync(LOCAL_KEY_PATH)) {
    return admin.credential.cert(require(LOCAL_KEY_PATH));
  }
  throw new Error(
    'No Firebase service account found. Download one from Firebase console ' +
    '(Project settings -> Service accounts) and save it as server/service-account.json, ' +
    'or set the GOOGLE_APPLICATION_CREDENTIALS env var.'
  );
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: loadCredential() });
}

const auth = admin.auth();
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = { admin, auth, db, FieldValue };
