/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Main Application Orchestrator & Client-Side SPA Router (White & Green Theme)
 */

// Central Route Mapper
window.renderRoute = () => {
  const hash = window.location.hash || '#/';
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  // ---- Auth gate: nothing else is reachable until logged in ----
  const loggedIn = !!window.appState.getUser();
  const isAuthRoute = hash.startsWith('#/auth') || hash.startsWith('#/login') || hash.startsWith('#/register');
  document.body.classList.toggle('auth-locked', !loggedIn);

  if (!loggedIn && !isAuthRoute) {
    window.location.hash = '#/auth';
    return;
  }
  if (loggedIn && isAuthRoute) {
    window.location.hash = '#/';
    return;
  }

  // Cleanup prior maps/charts
  if (window.MapEngine) window.MapEngine.destroy();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update Header & Nav state
  window.updateNavState(hash);
  window.updateHeaderUserChip();

  // Route Dispatcher
  if (hash === '#/' || hash === '' || hash === '#/home') {
    appRoot.innerHTML = window.HomeView.render();
  } else if (hash.startsWith('#/commissions') || hash.startsWith('#/tasks')) {
    appRoot.innerHTML = window.CommissionsView.render();
  } else if (hash.startsWith('#/report')) {
    appRoot.innerHTML = window.ReportView.render();
    setTimeout(() => {
      if (window.ReportView.currentStep === 1 && window.MapEngine) {
        window.MapEngine.initReportLocationPicker('report-location-map', (lat, lng) => {
          window.ReportView.formData.lat = lat;
          window.ReportView.formData.lng = lng;
          const el = document.getElementById('report-coords');
          if (el) el.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        });
      }
    }, 100);
  } else if (hash.startsWith('#/verify')) {
    appRoot.innerHTML = window.VerifyView.render();
  } else if (hash.startsWith('#/wallet')) {
    appRoot.innerHTML = window.WalletView.render();
  } else if (hash.startsWith('#/dashboard') || hash.startsWith('#/impact')) {
    appRoot.innerHTML = window.DashboardView.render();
    setTimeout(() => {
      if (window.DashboardView.initCharts) window.DashboardView.initCharts();
    }, 100);
  } else if (hash.startsWith('#/profile')) {
    appRoot.innerHTML = window.ProfileView.render();
  } else if (hash.startsWith('#/auth') || hash.startsWith('#/login') || hash.startsWith('#/register')) {
    appRoot.innerHTML = window.AuthView.render();
  } else {
    appRoot.innerHTML = window.HomeView.render();
  }
};

// Update active states on Desktop & Mobile bottom navbars
window.updateNavState = (currentHash) => {
  // Mobile Nav items
  const bottomItems = document.querySelectorAll('.bottom-nav-item');
  bottomItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentHash || (currentHash === '#/' && href === '#/')) {
      item.classList.add('active');
    } else if (currentHash.startsWith(href) && href !== '#/') {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Desktop Nav links
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');
  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentHash || (currentHash === '#/' && href === '#/')) {
      link.classList.add('active');
    } else if (currentHash.startsWith(href) && href !== '#/') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update badge counters
  const verifyCount = window.appState.getCommissions('in_review').length;
  const verifyBadge = document.getElementById('nav-verify-badge');
  if (verifyBadge) {
    verifyBadge.innerText = verifyCount;
    verifyBadge.style.display = verifyCount > 0 ? 'flex' : 'none';
  }
};

// Update header avatar chip with active user info
window.updateHeaderUserChip = () => {
  const user = window.appState.getUser();
  const chip = document.getElementById('header-user-chip');

  if (!user) {
    if (chip) chip.innerHTML = `<span style="font-size:0.8rem; font-weight:700; padding:0 4px;">Sign In</span>`;
    document.querySelectorAll('.role-pill-btn').forEach(btn => btn.classList.remove('active'));
    return;
  }

  if (chip) {
    chip.innerHTML = `
      <img src="${user.avatar}" class="user-quick-avatar" alt="${user.name}" />
      <div style="text-align: left; line-height: 1.1;">
        <div class="user-quick-name">${user.name}</div>
        <div class="user-quick-role">${user.role}</div>
      </div>
    `;
  }

  const roleButtons = document.querySelectorAll('.role-pill-btn');
  roleButtons.forEach(btn => {
    if (btn.classList.contains(`role-${user.role}`)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};


// Modal Engine
window.openModal = (contentHtml) => {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (backdrop) {
    backdrop.innerHTML = contentHtml;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.soundSystem.modalOpen();
  }
};

window.closeModal = () => {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { backdrop.innerHTML = ''; }, 300);
  }
};

// Toast Engine
window.showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-check';
  if (type === 'gold') icon = 'fa-award';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${type.toUpperCase()}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Quick Switch Role
window.switchRole = (roleKey) => {
  window.appState.setUserRole(roleKey);
  window.soundSystem.click();
  const user = window.appState.getUser();
  window.showToast(`Switched persona to ${user.name} (${user.role.toUpperCase()})`, 'gold');
  window.renderRoute();
};

// Log Out — signs out of Firebase; the onAuthStateChanged listener below
// picks up the change, clears the local session, and redirects to #/auth.
window.logoutUser = async () => {
  if (!confirm('Log out of StreetClean?')) return;
  try {
    await auth.signOut();
    window.soundSystem.click();
    window.showToast('Signed out. See you next cleanup!', 'success');
  } catch (err) {
    window.showToast('Could not sign out. Please try again.', 'error');
  }
};

// Toggle Mobile Frame Preview Simulation Mode
window.toggleMobileFrame = () => {
  document.body.classList.toggle('mode-mobile-frame');
  const isFrame = document.body.classList.contains('mode-mobile-frame');
  const btn = document.getElementById('device-toggle-btn');

  if (btn) {
    btn.setAttribute('aria-checked', String(isFrame));
    btn.title = isFrame ? 'Switch to Desktop View' : 'Switch to Mobile View';

    const thumb = btn.querySelector('.device-toggle-thumb');
    if (thumb) {
      thumb.innerHTML = isFrame
        ? '<i class="fa-solid fa-mobile-screen"></i>'
        : '<i class="fa-solid fa-desktop"></i>';
    }
  }

  window.showToast(isFrame ? 'Mobile View Enabled' : 'Desktop View Enabled', 'success');
};

// Open Commission Details & Actions Modal
window.openTaskModal = (id) => {
  window.openCommissionDetails(id);
};

window.openCommissionDetails = (id) => {
  const comm = window.appState.getCommissionById(id);
  if (!comm) return;

  const user = window.appState.getUser();

  let statusBadge = '<span class="status-badge status-open"><span class="badge-dot"></span> Open Bounty</span>';
  if (comm.status === 'in_progress') statusBadge = '<span class="status-badge status-in_progress"><span class="badge-dot"></span> In Progress</span>';
  if (comm.status === 'in_review') statusBadge = '<span class="status-badge status-in_review"><span class="badge-dot"></span> In Review by Verifier</span>';
  if (comm.status === 'completed') statusBadge = '<span class="status-badge status-completed"><span class="badge-dot"></span> Verified & Rewarded</span>';

  const modalHtml = `
    <div class="modal-card">
      <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>

      <!-- Status & Category -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 6px;">
          ${statusBadge}
          <span class="severity-pill ${comm.severity}">${comm.severity}</span>
        </div>
        <span style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono); font-weight: 700;">${comm.id}</span>
      </div>

      <!-- Title & Location -->
      <h2 style="font-size: 1.2rem; font-weight: 800; line-height: 1.3; margin-bottom: 4px; color: #0f172a;">${comm.title}</h2>
      <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">
        <i class="fa-solid fa-location-dot" style="color: var(--emerald-600);"></i> ${comm.sector} • ${comm.address}
      </div>

      <!-- Bounty Hero -->
      <div style="display: flex; align-items: center; justify-content: space-between; background: #fef3c7; border: 1px solid #fde68a; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
        <div>
          <div style="font-size: 0.72rem; color: #92400e; text-transform: uppercase; font-weight: 700;">Clean Bounty Reward</div>
          <div class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #b45309;">₱${comm.rewardPhp.toFixed(2)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.72rem; color: #92400e;">Est. Weight / Time</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${comm.estimatedWeightKg} kg • ${comm.deadline}</div>
        </div>
      </div>

      <!-- Photos (Before / After) -->
      ${comm.imageAfter ? `
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
            <i class="fa-solid fa-images" style="color: var(--emerald-600);"></i> Before & After Comparison:
          </div>
          <div class="before-after-container" id="slider-modal-${comm.id}">
            <img src="${comm.imageAfter}" alt="After Cleanup" class="before-after-img" />
            <span class="after-badge-label"><i class="fa-solid fa-check"></i> Cleaned</span>
            
            <div class="before-img-wrap" id="before-modal-wrap-${comm.id}">
              <img src="${comm.imageBefore}" alt="Before Cleanup" id="before-modal-img-${comm.id}" />
              <span class="before-badge-label"><i class="fa-solid fa-trash"></i> Dirty</span>
            </div>

            <div class="slider-handle" id="slider-modal-handle-${comm.id}"><i class="fa-solid fa-left-right"></i></div>
            <input type="range" min="0" max="100" value="50" class="slider-range-input" oninput="window.updateModalSlider('${comm.id}', this.value)" />
          </div>
        </div>
      ` : `
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
            <i class="fa-solid fa-camera" style="color: var(--emerald-600);"></i> Reported Site Photo:
          </div>
          <img src="${comm.imageBefore}" alt="${comm.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid #cbd5e1;" />
        </div>
      `}

      <!-- Description -->
      <div style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin-bottom: 1.25rem; background: #f8fafc; padding: 12px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
        ${comm.description}
      </div>

      <!-- Action Area -->
      ${comm.status === 'open' ? `
        <button class="btn btn-gold btn-block" onclick="window.claimTask('${comm.id}')">
          <i class="fa-solid fa-hand-holding-dollar"></i> Claim Cleanup Task (₱${comm.rewardPhp})
        </button>
      ` : ''}

      ${comm.status === 'in_progress' ? `
        <button class="btn btn-primary btn-block" onclick="window.openSubmitProofForm('${comm.id}')">
          <i class="fa-solid fa-upload"></i> Submit Before & After Proof of Work
        </button>
      ` : ''}

      ${comm.status === 'in_review' ? `
        <div class="card" style="padding: 10px; background: #ffedd5; border: 1px solid #fed7aa; text-align: center; color: #c2410c; font-weight: 700; font-size: 0.85rem;">
          <i class="fa-solid fa-hourglass-half"></i> Under Inspection by Legazpi Marshall. Reward is paid after approval.
        </div>
      ` : ''}

      ${comm.status === 'completed' ? `
        <div class="card" style="padding: 10px; background: #dcfce7; border: 1px solid #bbf7d0; text-align: center; color: #15803d; font-weight: 700; font-size: 0.85rem;">
          <i class="fa-solid fa-circle-check"></i> Clean Verified! ₱${comm.rewardPhp} Bounty Paid to ${comm.assignedTo || 'Cleaner'}.
        </div>
      ` : ''}

    </div>
  `;

  window.openModal(modalHtml);
};

// Modal slider helper
window.updateModalSlider = (id, val) => {
  const wrap = document.getElementById(`before-modal-wrap-${id}`);
  const handle = document.getElementById(`slider-modal-handle-${id}`);
  const img = document.getElementById(`before-modal-img-${id}`);
  const box = document.getElementById(`slider-modal-${id}`);

  if (wrap && handle && img && box) {
    wrap.style.width = `${val}%`;
    handle.style.left = `${val}%`;
    img.style.width = `${box.offsetWidth}px`;
  }
};

// Claim Task Action
window.claimTask = (id) => {
  const success = window.appState.claimCommission(id);
  if (success) {
    window.soundSystem.success();
    window.closeModal();
    window.showToast('Task claimed! Head to the location and sweep the site.', 'success');
    window.renderRoute();
  }
};

// Open Submit Proof Form (Cleaner Flow)
window.openSubmitProofForm = (id) => {
  const comm = window.appState.getCommissionById(id);
  if (!comm) return;

  const modalHtml = `
    <div class="modal-card">
      <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>

      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem;">
        <div class="brand-icon" style="width: 32px; height: 32px; font-size: 0.95rem;"><i class="fa-solid fa-upload"></i></div>
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">Submit Proof of Cleanup</h3>
      </div>

      <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem;">
        Upload your 'After' photo showing the pristine site, and log the waste scale weight.
      </p>

      <div class="form-group">
        <label class="form-label">After-Cleanup Photo</label>
        <input id="proof-photo-input" type="file" accept="image/*" capture="environment" style="display:none" onchange="window.handleProofPhotoSelect(this)">
        <button type="button" class="upload-dropzone" style="width:100%; border:0; cursor:pointer;" onclick="document.getElementById('proof-photo-input').click()">
          <div class="upload-icon"><i class="fa-solid fa-camera"></i></div>
          <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Take After Photo or Choose From Device</div>
          <div style="font-size: 0.72rem; color: #64748b;">JPG, PNG, WEBP • maximum 10 MB</div>
        </button>
        <div id="proof-photo-preview" style="margin-top:10px;"></div>
      </div>

      <div class="form-group">
        <label class="form-label">Recorded Waste Scale Weight (kg)</label>
        <input type="number" class="form-control font-mono" id="proof-weight" value="${comm.estimatedWeightKg}" />
      </div>

      <div class="form-group">
        <label class="form-label">Legazpi MRF Facility Dropoff Manifest</label>
        <input type="text" class="form-control font-mono" id="proof-manifest" value="LGU-MRF-2026-${Math.floor(100 + Math.random() * 900)}" />
      </div>

      <div class="form-group">
        <label class="form-label">Cleaner Notes / Segregation Summary</label>
        <textarea class="form-control" id="proof-notes">Completely swept the site. All plastics segregated into blue recycling sacks for Legazpi MRF.</textarea>
      </div>

      <button class="btn btn-primary btn-block" onclick="window.submitProofAction('${comm.id}')">
        <i class="fa-solid fa-paper-plane"></i> Submit to LGU Verifiers
      </button>
    </div>
  `;

  window.openModal(modalHtml);
};

window._proofPhotoFile = null;

window.handleProofPhotoSelect = (input) => {
  const file = input?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    window.showToast('Please choose an image file.', 'error');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    window.showToast('Image must be 10 MB or smaller.', 'error');
    return;
  }

  window._proofPhotoFile = file;
  const preview = document.getElementById('proof-photo-preview');
  if (preview) {
    preview.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;background:#f0fdf4;padding:10px;border-radius:12px;border:1px solid #bbf7d0;">
        <img src="${URL.createObjectURL(file)}" alt="Selected cleanup proof" style="width:64px;height:64px;object-fit:cover;border-radius:10px;">
        <div style="min-width:0;">
          <div style="font-size:.78rem;font-weight:800;color:#0f172a;">${file.name}</div>
          <div style="font-size:.7rem;color:#64748b;">Ready to upload</div>
        </div>
      </div>`;
  }
};

window.submitProofAction = async (id) => {
  const weight = document.getElementById('proof-weight')?.value || 30;
  const manifest = document.getElementById('proof-manifest')?.value || 'LGU-MRF-2026-092';
  const notes = document.getElementById('proof-notes')?.value || '';
  const file = window._proofPhotoFile;
  const submitButton = document.querySelector('.modal-card .btn-primary.btn-block');

  if (!file) {
    window.showToast('Please upload an after-cleanup photo first.', 'error');
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading Photo...';
  }

  try {
    const user = window.appState.getUser();
    const imageAfter = await window.uploadImageFile(file);

    const success = window.appState.submitProof(id, {
      weightKg: weight,
      manifestId: manifest,
      notes: notes,
      imageAfter
    });

    if (success) {
      window._proofPhotoFile = null;
      window.soundSystem.success();
      window.closeModal();
      window.showToast('Proof photo uploaded! Verifiers have been notified.', 'success');
      window.renderRoute();
    }
  } catch (err) {
    console.error('Proof photo upload failed:', err);
    window.showToast(err.message || 'Could not upload the proof photo.', 'error');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit to LGU Verifiers';
    }
  }
};

// Initial App Boot — Firebase Auth decides the session, then Firestore
// loads the user's profile, reports, and transactions before the app renders.
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', window.renderRoute);

  auth.onAuthStateChanged(async (firebaseUser) => {
    // initializeForFirebaseUser now resolves as soon as the signed-in
    // user's OWN profile is loaded (or falls back to a local profile if
    // Firestore hiccups) — it no longer waits on the leaderboard/reports/
    // transactions, so routing happens immediately after sign-in.
    await window.appState.initializeForFirebaseUser(firebaseUser);

    if (firebaseUser) {
      const h = window.location.hash;
      if (!h || h.startsWith('#/auth') || h.startsWith('#/login') || h.startsWith('#/register')) {
        window.location.hash = '#/';
      }
    } else {
      window.location.hash = '#/auth';
    }

    window.renderRoute();
  });
});
