# StreetClean Firebase Data Setup

StreetClean now uses Firebase for application data.

## Firebase services used

- Firebase Authentication: registration, login, logout and session identity.
- Cloud Firestore:
  - `users/{uid}` — profile, wallet balance, points, role and impact stats.
  - `reports/{reportId}` — community reports, cleanup assignments and proof/verification data.
  - `users/{uid}/transactions/{transactionId}` — wallet pledges, payouts and withdrawals.
- Firebase Storage is not required by the current MVP. Report photos continue to use the existing image URLs/presets.

## Firestore rules

The included `firestore.rules` requires Firebase Authentication for every read/write. It is intentionally permissive for this prototype so the client-side verifier flow can update reports and cleaner payouts.

Before production, replace these rules with role/field-level authorization and server-side payout logic.

## Important

The app no longer uses `localStorage` for StreetClean profiles, reports, transactions, wallet balances, or active accounts. Clearing browser storage will not delete Firestore data.

Deploy `firestore.rules` in the Firebase console (Firestore Database -> Rules) before testing the app on a new browser/device.
