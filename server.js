/**
 * StreetClean server.
 *
 * Two jobs:
 *   1. Serve the static front-end (same as before).
 *   2. Expose the trusted API (server/api.js) that's allowed to set
 *      Firebase Auth custom claims and run the payout transaction,
 *      using the Firebase Admin SDK — see server/admin.js.
 *
 * This runs as a plain Node/Express process (Render, Fly.io, Railway,
 * a VPS, your own machine, etc.) so the Firebase project itself never
 * needs to leave the free Spark plan.
 */
const path = require('path');
const express = require('express');
const cors = require('cors');

const apiRouter = require('./server/api');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(express.static(__dirname));

// SPA fallback — anything that isn't /api/* falls back to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`StreetClean live at http://localhost:${PORT}`);
});
