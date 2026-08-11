# StreetClean RBAC — setup

## What changed
- Roles (`resident` / `cleaner` / `verifier` / `admin`) are now Firebase Auth
  **custom claims**, set only by `server/api.js` via the Admin SDK.
- The `role` field on `users/{uid}` in Firestore still exists for display,
  but `firestore.rules` blocks clients from ever writing it — only the
  server (which uses the Admin SDK and bypasses rules) can.
- The old "Quick Switch Persona" buttons are gone. Residents apply to
  become a Cleaner (`POST /api/apply-cleaner`); an admin approves it
  (`POST /api/admin/approve-cleaner`). Verifiers are assigned directly by
  an admin (`POST /api/admin/assign-verifier`) — no application needed.
- Payouts (`verifyProof` → approve) now run through
  `POST /api/verify-and-pay`, a single Firestore transaction on the
  server. The client can no longer touch wallet balances directly.
- This all runs on a plain Node/Express server (`server.js` + `server/`),
  **not Firebase Cloud Functions**, specifically so the Firebase project
  itself can stay on the Spark (free) plan. You'll still need somewhere
  free to host this one Node process (Render/Fly.io/Railway free tier,
  or your own machine while testing).

## One-time setup
1. **Get a service account key**: Firebase console → Project settings →
   Service accounts → Generate new private key. Save it as
   `server/service-account.json` (already in `.gitignore` — never commit it).
2. **Deploy the Firestore rules**: `firebase deploy --only firestore:rules`
   (or paste `firestore.rules` into the console's Rules tab).
3. **Install deps**: `npm install`
4. **Run the server**: `npm start` (serves the site AND the API on the
   same port, so `index.html`'s `fetch('/api/...')` calls just work).
5. **Bootstrap your first admin** — register a normal account through the
   app first, then run:
   ```
   node scripts/set-admin-claim.js you@example.com
   ```
   That user must log out/in (or the app will pick it up automatically
   next time it refreshes the ID token) before the `admin` role is active.

## What's intentionally still local/demo-only
Badges, gear, and gamified stats (`festivalRank`, `hoursContributed`, etc.)
still live in `localStorage` for snappy UI — they're cosmetic and were out
of scope for the security fix. `phpBalance`, `cleanPoints`, and `role` are
now sourced from Firestore/the ID token on every login, so they can't be
edited by tampering with the browser.

The 5 seeded demo commissions (`SC-2026-01..05`) don't have a real
`assignedToUid`, so running them through `verify-and-pay` will correctly
fail with "Assigned cleaner account not found" — that's expected; they're
just cosmetic sample data, not verifiable through the real flow.
