/**
 * StreetClean | Firebase-backed application state
 * (Simplified for demo/presentation reliability.)
 *
 * Firebase Authentication owns identity/session.
 * Firestore owns profiles, reports and transactions.
 * No application data is stored in localStorage.
 *
 * Design rule for this rewrite: a successful sign-in must always land the
 * user on the dashboard. Loading the user's OWN profile is the only thing
 * allowed to block login. Everything else (leaderboard, reports feed,
 * transaction history) loads in parallel afterward and fails silently
 * (with a toast) if Firestore hiccups, instead of taking the whole app down.
 */

function humanizeFirebaseError(err) {
  const map = {
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/invalid-email': "That doesn't look like a valid email address.",
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'permission-denied': 'Firebase denied that request. Check your Firestore rules.'
  };
  return map[err.code] || err.message || 'Firebase request failed.';
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';

function makeUserProfile(uid, data = {}) {
  const role = data.role || 'cleaner';
  const roleTitles = {
    resident: 'Civic Guardian & Festival Reporter',
    cleaner: 'Ibalong Eco-Warrior & Clean Specialist',
    verifier: 'Official LGU Festival Marshall'
  };

  return {
    id: uid,
    name: (data.name || 'StreetClean Member').trim(),
    email: (data.email || '').toLowerCase(),
    role,
    roleTitle: data.roleTitle || roleTitles[role] || 'Civic Participant',
    badgeLevel: data.badgeLevel || `${data.barangay ? data.barangay.split(',')[0] : 'Legazpi'} Active Member`,
    barangay: data.barangay || '',
    avatar: data.avatar || DEFAULT_AVATAR,
    phone: data.phone || '',
    payoutProvider: data.payoutProvider || '',
    payoutAccount: data.payoutAccount || data.phone || '',
    phpBalance: Number(data.phpBalance || 0),
    cleanPoints: Number(data.cleanPoints || 0),
    stakedPoints: Number(data.stakedPoints || 0),
    createdAt: data.createdAt || null,
    stats: {
      completedCleans: Number(data.stats?.completedCleans || 0),
      kgRecycled: Number(data.stats?.kgRecycled || 0),
      verificationRate: Number(data.stats?.verificationRate ?? 100),
      festivalRank: data.stats?.festivalRank || 'New Eco-Warrior',
      hoursContributed: Number(data.stats?.hoursContributed || 0)
    },
    badges: Array.isArray(data.badges) ? data.badges : [],
    gear: Array.isArray(data.gear) ? data.gear : []
  };
}

class StateManager {
  constructor() {
    this.listeners = {};
    this.currentUserId = null;
    this.users = {};
    this.commissions = [];
    this.transactions = [];
    this.ready = false;
  }

  // ---- Boot / session -----------------------------------------------

  async initializeForFirebaseUser(firebaseUser) {
    if (!firebaseUser) {
      this.currentUserId = null;
      this.users = {};
      this.commissions = [];
      this.transactions = [];
      this.ready = true;
      this.emit('userChanged', null);
      this.emit('stateChanged');
      return;
    }

    this.currentUserId = firebaseUser.uid;

    // Step 1 (blocking): load or create the signed-in user's own profile.
    // This is the ONLY step allowed to fail the login.
    const user = await this._loadOrCreateOwnProfile(firebaseUser);
    this.users[user.id] = user;
    this.ready = true;
    this.emit('userChanged', user);
    this.emit('stateChanged');

    // Step 2 (non-blocking): everything else, in parallel. Any of these
    // can fail without affecting the fact that the user is already signed
    // in and looking at the dashboard.
    this._loadSupplementaryData(firebaseUser.uid);
  }

  async _loadOrCreateOwnProfile(firebaseUser) {
    try {
      const profileRef = firestore.collection('users').doc(firebaseUser.uid);
      const profileSnap = await profileRef.get();

      if (profileSnap.exists) {
        return makeUserProfile(firebaseUser.uid, profileSnap.data());
      }

      const user = makeUserProfile(firebaseUser.uid, {
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email
      });
      await profileRef.set({
        ...user,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return user;
    } catch (err) {
      // Even if Firestore is completely unreachable/misconfigured, don't
      // block the demo: fall back to a client-only profile built from the
      // Firebase Auth record so the app is still usable.
      console.error('Profile load/create failed, using local fallback:', err.code || err.message || err);
      window.showToast?.(`Signed in, but profile sync failed (${err.code || 'unknown error'}). Running in limited mode.`, 'error');
      return makeUserProfile(firebaseUser.uid, {
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email
      });
    }
  }

  async _loadSupplementaryData(uid) {
    const [usersResult, reportsResult, txResult] = await Promise.allSettled([
      firestore.collection('users').get(),
      firestore.collection('reports').get(),
      firestore.collection('users').doc(uid).collection('transactions').get()
    ]);

    if (usersResult.status === 'fulfilled') {
      usersResult.value.forEach(doc => {
        this.users[doc.id] = makeUserProfile(doc.id, doc.data());
      });
    } else {
      console.error('Leaderboard/users list failed to load:', usersResult.reason?.code || usersResult.reason);
    }

    if (reportsResult.status === 'fulfilled') {
      this.commissions = reportsResult.value.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } else {
      console.error('Reports feed failed to load:', reportsResult.reason?.code || reportsResult.reason);
    }

    if (txResult.status === 'fulfilled') {
      this.transactions = txResult.value.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } else {
      console.error('Transaction history failed to load:', txResult.reason?.code || txResult.reason);
    }

    this.emit('stateChanged');
  }

  async save() {
    const user = this.getUser();
    if (user) await this.persistUser(user);
  }

  async persistUser(user) {
    if (!user?.id) return;
    try {
      await firestore.collection('users').doc(user.id).set(
        { ...user, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error('Could not persist user:', err.code || err.message || err);
      window.showToast?.('Could not save changes to Firebase.', 'error');
    }
  }

  getUser() {
    if (!this.currentUserId) return null;
    return this.users[this.currentUserId] || null;
  }

  getAllUsersList() {
    return Object.values(this.users);
  }

  // ---- Auth -----------------------------------------------------------

  async registerUser(data) {
    const email = data.email.trim().toLowerCase();

    let cred;
    try {
      cred = await auth.createUserWithEmailAndPassword(email, data.password);
      await cred.user.updateProfile({ displayName: data.name.trim() });
    } catch (err) {
      return { success: false, message: humanizeFirebaseError(err) };
    }

    const user = makeUserProfile(cred.user.uid, {
      name: data.name,
      email,
      role: data.role || 'cleaner',
      barangay: data.barangay,
      phone: data.phone,
      avatar: data.avatar
    });

    // Best-effort profile write. If it fails, the account still exists in
    // Firebase Auth and onAuthStateChanged will retry building a profile
    // on next load — don't sign the user back out over a demo hiccup.
    try {
      await firestore.collection('users').doc(user.id).set({
        ...user,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      console.error('Profile write on register failed:', err.code || err.message || err);
      window.showToast?.(`Account created, but profile sync failed (${err.code || 'unknown error'}).`, 'error');
    }

    this.currentUserId = user.id;
    this.users[user.id] = user;
    this.transactions = [];
    this.ready = true;
    this.emit('userChanged', user);
    this.emit('stateChanged');
    return { success: true, user };
  }

  async loginUser(identifier, password) {
    const email = identifier.trim().toLowerCase();

    let cred;
    try {
      cred = await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      return { success: false, message: humanizeFirebaseError(err) };
    }

    // app.js's onAuthStateChanged listener calls initializeForFirebaseUser,
    // which is what actually loads the profile/data. We just report success
    // here so the UI can navigate immediately.
    return {
      success: true,
      user: this.getUser() || makeUserProfile(cred.user.uid, {
        name: cred.user.displayName || email.split('@')[0],
        email
      })
    };
  }

  // ---- Everything below is unchanged from before ----------------------

  async setUserRole(roleKey) {
    const user = this.getUser();
    if (!user || !['resident', 'cleaner', 'verifier'].includes(roleKey)) return;

    const roleTitles = {
      resident: 'Civic Guardian & Festival Reporter',
      cleaner: 'Ibalong Eco-Warrior & Clean Specialist',
      verifier: 'Official LGU Festival Marshall'
    };

    user.role = roleKey;
    user.roleTitle = roleTitles[roleKey];
    this.users[user.id] = user;

    try {
      await this.persistUser(user);
      this.emit('userChanged', user);
      this.emit('stateChanged');
    } catch (err) {
      console.error('Could not save role:', err);
    }
  }

  getRewardType(comm) {
    if (comm?.rewardType === 'points' || comm?.rewardType === 'money') return comm.rewardType;
    if (Number(comm?.rewardPhp || 0) > 0) return 'money';
    if (Number(comm?.cleanPoints || 0) > 0) return 'points';
    return null;
  }

  getRewardAmount(comm) {
    const type = this.getRewardType(comm);
    return type === 'points' ? Number(comm.cleanPoints || 0) : Number(comm.rewardPhp || 0);
  }

  getRewardDisplay(comm) {
    const type = this.getRewardType(comm);
    const amount = this.getRewardAmount(comm);
    if (!type || amount <= 0) return 'TBA';
    return type === 'points' ? `${amount.toLocaleString()} pts` : `₱${amount.toFixed(2)}`;
  }

  getCommissions(filter = 'all') {
    if (filter === 'all') return this.commissions;
    if (filter === 'open') return this.commissions.filter(c => c.status === 'open' && this.getRewardAmount(c) > 0);
    if (filter === 'in_progress' || filter === 'claimed') return this.commissions.filter(c => c.status === 'in_progress');
    if (filter === 'in_review') return this.commissions.filter(c => c.status === 'in_review');
    if (filter === 'pending_bounty') return this.commissions.filter(c => c.status === 'pending_bounty');
    if (filter === 'completed') return this.commissions.filter(c => c.status === 'completed');
    return this.commissions;
  }

  getCommissionById(id) {
    return this.commissions.find(c => c.id === id);
  }

  getTransactions() {
    return this.transactions;
  }

  async addTransaction(userId, transaction) {
    const ref = firestore.collection('users').doc(userId)
      .collection('transactions').doc(transaction.id);
    await ref.set({
      ...transaction,
      userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  addReport(reportData) {
    const user = this.getUser();
    if (!user) return null;

    const newId = `SC-${Date.now()}`;

    const newCommission = {
      id: newId,
      title: reportData.title || 'Festival Litter Hotspot',
      sector: reportData.sector || 'Legazpi City Festival Zone',
      address: reportData.address || 'Legazpi City Festival Zone',
      lat: parseFloat(reportData.lat) || 13.1398,
      lng: parseFloat(reportData.lng) || 123.7345,
      category: reportData.category || 'Mixed Organic & Litter',
      severity: reportData.severity || 'medium',
      rewardType: null,
      rewardPhp: null,
      bountyStatus: 'pending_assignment',
      bountyAssignedBy: null,
      bountyAssignedAt: null,
      cleanPoints: 0,
      estimatedWeightKg: parseFloat(reportData.estimatedWeightKg) || 0,
      status: 'pending_bounty',
      reportedBy: user.name,
      reportedById: user.id,
      reportedAt: 'Just now',
      sponsor: 'Community Clean Fund',
      imageBefore: reportData.imageUrl || null,
      imageAfter: null,
      description: reportData.description || '',
      votes: { approve: 0, reject: 0 },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    this.commissions.unshift(newCommission);

    firestore.collection('reports').doc(newId).set(newCommission).then(() => {
      this.emit('stateChanged');
    }).catch(err => {
      console.error('Could not save report to Firestore:', err.code || err.message || err);
      this.commissions = this.commissions.filter(c => c.id !== newId);
      this.emit('stateChanged');
      window.showToast?.('Report could not be saved to Firebase.', 'error');
    });

    this.emit('commissionAdded', newCommission);
    this.emit('stateChanged');
    return newCommission;
  }

  assignBounty(id, rewardType, amount) {
    const comm = this.getCommissionById(id);
    const user = this.getUser();
    const type = rewardType === 'points' ? 'points' : rewardType === 'money' ? 'money' : null;
    const numericAmount = Number(amount);

    if (!comm || !user || user.role !== 'verifier') return false;
    if (comm.status !== 'pending_bounty') return false;
    if (!type || !Number.isFinite(numericAmount) || numericAmount <= 0) return false;

    comm.rewardType = type;
    if (type === 'money') {
      comm.rewardPhp = Math.round(numericAmount * 100) / 100;
      comm.cleanPoints = 0;
    } else {
      comm.rewardPhp = 0;
      comm.cleanPoints = Math.round(numericAmount);
    }
    comm.bountyStatus = 'assigned';
    comm.bountyAssignedBy = user.name;
    comm.bountyAssignedById = user.id;
    comm.bountyAssignedAt = 'Just now';
    comm.status = 'open';

    firestore.collection('reports').doc(comm.id).update({
      rewardType: comm.rewardType,
      rewardPhp: comm.rewardPhp,
      cleanPoints: comm.cleanPoints,
      bountyStatus: comm.bountyStatus,
      bountyAssignedBy: comm.bountyAssignedBy,
      bountyAssignedById: comm.bountyAssignedById,
      bountyAssignedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: comm.status
    }).catch(err => {
      console.error('Could not assign reward:', err.code || err.message || err);
      window.showToast?.('Could not save the reward assignment to Firebase.', 'error');
    });

    this.emit('bountyAssigned', comm);
    this.emit('stateChanged');
    return true;
  }

  claimCommission(id) {
    const comm = this.getCommissionById(id);
    const user = this.getUser();

    if (!comm || comm.status !== 'open' || !user || this.getRewardAmount(comm) <= 0) return false;

    comm.status = 'in_progress';
    comm.assignedTo = user.name;
    comm.assignedToId = user.id;

    firestore.collection('reports').doc(comm.id).update({
      status: comm.status,
      assignedTo: comm.assignedTo,
      assignedToId: comm.assignedToId
    }).catch(err => {
      console.error('Could not update report:', err.code || err.message || err);
      window.showToast?.('Could not save this task to Firebase.', 'error');
    });

    this.emit('commissionClaimed', comm);
    this.emit('stateChanged');
    return true;
  }

  submitProof(id, proof) {
    const comm = this.getCommissionById(id);
    if (!comm) return false;

    comm.status = 'in_review';
    comm.imageAfter = proof.imageAfter || null;
    comm.proofData = {
      weightRecordedKg: parseFloat(proof.weightKg) || comm.estimatedWeightKg,
      facilityManifestId: proof.manifestId || '',
      exifGpsMatch: 99.8,
      aiCleanlinessScore: 99.2,
      submittedAt: 'Just now',
      cleanerNotes: proof.notes || ''
    };
    comm.votes = { approve: 1, reject: 0 };

    firestore.collection('reports').doc(comm.id).update({
      status: comm.status,
      imageAfter: comm.imageAfter,
      proofData: comm.proofData,
      votes: comm.votes
    }).catch(err => {
      console.error('Could not save proof:', err.code || err.message || err);
      window.showToast?.('Proof could not be saved to Firebase.', 'error');
    });

    this.emit('proofSubmitted', comm);
    this.emit('stateChanged');
    return true;
  }

  verifyProof(id, approved = true, notes = '') {
    const comm = this.getCommissionById(id);
    if (!comm || comm.status !== 'in_review') return false;

    if (!approved) {
      comm.status = 'in_progress';
      comm.imageAfter = null;
      comm.rejectNotes = notes || 'Please re-sweep the site.';
      firestore.collection('reports').doc(comm.id).update({
        status: comm.status,
        imageAfter: null,
        rejectNotes: comm.rejectNotes
      }).catch(err => console.error('Could not save rejection:', err.code || err.message || err));
      this.emit('proofRejected', comm);
      this.emit('stateChanged');
      return true;
    }

    comm.status = 'completed';
    comm.votes = { ...(comm.votes || {}), approve: 3 };

    const cleanerId = comm.assignedToId;
    const cleaner = cleanerId ? this.users[cleanerId] : null;

    if (!cleaner) {
      window.showToast?.('The assigned cleaner profile could not be found.', 'error');
      return false;
    }

    if (this.getRewardType(comm) === 'money') {
      cleaner.phpBalance += Number(comm.rewardPhp || 0);
    } else if (this.getRewardType(comm) === 'points') {
      cleaner.cleanPoints += Number(comm.cleanPoints || 0);
    }
    cleaner.stats.completedCleans += 1;
    cleaner.stats.kgRecycled += Number(comm.proofData?.weightRecordedKg || comm.estimatedWeightKg || 0);

    const tx = {
      id: `TX-PH-${Date.now()}`,
      type: 'bounty_payout',
      title: `Bounty Payout: ${comm.title}`,
      reference: comm.id,
      amountPhp: Number(comm.rewardPhp || 0),
      points: Number(comm.cleanPoints || 0),
      rewardType: this.getRewardType(comm),
      status: 'completed',
      date: 'Today',
      time: 'Just now',
      channel: 'Firebase Civic Wallet'
    };

    firestore.collection('reports').doc(comm.id).update({
      status: comm.status,
      votes: comm.votes
    }).then(async () => {
      await this.persistUser(cleaner);
      await this.addTransaction(cleaner.id, tx);
    }).catch(err => {
      console.error('Could not save verification:', err.code || err.message || err);
      window.showToast?.('Verification could not be saved to Firebase.', 'error');
    });

    if (cleaner.id === this.currentUserId) {
      this.transactions.unshift({ ...tx, userId: cleaner.id });
    }

    this.emit('proofApproved', comm);
    this.emit('stateChanged');
    return true;
  }

  withdraw(amount, provider = 'GCash', account = '') {
    const user = this.getUser();
    amount = parseFloat(amount);

    if (!user || amount <= 0 || user.phpBalance < amount) return false;

    user.phpBalance -= amount;

    const tx = {
      id: `TX-PH-${Date.now()}`,
      type: 'withdrawal',
      title: `${provider} Cashout to ${account || user.payoutAccount}`,
      reference: `WD-${provider.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      amountPhp: -amount,
      points: 0,
      status: 'completed',
      date: 'Today',
      time: 'Just now',
      channel: provider
    };

    firestore.collection('users').doc(user.id).set(user, { merge: true })
      .then(() => this.addTransaction(user.id, tx))
      .catch(err => {
        console.error('Could not save withdrawal:', err.code || err.message || err);
        window.showToast?.('Withdrawal could not be saved to Firebase.', 'error');
      });

    this.transactions.unshift({ ...tx, userId: user.id });
    this.emit('stateChanged');
    return true;
  }

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
