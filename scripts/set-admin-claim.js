/**
 * One-time bootstrap: grant the "admin" role to a user.
 * There's no UI for this on purpose — the very first admin has to be
 * set by someone with access to the service account key, from a
 * trusted machine. After that, admins can promote/approve from the app.
 *
 * Usage:
 *   node scripts/set-admin-claim.js someone@example.com
 */
const { auth } = require('../server/admin');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/set-admin-claim.js <email>');
    process.exit(1);
  }

  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { role: 'admin' });
  console.log(`✅ ${email} (uid: ${user.uid}) is now an admin.`);
  console.log('They must log out and back in (or call getIdToken(true)) for it to take effect.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
