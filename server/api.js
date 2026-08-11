const express = require('express');
const { auth, db, FieldValue } = require('./admin');
const { requireAuth, requireRole } = require('./middleware');

const router = express.Router();

const ROLE_TITLES = {
  resident: 'Civic Guardian & Festival Reporter',
  cleaner: 'Ibalong Eco-Warrior & Clean Specialist',
  verifier: 'Official LGU Festival Marshall',
  admin: 'StreetClean Administrator'
};

/* ------------------------------------------------------------------ *
 * POST /api/register
 * Called right after a client finishes Firebase Auth sign-up.
 * Every new account is a RESIDENT — this is the only place a role is
 * ever granted without a human approving it, and it can only ever
 * grant "resident", nothing higher. Idempotent: safe to call again.
 * ------------------------------------------------------------------ */
router.post('/register', requireAuth, async (req, res) => {
  const uid = req.user.uid;
  const existing = await auth.getUser(uid);

  if (!existing.customClaims || !existing.customClaims.role) {
    await auth.setCustomUserClaims(uid, { role: 'resident' });
  }

  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) {
    const { name, barangay, avatar, phone, payoutProvider, payoutAccount } = req.body || {};
    await userRef.set({
      id: uid,
      name: name || existing.displayName || 'New Member',
      email: existing.email,
      role: 'resident', // display-only copy; NEVER used for authorization
      roleTitle: ROLE_TITLES.resident,
      barangay: barangay || 'Barangay Albay District, Legazpi City',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      phone: phone || '0917-000-0000',
      payoutProvider: payoutProvider || 'GCash',
      payoutAccount: payoutAccount || phone || '0917-000-0000',
      phpBalance: 500.0,
      cleanPoints: 250,
      stakedPoints: 0,
      escrowLockedPhp: 0.0,
      createdAt: FieldValue.serverTimestamp()
    });
  }

  res.json({ ok: true, role: 'resident' });
});

/* ------------------------------------------------------------------ *
 * POST /api/apply-cleaner
 * A resident applies to become a cleaner. This NEVER grants the role
 * itself — it just files an application for an admin to review.
 * ------------------------------------------------------------------ */
router.post('/apply-cleaner', requireAuth, async (req, res) => {
  const uid = req.user.uid;
  if (req.user.role === 'cleaner' || req.user.role === 'verifier' || req.user.role === 'admin') {
    return res.status(400).json({ error: 'You already have an elevated role.' });
  }

  const appRef = db.collection('cleanerApplications').doc(uid);
  const existing = await appRef.get();
  if (existing.exists && existing.data().status === 'pending') {
    return res.status(400).json({ error: 'You already have a pending application.' });
  }

  await appRef.set({
    uid,
    status: 'pending',
    note: (req.body && req.body.note) || '',
    submittedAt: FieldValue.serverTimestamp()
  });

  res.json({ ok: true, status: 'pending' });
});

/* ------------------------------------------------------------------ *
 * GET /api/my-application
 * ------------------------------------------------------------------ */
router.get('/my-application', requireAuth, async (req, res) => {
  const snap = await db.collection('cleanerApplications').doc(req.user.uid).get();
  res.json({ application: snap.exists ? snap.data() : null });
});

/* ------------------------------------------------------------------ *
 * POST /api/admin/approve-cleaner   { uid }
 * Admin-only. This is the ONLY code path that can grant "cleaner".
 * ------------------------------------------------------------------ */
router.post('/admin/approve-cleaner', requireAuth, requireRole('admin'), async (req, res) => {
  const { uid } = req.body || {};
  if (!uid) return res.status(400).json({ error: 'uid is required.' });

  await auth.setCustomUserClaims(uid, { role: 'cleaner' });
  await db.collection('users').doc(uid).update({
    role: 'cleaner',
    roleTitle: ROLE_TITLES.cleaner
  });
  await db.collection('cleanerApplications').doc(uid).set(
    { status: 'approved', decidedAt: FieldValue.serverTimestamp(), decidedBy: req.user.uid },
    { merge: true }
  );

  res.json({ ok: true });
});

router.post('/admin/reject-cleaner', requireAuth, requireRole('admin'), async (req, res) => {
  const { uid, notes } = req.body || {};
  if (!uid) return res.status(400).json({ error: 'uid is required.' });

  await db.collection('cleanerApplications').doc(uid).set(
    { status: 'rejected', notes: notes || '', decidedAt: FieldValue.serverTimestamp(), decidedBy: req.user.uid },
    { merge: true }
  );

  res.json({ ok: true });
});

/* ------------------------------------------------------------------ *
 * POST /api/admin/assign-verifier   { uid }
 * Admin-only, invite/assignment style — no application flow needed.
 * ------------------------------------------------------------------ */
router.post('/admin/assign-verifier', requireAuth, requireRole('admin'), async (req, res) => {
  const { uid } = req.body || {};
  if (!uid) return res.status(400).json({ error: 'uid is required.' });

  await auth.setCustomUserClaims(uid, { role: 'verifier' });
  await db.collection('users').doc(uid).update({
    role: 'verifier',
    roleTitle: ROLE_TITLES.verifier
  });

  res.json({ ok: true });
});

/* ------------------------------------------------------------------ *
 * POST /api/verify-and-pay   { commissionId, approved, notes }
 * Verifier-only. The whole payout runs server-side inside one Firestore
 * transaction, so a commission can never be paid out twice and the
 * client never has direct write access to wallet balances.
 * ------------------------------------------------------------------ */
router.post('/verify-and-pay', requireAuth, requireRole('verifier'), async (req, res) => {
  const { commissionId, approved, notes } = req.body || {};
  if (!commissionId) return res.status(400).json({ error: 'commissionId is required.' });

  try {
    const result = await db.runTransaction(async (tx) => {
      const commRef = db.collection('commissions').doc(commissionId);
      const commSnap = await tx.get(commRef);
      if (!commSnap.exists) throw new Error('Commission not found.');
      const comm = commSnap.data();

      if (comm.status !== 'in_review') {
        throw new Error(`Commission is not awaiting verification (status: ${comm.status}).`);
      }

      if (!approved) {
        tx.update(commRef, {
          status: 'in_progress',
          imageAfter: null,
          rejectNotes: notes || 'Litter residue still visible in background. Please re-sweep.'
        });
        return { status: 'in_progress' };
      }

      const cleanerRef = db.collection('users').doc(comm.assignedToUid);
      const cleanerSnap = await tx.get(cleanerRef);
      if (!cleanerSnap.exists) throw new Error('Assigned cleaner account not found.');
      const cleaner = cleanerSnap.data();

      tx.update(commRef, { status: 'completed', votes: { approve: 3, reject: 0 } });

      tx.update(cleanerRef, {
        phpBalance: (cleaner.phpBalance || 0) + comm.rewardPhp,
        cleanPoints: (cleaner.cleanPoints || 0) + comm.cleanPoints,
        'stats.completedCleans': FieldValue.increment(1),
        'stats.kgRecycled': FieldValue.increment(comm.proofData ? comm.proofData.weightRecordedKg : comm.estimatedWeightKg)
      });

      const txRef = db.collection('transactions').doc();
      tx.set(txRef, {
        id: txRef.id,
        type: 'bounty_payout',
        title: `Bounty Payout: ${comm.title}`,
        reference: comm.id,
        userId: comm.assignedToUid,
        amountPhp: comm.rewardPhp,
        points: comm.cleanPoints,
        status: 'completed',
        channel: 'GCash Instant Payout (LGU Escrow)',
        verifiedBy: req.user.uid,
        createdAt: FieldValue.serverTimestamp()
      });

      return { status: 'completed' };
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
