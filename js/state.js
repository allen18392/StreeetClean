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

const WASTE_BADGES = [
  { threshold: 5, name: 'Leaf Picker', desc: 'Collected 5+ kg of waste', icon: 'fa-leaf', color: 'green' },
  { threshold: 10, name: 'Waste Scout', desc: 'Collected 10+ kg of waste', icon: 'fa-binoculars', color: 'green' },
  { threshold: 20, name: 'Eco Collector', desc: 'Collected 20+ kg of waste', icon: 'fa-recycle', color: 'green' },
  { threshold: 30, name: 'Green Guardian', desc: 'Collected 30+ kg of waste', icon: 'fa-shield-heart', color: 'green' },
  { threshold: 40, name: 'Cleanup Champion', desc: 'Collected 40+ kg of waste', icon: 'fa-medal', color: 'gold' },
  { threshold: 50, name: 'Earth Steward', desc: 'Collected 50+ kg of waste', icon: 'fa-earth-asia', color: 'gold' }
];


const TRUST_BADGES = [
  { threshold: 25, name: 'Trust Starter', desc: 'Reached 25 Trust Credits', icon: 'fa-seedling', tone: 'green' },
  { threshold: 50, name: 'Reliable Cleaner', desc: 'Reached 50 Trust Credits', icon: 'fa-handshake', tone: 'green' },
  { threshold: 75, name: 'Trusted Cleaner', desc: 'Reached 75 Trust Credits', icon: 'fa-shield-heart', tone: 'gold' },
  { threshold: 90, name: 'Very Trusted', desc: 'Reached 90 Trust Credits', icon: 'fa-certificate', tone: 'gold' },
  { threshold: 100, name: 'StreetClean Legend', desc: 'Reached the maximum 100 Trust Credits', icon: 'fa-crown', tone: 'gold' }
];

function getTrustBadges(score) {
  const total = Math.max(0, Math.min(100, Number(score || 0)));
  return TRUST_BADGES.filter(b => total >= b.threshold);
}

function getWasteBadges(kg) {
  const total = Number(kg || 0);
  return WASTE_BADGES.filter(b => total >= b.threshold);
}

// Firebase Timestamp, Date, ISO string, and Firestore server timestamp-safe formatter.
function formatStreetCleanTimestamp(value, fallback = 'Not recorded') {
  if (!value) return fallback;
  let date = null;
  if (value instanceof Date) date = value;
  else if (typeof value?.toDate === 'function') date = value.toDate();
  else if (typeof value === 'number') date = new Date(value);
  else if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date || Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
    timeZone: 'Asia/Manila'
  }).format(date);
}

function timestampForLocalDisplay() {
  return new Date().toISOString();
}

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
    badges: getWasteBadges(Number(data.stats?.kgRecycled || 0)).length ? getWasteBadges(Number(data.stats?.kgRecycled || 0)) : (Array.isArray(data.badges) ? data.badges : []),
    gear: Array.isArray(data.gear) ? data.gear : [],
    redeemedPartnerRewards: Array.isArray(data.redeemedPartnerRewards) ? data.redeemedPartnerRewards : [],
    reputationScore: Number.isFinite(Number(data.reputationScore)) ? Number(data.reputationScore) : 50,
    reputationLevel: data.reputationLevel || 'New Cleaner',
    reputationStats: {
      successfulCleans: Number(data.reputationStats?.successfulCleans || 0),
      publicCleans: Number(data.reputationStats?.publicCleans || 0),
      failedAudits: Number(data.reputationStats?.failedAudits || 0),
      duplicateFlags: Number(data.reputationStats?.duplicateFlags || 0)
    },
    trustBadges: getTrustBadges(Number(data.reputationScore || 50))
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
        .map(comm => {
          // Backward compatibility for reports created before the new task model.
          if (!comm.taskType) comm.taskType = comm.rewardType === 'points' ? 'partner' : 'public';
          if (!comm.taskTypeLabel) comm.taskTypeLabel = this.getTaskTypeLabel(comm);
          if (comm.taskType === 'public' && !Number(comm.requiredReputation)) comm.requiredReputation = 60;
          if (comm.rewardType === 'money' && comm.rewardPhp != null) {
            comm.platformFeeRate = Number(comm.platformFeeRate ?? 0.05);
            comm.platformFeePhp = Number(comm.platformFeePhp ?? (Number(comm.rewardPhp || 0) * comm.platformFeeRate));
            comm.cleanerPayoutPhp = Number(comm.cleanerPayoutPhp ?? Math.max(0, Number(comm.rewardPhp || 0) - comm.platformFeePhp));
          }
          // Old pending-bounty reports become public community tasks with an automatic reward.
          if (comm.status === 'pending_bounty') {
            const autoReward = Math.max(50, Math.round((Number(comm.estimatedWeightKg) || 1) * 20));
            comm.taskType = 'public';
            comm.taskTypeLabel = this.getTaskTypeLabel(comm);
            comm.rewardType = 'money';
            comm.rewardPhp = autoReward;
            comm.cleanPoints = 0;
            comm.platformFeeRate = 0.05;
            comm.platformFeePhp = Math.round(autoReward * 0.05 * 100) / 100;
            comm.cleanerPayoutPhp = Math.round(autoReward * 0.95 * 100) / 100;
            comm.bountyStatus = 'auto_assigned';
            comm.status = 'open';
            comm.requiredReputation = 60;
            firestore.collection('reports').doc(comm.id).update({
              taskType: 'public', taskTypeLabel: comm.taskTypeLabel, rewardType: 'money', rewardPhp: autoReward,
              cleanPoints: 0, platformFeeRate: 0.05, platformFeePhp: comm.platformFeePhp,
              cleanerPayoutPhp: comm.cleanerPayoutPhp, bountyStatus: 'auto_assigned', status: 'open', requiredReputation: 60
            }).catch(err => console.warn('Could not migrate legacy report', comm.id, err));
          }
          return comm;
        })
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

  formatTimestamp(value, fallback = 'Not recorded') {
    return formatStreetCleanTimestamp(value, fallback);
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

  getTaskTypeLabel(comm) {
    const map = {
      private_property: 'Private Property',
      partner: 'Partner Challenge',
      public: 'Community Cleanup'
    };
    return map[comm?.taskType] || 'Community Cleanup';
  }

  getPlatformFee(comm) {
    if (this.getRewardType(comm) !== 'money') return 0;
    return Math.round(Number(comm.rewardPhp || 0) * Number(comm.platformFeeRate ?? 0.05) * 100) / 100;
  }

  getCleanerPayout(comm) {
    if (this.getRewardType(comm) !== 'money') return 0;
    return Math.max(0, Math.round((Number(comm.rewardPhp || 0) - this.getPlatformFee(comm)) * 100) / 100);
  }

  getReputationLevel(score) {
    const n = Number(score || 0);
    if (n >= 90) return 'Trusted Cleaner';
    if (n >= 75) return 'Verified Cleaner';
    if (n >= 60) return 'Reliable Cleaner';
    if (n >= 45) return 'New Cleaner';
    return 'Needs Review';
  }

  getPublicTaskMinReputation(comm) {
    return Number(comm?.requiredReputation || 60);
  }

  getWasteTypeInfo(comm) {
    const type = comm?.wasteType || 'recyclable';
    const info = {
      hazardous: { label: 'Hazardous', icon: '⚠️', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
      non_biodegradable: { label: 'Non-biodegradable', icon: '🧴', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
      recyclable: { label: 'Recyclable', icon: '♻️', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
      biodegradable: { label: 'Biodegradable', icon: '🍃', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
    };
    return info[type] || info.recyclable;
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

  async redeemPartnerReward(reward) {
    const user = this.getUser();
    if (!user || !reward || user.cleanPoints < Number(reward.points)) return false;

    const points = Math.round(Number(reward.points));
    user.cleanPoints -= points;
    const redemption = {
      id: `PR-${Date.now()}`,
      partner: reward.partner,
      reward: reward.name,
      points,
      claimedAt: new Date().toISOString()
    };
    user.redeemedPartnerRewards = [redemption, ...(user.redeemedPartnerRewards || [])].slice(0, 25);

    const tx = {
      id: `TX-PR-${Date.now()}`,
      type: 'partner_reward',
      title: `Partner Reward: ${reward.name}`,
      reference: redemption.id,
      amountPhp: 0,
      points: -points,
      rewardType: 'partner_reward',
      status: 'completed',
      date: 'Today',
      time: 'Just now',
      channel: reward.partner
    };

    try {
      await this.persistUser(user);
      await this.addTransaction(user.id, tx);
      this.transactions.unshift({ ...tx, userId: user.id });
      this.emit('stateChanged');
      return redemption;
    } catch (err) {
      user.cleanPoints += points;
      user.redeemedPartnerRewards = (user.redeemedPartnerRewards || []).filter(r => r.id !== redemption.id);
      console.error('Could not redeem partner reward:', err.code || err.message || err);
      window.showToast?.('Could not save the partner reward claim.', 'error');
      return false;
    }
  }

  addReport(reportData) {
    const user = this.getUser();
    if (!user) return null;

    const newId = `SC-${Date.now()}`;
    const taskType = ['private_property', 'partner', 'public'].includes(reportData.taskType) ? reportData.taskType : 'public';
    const requestedReward = Math.max(0, Number(reportData.rewardPhp || 0));
    const requestedPoints = Math.max(0, Math.round(Number(reportData.cleanPoints || 0)));
    const publicAutoReward = Math.max(50, Math.round((Number(reportData.estimatedWeightKg) || 1) * 20));

    let rewardType = 'money';
    let rewardPhp = publicAutoReward;
    let cleanPoints = 0;
    let bountyStatus = 'auto_assigned';
    let status = 'open';

    if (taskType === 'private_property') {
      rewardPhp = requestedReward || 500;
    } else if (taskType === 'partner') {
      rewardType = 'points';
      rewardPhp = 0;
      cleanPoints = requestedPoints || 500;
    } else {
      rewardPhp = publicAutoReward;
    }

    const newCommission = {
      id: newId,
      title: reportData.title || 'Community Cleanup Task',
      taskType,
      taskTypeLabel: this.getTaskTypeLabel({ taskType }),
      sector: reportData.sector || 'Legazpi City Festival Zone',
      address: reportData.address || 'Legazpi City Festival Zone',
      lat: parseFloat(reportData.lat) || 13.1398,
      lng: parseFloat(reportData.lng) || 123.7345,
      propertyOwner: taskType === 'private_property' ? (reportData.propertyOwner || user.name) : null,
      partnerName: taskType === 'partner' ? (reportData.partnerName || user.name) : null,
      partnerRewardDescription: taskType === 'partner' ? (reportData.partnerRewardDescription || 'Partner reward points') : null,
      category: reportData.category || 'Mixed Organic & Litter',
      wasteType: reportData.wasteType || 'recyclable',
      severity: reportData.severity || 'medium',
      rewardType,
      rewardPhp,
      cleanPoints,
      platformFeeRate: rewardType === 'money' ? 0.05 : 0,
      platformFeePhp: rewardType === 'money' ? Math.round(rewardPhp * 0.05 * 100) / 100 : 0,
      cleanerPayoutPhp: rewardType === 'money' ? Math.max(0, Math.round((rewardPhp * 0.95) * 100) / 100) : 0,
      bountyStatus,
      bountyAssignedBy: taskType === 'partner' ? reportData.partnerName || user.name : 'StreetClean Auto Reward Engine',
      bountyAssignedAt: timestampForLocalDisplay(),
      requiredReputation: taskType === 'public' ? 60 : 0,
      estimatedWeightKg: parseFloat(reportData.estimatedWeightKg) || 0,
      status,
      reportedBy: user.name,
      reportedById: user.id,
      reportedAt: timestampForLocalDisplay(),
      sponsor: taskType === 'partner' ? (reportData.partnerName || user.name) : (taskType === 'private_property' ? user.name : 'StreetClean Community'),
      imageBefore: reportData.imageUrl || null,
      imageAfter: null,
      beforeUploadedAt: timestampForLocalDisplay(),
      afterUploadedAt: null,
      description: reportData.description || '',
      votes: { approve: 0, reject: 0 },
      createdAt: timestampForLocalDisplay()
    };

    this.commissions.unshift(newCommission);

    firestore.collection('reports').doc(newId).set({
      ...newCommission,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
      beforeUploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
      bountyAssignedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
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
    comm.bountyAssignedAt = timestampForLocalDisplay();
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
    if (comm.taskType === 'public' && Number(user.reputationScore || 50) < this.getPublicTaskMinReputation(comm)) {
      window.showToast?.(`Public tasks require a reputation score of ${this.getPublicTaskMinReputation(comm)}+. Your score is ${Number(user.reputationScore || 50)}.`, 'error');
      return false;
    }
    if (comm.taskType === 'private_property' && comm.reportedById === user.id) {
      window.showToast?.('You cannot claim your own property task.', 'error');
      return false;
    }

    comm.status = 'in_progress';
    comm.assignedTo = user.name;
    comm.assignedToId = user.id;
    comm.claimedAt = timestampForLocalDisplay();
    comm.claimedReputation = Number(user.reputationScore || 50);

    firestore.collection('reports').doc(comm.id).update({
      status: comm.status,
      assignedTo: comm.assignedTo,
      assignedToId: comm.assignedToId,
      claimedAt: firebase.firestore.FieldValue.serverTimestamp(),
      claimedReputation: comm.claimedReputation
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
    if (!comm || !['in_progress', 'open'].includes(comm.status)) return false;

    const user = this.getUser();
    if (!user || (comm.assignedToId && comm.assignedToId !== user.id)) return false;

    comm.status = 'in_review';
    comm.assignedTo = comm.assignedTo || user.name;
    comm.assignedToId = comm.assignedToId || user.id;
    comm.imageAfter = proof.imageAfter || null;
    const submittedAt = timestampForLocalDisplay();
    comm.afterUploadedAt = submittedAt;
    const weightRecordedKg = parseFloat(proof.weightKg) || comm.estimatedWeightKg || 0;
    const beforeLat = Number(comm.lat || 0);
    const beforeLng = Number(comm.lng || 0);
    const afterLat = Number(proof.afterLat ?? beforeLat);
    const afterLng = Number(proof.afterLng ?? beforeLng);
    const gpsDistanceMeters = this.calculateDistanceMeters(beforeLat, beforeLng, afterLat, afterLng);
    const gpsMatch = gpsDistanceMeters <= 100;
    const reputation = Number(user.reputationScore || 50);
    const duplicateFlag = !!proof.duplicateFlag;
    const automatedPass = !!comm.imageAfter && gpsMatch && !duplicateFlag && weightRecordedKg > 0 && (comm.taskType !== 'public' || reputation >= this.getPublicTaskMinReputation(comm));

    comm.proofData = {
      weightRecordedKg,
      facilityManifestId: proof.manifestId || '',
      exifGpsMatch: gpsMatch ? Math.max(95, Number(proof.exifGpsMatch || 99.8)) : 35,
      aiCleanlinessScore: Number(proof.aiCleanlinessScore || (automatedPass ? 95 : 55)),
      submittedAt,
      cleanerNotes: proof.notes || '',
      afterLat,
      afterLng,
      gpsDistanceMeters,
      gpsMatch,
      duplicateFlag,
      verificationMethod: automatedPass ? 'automatic' : 'manual-audit'
    };
    comm.votes = { approve: automatedPass ? 3 : 1, reject: 0 };

    firestore.collection('reports').doc(comm.id).update({
      status: comm.status,
      assignedTo: comm.assignedTo,
      assignedToId: comm.assignedToId,
      imageAfter: comm.imageAfter,
      proofData: { ...comm.proofData, submittedAt: firebase.firestore.FieldValue.serverTimestamp() },
      afterUploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
      votes: comm.votes
    }).catch(err => {
      console.error('Could not save proof:', err.code || err.message || err);
      window.showToast?.('Proof could not be saved to Firebase.', 'error');
    });

    this.emit('proofSubmitted', comm);
    this.emit('stateChanged');

    if (automatedPass) {
      return this.verifyProof(id, true, 'Automatically verified using timestamps, GPS, task evidence and cleaner reputation.');
    }
    return true;
  }

  calculateDistanceMeters(lat1, lng1, lat2, lng2) {
    const toRad = deg => deg * Math.PI / 180;
    const a1 = toRad(Number(lat1)), a2 = toRad(Number(lat2));
    const dLat = toRad(Number(lat2) - Number(lat1));
    const dLng = toRad(Number(lng2) - Number(lng1));
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(a1) * Math.cos(a2) * Math.sin(dLng / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  verifyProof(id, approved = true, notes = '') {
    const comm = this.getCommissionById(id);
    if (!comm || !['in_review', 'auto_verified'].includes(comm.status)) return false;

    if (!approved) {
      comm.status = 'in_progress';
      comm.imageAfter = null;
      comm.rejectNotes = notes || 'Please re-sweep the site.';
      const cleaner = comm.assignedToId ? this.users[comm.assignedToId] : null;
      if (cleaner) {
        cleaner.reputationStats.failedAudits += 1;
        cleaner.reputationScore = Math.max(0, Number(cleaner.reputationScore || 50) - 8);
        cleaner.reputationLevel = this.getReputationLevel(cleaner.reputationScore);
        cleaner.trustBadges = getTrustBadges(cleaner.reputationScore);
      }
      firestore.collection('reports').doc(comm.id).update({
        status: comm.status,
        imageAfter: null,
        rejectNotes: comm.rejectNotes,
        verificationMethod: 'manual-audit'
      }).catch(err => console.error('Could not save rejection:', err.code || err.message || err));
      if (cleaner) this.persistUser(cleaner);
      this.emit('proofRejected', comm);
      this.emit('stateChanged');
      return true;
    }

    comm.status = 'completed';
    comm.verificationMethod = comm.proofData?.verificationMethod || 'automatic';
    comm.verifiedAt = timestampForLocalDisplay();
    comm.votes = { ...(comm.votes || {}), approve: Math.max(3, Number(comm.votes?.approve || 0)) };

    const cleanerId = comm.assignedToId;
    const cleaner = cleanerId ? this.users[cleanerId] : null;

    if (!cleaner) {
      window.showToast?.('The assigned cleaner profile could not be found.', 'error');
      return false;
    }

    const moneyReward = this.getRewardType(comm) === 'money';
    const cleanerPayout = moneyReward ? this.getCleanerPayout(comm) : 0;
    if (moneyReward) {
      cleaner.phpBalance += cleanerPayout;
      comm.platformFeePhp = this.getPlatformFee(comm);
      comm.cleanerPayoutPhp = cleanerPayout;
    } else if (this.getRewardType(comm) === 'points') {
      cleaner.cleanPoints += Number(comm.cleanPoints || 0);
    }

    const kg = Number(comm.proofData?.weightRecordedKg || comm.estimatedWeightKg || 0);
    cleaner.stats.completedCleans += 1;
    cleaner.stats.kgRecycled += kg;
    cleaner.reputationStats.successfulCleans += 1;
    if (comm.taskType === 'public') cleaner.reputationStats.publicCleans += 1;
    const repGain = comm.taskType === 'public' ? 7 : 5;
    cleaner.reputationScore = Math.min(100, Math.max(0, Number(cleaner.reputationScore || 50) + repGain));
    cleaner.reputationLevel = this.getReputationLevel(cleaner.reputationScore);
    cleaner.trustBadges = getTrustBadges(cleaner.reputationScore);
    const earnedWasteBadges = getWasteBadges(cleaner.stats.kgRecycled);
    cleaner.badges = earnedWasteBadges.length ? earnedWasteBadges : (cleaner.badges || []);

    const tx = {
      id: `TX-PH-${Date.now()}`,
      type: moneyReward ? 'bounty_payout' : 'partner_task_reward',
      title: `${this.getTaskTypeLabel(comm)}: ${comm.title}`,
      reference: comm.id,
      amountPhp: cleanerPayout,
      grossAmountPhp: moneyReward ? Number(comm.rewardPhp || 0) : 0,
      platformFeePhp: moneyReward ? Number(comm.platformFeePhp || 0) : 0,
      points: Number(comm.cleanPoints || 0),
      rewardType: this.getRewardType(comm),
      status: 'completed',
      date: 'Today',
      time: 'Just now',
      channel: moneyReward ? 'StreetClean Auto Payout' : (comm.partnerName || 'Partner Rewards')
    };

    firestore.collection('reports').doc(comm.id).update({
      status: comm.status,
      votes: comm.votes,
      verifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      verificationMethod: comm.verificationMethod,
      platformFeePhp: comm.platformFeePhp || 0,
      cleanerPayoutPhp: comm.cleanerPayoutPhp || 0
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
