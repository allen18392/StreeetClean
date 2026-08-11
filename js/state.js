/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Central Reactive State Engine
 * Supports Multiple Real User Accounts, Registration, Login & Role Switching.
 *
 * PATCHED: registerUser() and loginUser() now verify against real Firebase
 * Auth instead of a plaintext password check. Everything else (rich local
 * profiles, badges, stats, wallet, role-switcher) is untouched.
 * Requires: firebase-app-compat.js, firebase-auth-compat.js, and
 * js/firebase-config.js loaded BEFORE this file in index.html.
 */

const DEFAULT_ACCOUNTS = {};

const DEFAULT_FESTIVAL_HOTSPOTS = [
  {
    id: 'SC-2026-01',
    title: 'Peñaranda Park Grandstand Plastic & Confetti Pile',
    sector: 'Peñaranda Park & Provincial Capitol Grounds',
    address: 'Rizal St, Old Albay District, Legazpi City',
    lat: 13.1398,
    lng: 123.7345,
    distanceKm: '0.3 km from Capitol',
    category: 'Plastics & Banners',
    severity: 'critical',
    rewardPhp: 850.00,
    cleanPoints: 1400,
    estimatedWeightKg: 45,
    deadline: '6 hours left (Before Evening Street Dance)',
    status: 'open',
    reportedBy: 'Juan Santos',
    reportedAt: '1 hour ago',
    sponsor: 'Legazpi City Tourism & Clean Fund',
    imageBefore: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    imageAfter: null,
    description: 'Large pile of single-use water bottles, plastic cups, and shredded parade banners accumulated near the main festival grandstand stage after the morning drum & lyre competition.',
    votes: { approve: 0, reject: 0 }
  },
  {
    id: 'SC-2026-02',
    title: 'Legazpi Boulevard Street Food Bamboo Skewers & Cups',
    sector: 'Legazpi Boulevard Seaside Promenade',
    address: 'Baywalk Way, Puro District, Legazpi City',
    lat: 13.1285,
    lng: 123.7530,
    distanceKm: '1.2 km from Port',
    category: 'Food Waste & Skewers',
    severity: 'high',
    rewardPhp: 650.00,
    cleanPoints: 950,
    estimatedWeightKg: 30,
    deadline: '12 hours left',
    status: 'open',
    reportedBy: 'Barangay Puro Watch',
    reportedAt: '2 hours ago',
    sponsor: 'Ibalong Food Strip Association',
    imageBefore: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    imageAfter: null,
    description: 'Discarded barbecue bamboo skewers, plastic sauce cups, and beverage cans scattered across the seaside seawall walkway. Needs sorting into biodegradable and recyclable bins.',
    votes: { approve: 0, reject: 0 }
  },
  {
    id: 'SC-2026-03',
    title: 'Albay Astrodome Night Concert Arena Debris',
    sector: 'Albay Astrodome Complex',
    address: 'F. Imperial St, Barangay Bitano, Legazpi City',
    lat: 13.1465,
    lng: 123.7410,
    distanceKm: '0.8 km from City Center',
    category: 'Festival Paraphernalia',
    severity: 'high',
    rewardPhp: 1200.00,
    cleanPoints: 1800,
    estimatedWeightKg: 65,
    deadline: 'In Progress',
    status: 'in_progress',
    assignedTo: 'Maria Bataller',
    reportedBy: 'Albay Cultural Office',
    reportedAt: '5 hours ago',
    sponsor: 'Governor & City Mayor Youth Fund',
    imageBefore: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    imageAfter: null,
    description: 'Takeout food boxes, festival glowsticks, and cardboard festival masks left around the eastern parking gates.',
    votes: { approve: 0, reject: 0 }
  },
  {
    id: 'SC-2026-04',
    title: 'Embarcadero de Legazpi Boardwalk Waterline Cleanup',
    sector: 'Embarcadero Harbor & Port Terminal',
    address: 'Legazpi Port District, Legazpi City',
    lat: 13.1430,
    lng: 123.7555,
    distanceKm: '1.5 km from City Hall',
    category: 'Waterway & Coastal Plastics',
    severity: 'critical',
    rewardPhp: 950.00,
    cleanPoints: 1500,
    estimatedWeightKg: 50,
    deadline: 'Under Review by Verifier',
    status: 'in_review',
    assignedTo: 'Maria Bataller',
    reportedBy: 'Harbor Coast Guard Aux',
    reportedAt: '1 day ago',
    sponsor: 'Legazpi Port Clean Waterways',
    imageBefore: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Driftwood mixed with soda bottles and snack wrappers caught in the rocky riprap along Embarcadero pier.',
    proofData: {
      weightRecordedKg: 52,
      facilityManifestId: 'LGU-MRF-2026-088',
      exifGpsMatch: 99.8,
      aiCleanlinessScore: 99.4,
      submittedAt: '45 mins ago',
      cleanerNotes: 'Completely cleared 52kg of plastics and debris. Delivered directly to Legazpi City MRF facility.'
    },
    votes: { approve: 1, reject: 0 }
  },
  {
    id: 'SC-2026-05',
    title: 'Sawangan Park & Mayon View Deck Pavilion',
    sector: 'Sawangan Park Heritage Grounds',
    address: 'South Boulevard, Legazpi City',
    lat: 13.1320,
    lng: 123.7510,
    distanceKm: '1.1 km from Boulevard',
    category: 'Organic & Recyclable Mix',
    severity: 'medium',
    rewardPhp: 450.00,
    cleanPoints: 700,
    estimatedWeightKg: 25,
    deadline: 'Completed & Verified',
    status: 'completed',
    assignedTo: 'Maria Bataller',
    reportedBy: 'Bicol Heritage Club',
    reportedAt: '2 days ago',
    sponsor: 'Civic Pride Alliance Legazpi',
    imageBefore: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'Litter around benches facing Mount Mayon view.',
    proofData: {
      weightRecordedKg: 28,
      facilityManifestId: 'LGU-MRF-2026-041',
      exifGpsMatch: 100,
      aiCleanlinessScore: 99.8,
      submittedAt: '1 day ago',
      cleanerNotes: 'Pristine state restored, all bins emptied.'
    },
    votes: { approve: 3, reject: 0 }
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 'TX-PH-9921',
    type: 'bounty_payout',
    title: 'Bounty Reward: Sawangan Park Cleanup',
    reference: 'SC-2026-05',
    amountPhp: 450.00,
    points: 700,
    status: 'completed',
    date: 'Aug 11, 2026',
    time: '11:30 AM',
    channel: 'GCash Instant Payout'
  },
  {
    id: 'TX-PH-9840',
    type: 'bounty_payout',
    title: 'Bounty Reward: Ibalong Street Dance Zone 1',
    reference: 'SC-2026-00',
    amountPhp: 1200.00,
    points: 1800,
    status: 'completed',
    date: 'Aug 10, 2026',
    time: '04:15 PM',
    channel: 'GCash Instant Payout'
  },
  {
    id: 'TX-PH-9710',
    type: 'withdrawal',
    title: 'GCash Cashout to 0928-551-3941',
    reference: 'WD-GCASH-88',
    amountPhp: -2000.00,
    points: 0,
    status: 'completed',
    date: 'Aug 09, 2026',
    time: '07:00 PM',
    channel: 'GCash'
  }
];

// ---------- Firebase error -> friendly message ----------
// (new helper — used by the patched registerUser/loginUser below)
function humanizeFirebaseError(err) {
  const map = {
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/invalid-email': "That doesn't look like a valid email address.",
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.'
  };
  return map[err.code] || err.message;
}

// ---------- Trusted backend calls (server/api.js) ----------
// Every call sends the CURRENT Firebase ID token. The server re-verifies
// it and re-checks the role custom claim itself — it never trusts
// anything else in the request body for authorization decisions.
async function callApi(path, { method = 'POST', body } = {}) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not signed in.');
  const idToken = await currentUser.getIdToken();

  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

class StateManager {
  constructor() {
    this.listeners = {};
    this.currentUserId = localStorage.getItem('streetclean_active_user_id') || 'usr_cleaner_01';
    this.initData();
  }

  initData() {
    const savedCommissions = localStorage.getItem('streetclean_commissions_v3');
    this.commissions = savedCommissions ? JSON.parse(savedCommissions) : DEFAULT_FESTIVAL_HOTSPOTS;

    const savedUsers = localStorage.getItem('streetclean_users_v3');
    this.users = savedUsers ? JSON.parse(savedUsers) : DEFAULT_ACCOUNTS;

    // Ensure current active user exists
    if (!this.users[this.currentUserId]) {
      this.currentUserId = Object.keys(this.users)[0] || 'usr_cleaner_01';
    }

    const savedTx = localStorage.getItem('streetclean_transactions_v3');
    this.transactions = savedTx ? JSON.parse(savedTx) : DEFAULT_TRANSACTIONS;
  }

  save() {
    localStorage.setItem('streetclean_commissions_v3', JSON.stringify(this.commissions));
    localStorage.setItem('streetclean_users_v3', JSON.stringify(this.users));
    localStorage.setItem('streetclean_transactions_v3', JSON.stringify(this.transactions));
    localStorage.setItem('streetclean_active_user_id', this.currentUserId);
  }

  // Get active logged-in user (returns null if logged out — do NOT fall
  // back to a random stored account, or the auth gate in app.js will think
  // someone is still logged in after they've signed out)
  getUser() {
    if (!this.currentUserId) return null;
    return this.users[this.currentUserId] || null;
  }

  // Get all registered accounts list
  getAllUsersList() {
    return Object.values(this.users);
  }

  // ---------- Register a brand new REAL account via Firebase Auth ----------
  // Role is intentionally NOT accepted from the caller here. Every new
  // account is a "resident" — that's decided server-side in
  // POST /api/register, which is the only place a role claim gets set
  // without a human (admin) approving it.
  async registerUser(data) {
    const email = data.email.trim().toLowerCase();

    let cred;
    try {
      cred = await auth.createUserWithEmailAndPassword(email, data.password);
    } catch (err) {
      return { success: false, message: humanizeFirebaseError(err) };
    }

    const uid = cred.user.uid;
    await cred.user.updateProfile({ displayName: data.name.trim() });

    try {
      await callApi('/register', {
        body: {
          name: data.name.trim(),
          barangay: data.barangay,
          avatar: data.avatar,
          phone: data.phone,
          payoutProvider: data.payoutProvider,
          payoutAccount: data.payoutAccount
        }
      });
    } catch (err) {
      return { success: false, message: `Account created but profile setup failed: ${err.message}` };
    }

    const user = await this._loadUserSession(uid, { badgeLevel: `${data.barangay ? data.barangay.split(',')[0] : 'Legazpi'} Active Member` });
    return { success: true, user };
  }

  // ---------- Log in with a REAL Firebase credential check ----------
  async loginUser(identifier, password) {
    const email = identifier.trim().toLowerCase();

    let cred;
    try {
      cred = await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      return { success: false, message: humanizeFirebaseError(err) };
    }

    const user = await this._loadUserSession(cred.user.uid);
    return { success: true, user };
  }

  // Builds the local session for uid from the AUTHORITATIVE sources:
  // the ID token's role claim (never the Firestore doc, never localStorage)
  // plus the Firestore users/{uid} doc for display data.
  async _loadUserSession(uid, defaults = {}) {
    // force=true so a role just granted by /api/register or an admin
    // action shows up immediately instead of the stale cached token.
    const tokenResult = await auth.currentUser.getIdTokenResult(true);
    let role = tokenResult.claims.role;

    if (!role) {
      // Legacy session with no claim yet (e.g. account created before this
      // backend existed) — backfill it as a resident via the server.
      await callApi('/register', { body: {} });
      const refreshed = await auth.currentUser.getIdTokenResult(true);
      role = refreshed.claims.role || 'resident';
    }

    let profile = {};
    try {
      const doc = await firestore.collection('users').doc(uid).get();
      if (doc.exists) profile = doc.data();
    } catch (err) {
      console.warn('Could not load Firestore profile, using local cache/defaults.', err);
    }

    const cached = this.users[uid] || {};
    const user = {
      // Cosmetic/local-only fields carry over between sessions on this
      // browser; nothing security-relevant is sourced from here.
      stats: { completedCleans: 0, kgRecycled: 0, verificationRate: 100.0, festivalRank: 'New Eco-Warrior', hoursContributed: 0 },
      badges: [{ id: 'b_new', name: 'Ibalong Pioneer', desc: 'Registered for 2026 Festival Cleanup', icon: 'fa-star', color: 'gold' }],
      gear: ['Basic Sanitation Gloves', 'Biodegradable Segregation Bags'],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      ...cached,
      ...defaults,
      ...profile,
      id: uid,
      // role ALWAYS comes from the verified custom claim, overriding
      // anything cached locally or read from Firestore display data.
      role,
      roleTitle: this._roleTitle(role)
    };

    this.users[uid] = user;
    this.currentUserId = uid;
    this.save();
    this.emit('userChanged', user);
    this.emit('stateChanged');
    return user;
  }

  _roleTitle(role) {
    return {
      resident: 'Civic Guardian & Festival Reporter',
      cleaner: 'Ibalong Eco-Warrior & Clean Specialist',
      verifier: 'Official LGU Festival Marshall',
      admin: 'StreetClean Administrator'
    }[role] || 'Civic Participant';
  }

  // Switch to an existing account by ID (local multi-account testing only —
  // does not change which Firebase Auth session is active).
  switchUser(userId) {
    if (this.users[userId]) {
      this.currentUserId = userId;
      this.save();
      this.emit('userChanged', this.users[userId]);
      this.emit('stateChanged');
      return true;
    }
    return false;
  }

  // ---------- Cleaner role: apply, don't self-grant ----------
  // Files an application for an admin to review. Never changes the
  // caller's own role or permissions on its own.
  async applyForCleanerRole(note = '') {
    const data = await callApi('/apply-cleaner', { body: { note } });
    const user = this.getUser();
    if (user) {
      user.cleanerApplicationStatus = data.status;
      this.save();
      this.emit('stateChanged');
    }
    return data;
  }

  async getMyApplicationStatus() {
    return callApi('/my-application', { method: 'GET' });
  }

  // ---------- Admin-only role management ----------
  // The server re-checks the caller's role claim on every one of these —
  // these client methods are a convenience, not the security boundary.
  async adminApproveCleaner(uid) {
    return callApi('/admin/approve-cleaner', { body: { uid } });
  }

  async adminRejectCleaner(uid, notes = '') {
    return callApi('/admin/reject-cleaner', { body: { uid, notes } });
  }

  async adminAssignVerifier(uid) {
    return callApi('/admin/assign-verifier', { body: { uid } });
  }

  getCommissions(filter = 'all') {
    if (filter === 'all') return this.commissions;
    if (filter === 'open') return this.commissions.filter(c => c.status === 'open');
    if (filter === 'in_progress' || filter === 'claimed') return this.commissions.filter(c => c.status === 'in_progress');
    if (filter === 'in_review') return this.commissions.filter(c => c.status === 'in_review');
    if (filter === 'completed') return this.commissions.filter(c => c.status === 'completed');
    return this.commissions;
  }

  getCommissionById(id) {
    return this.commissions.find(c => c.id === id);
  }

  getTransactions() {
    return this.transactions;
  }

  // Create new incident report in Legazpi City
  addReport(reportData) {
    const newId = `SC-2026-${Math.floor(10 + Math.random() * 90)}`;
    const user = this.getUser();

    const newCommission = {
      id: newId,
      title: reportData.title || 'Festival Litter Hotspot',
      sector: reportData.sector || 'Peñaranda Park Stage Area',
      address: reportData.address || 'Legazpi City Festival Zone',
      lat: parseFloat(reportData.lat) || 13.1398,
      lng: parseFloat(reportData.lng) || 123.7345,
      distanceKm: '0.4 km from Peñaranda Park',
      category: reportData.category || 'Plastics & Beverage Cups',
      severity: reportData.severity || 'high',
      rewardPhp: parseFloat(reportData.rewardPhp) || 500.00,
      cleanPoints: Math.round((parseFloat(reportData.rewardPhp) || 500) * 1.6),
      estimatedWeightKg: parseInt(reportData.estimatedWeightKg) || 25,
      deadline: '8 hours left',
      status: 'open',
      reportedBy: user.name,
      reportedAt: 'Just now',
      sponsor: reportData.fundingSource === 'wallet' ? `${user.name} (Resident Pledged)` : 'Ibalong 2026 Civic Clean Fund',
      imageBefore: reportData.imageUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      imageAfter: null,
      description: reportData.description || 'Reported litter hotspot during Ibalong Festival festivities.',
      votes: { approve: 0, reject: 0 }
    };

    this.commissions.unshift(newCommission);

    // If resident pledged from wallet
    if (reportData.fundingSource === 'wallet' && user.phpBalance >= newCommission.rewardPhp) {
      user.phpBalance -= newCommission.rewardPhp;
      user.escrowLockedPhp += newCommission.rewardPhp;
      this.transactions.unshift({
        id: `TX-PH-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'bounty_pledge',
        title: `Pledge: ${newCommission.title}`,
        reference: newCommission.id,
        amountPhp: -newCommission.rewardPhp,
        points: 50,
        status: 'completed',
        date: 'Today',
        time: 'Just now',
        channel: 'Resident Civic Wallet'
      });
    }

    this.save();
    this.emit('commissionAdded', newCommission);
    this.emit('stateChanged');
    return newCommission;
  }

  // Claim commission (Cleaner Flow)
  claimCommission(id) {
    const comm = this.getCommissionById(id);
    const user = this.getUser();

    if (comm && comm.status === 'open') {
      comm.status = 'in_progress';
      comm.assignedTo = user.name;
      comm.assignedToUid = user.id;
      this.save();
      this.emit('commissionClaimed', comm);
      this.emit('stateChanged');
      return true;
    }
    return false;
  }

  // Submit Proof of Work (Cleaner Flow)
  submitProof(id, proof) {
    const comm = this.getCommissionById(id);
    if (comm) {
      comm.status = 'in_review';
      comm.imageAfter = proof.imageAfter || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
      comm.proofData = {
        weightRecordedKg: parseInt(proof.weightKg) || comm.estimatedWeightKg,
        facilityManifestId: proof.manifestId || `LGU-MRF-2026-${Math.floor(100 + Math.random() * 900)}`,
        exifGpsMatch: 99.8,
        aiCleanlinessScore: 99.2,
        submittedAt: 'Just now',
        cleanerNotes: proof.notes || 'Thoroughly cleaned and verified waste delivered to Legazpi MRF.'
      };
      comm.votes = { approve: 1, reject: 0 };
      this.save();
      this.emit('proofSubmitted', comm);
      this.emit('stateChanged');
      return true;
    }
    return false;
  }

  // Verify and Approve Proof of Work (Verifier Flow).
  // The payout itself is NOT computed here — it runs server-side in a
  // Firestore transaction (POST /api/verify-and-pay), which is the only
  // code path allowed to move wallet balances. This just mirrors the
  // result into local state for immediate UI feedback and throws on
  // failure so the caller can show an error instead of silently no-op'ing.
  async verifyProof(id, approved = true, notes = '') {
    const comm = this.getCommissionById(id);
    if (!comm) throw new Error('Commission not found.');

    const result = await callApi('/verify-and-pay', {
      body: { commissionId: id, approved, notes }
    });

    if (approved) {
      comm.status = 'completed';
      comm.votes.approve = 3;

      const assignedCleaner = comm.assignedToUid ? this.users[comm.assignedToUid] : null;
      if (assignedCleaner) {
        assignedCleaner.phpBalance = (assignedCleaner.phpBalance || 0) + comm.rewardPhp;
        assignedCleaner.cleanPoints = (assignedCleaner.cleanPoints || 0) + comm.cleanPoints;
        assignedCleaner.stats.completedCleans += 1;
        assignedCleaner.stats.kgRecycled += (comm.proofData ? comm.proofData.weightRecordedKg : comm.estimatedWeightKg);
      }

      this.transactions.unshift({
        id: `TX-PH-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'bounty_payout',
        title: `Bounty Payout: ${comm.title}`,
        reference: comm.id,
        amountPhp: comm.rewardPhp,
        points: comm.cleanPoints,
        status: 'completed',
        date: 'Today',
        time: 'Just now',
        channel: 'GCash Instant Payout (LGU Escrow)'
      });

      this.save();
      this.emit('proofApproved', comm);
    } else {
      comm.status = 'in_progress';
      comm.imageAfter = null;
      comm.rejectNotes = notes || 'Litter residue still visible in background. Please re-sweep.';
      this.save();
      this.emit('proofRejected', comm);
    }

    this.emit('stateChanged');
    return result;
  }

  // Cashout via GCash or Maya
  withdraw(amount, provider = 'GCash', account = '0928-551-3941') {
    const user = this.getUser();
    amount = parseFloat(amount);
    if (amount > 0 && user.phpBalance >= amount) {
      user.phpBalance -= amount;
      this.transactions.unshift({
        id: `TX-PH-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'withdrawal',
        title: `${provider} Instant Cashout to ${account}`,
        reference: `WD-${provider.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        amountPhp: -amount,
        points: 0,
        status: 'completed',
        date: 'Today',
        time: 'Just now',
        channel: provider
      });
      this.save();
      this.emit('stateChanged');
      return true;
    }
    return false;
  }

  // Event Pub/Sub
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

window.appState = new StateManager();