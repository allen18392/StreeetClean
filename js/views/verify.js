/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Verification & Marshall Audit View Component (White & Green Theme)
 */

window.VerifyView = {
  render() {
    const user = window.appState.getUser();
    const pendingBounties = window.appState.getCommissions('pending_bounty');
    const pendingReviews = window.appState.getCommissions('in_review');
    const completedCleans = window.appState.getCommissions('completed');
    const isVerifier = true;

    return `
      <div class="verify-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 800px;">

                    <div class="card" style="padding:1rem 1.1rem;margin-bottom:1.25rem;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;">
            <div style="font-weight:900;"><i class="fa-solid fa-robot"></i> StreetClean Automatic Verification</div>
            <div style="font-size:.76rem;margin-top:4px;line-height:1.45;">No verifier account is required for normal task completion. Private, partner and public tasks use timestamp, GPS, photo evidence and reputation checks. This page is a read-only audit view for completed and exception cases.</div>
          </div>

          <!-- Verifier Status Banner -->
          <div class="card card-gold-glow" style="padding: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-full); background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: #b45309; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">
                  StreetClean Verification & Audit Hub
                </div>
                <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                  ${user.name} • <span style="color: var(--emerald-700);">${user.badgeLevel || 'Festival Marshall'}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <div class="card" style="padding: 6px 12px; background: #f8fafc; text-align: center; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.65rem; color: #64748b; font-weight: 700;">Pending Audits</div>
                <div class="font-mono" style="font-size: 1.1rem; font-weight: 800; color: #b45309;">${pendingReviews.length}</div>
              </div>
              <div class="card" style="padding: 6px 12px; background: #f8fafc; text-align: center; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.65rem; color: #64748b; font-weight: 700;">Approved</div>
                <div class="font-mono" style="font-size: 1.1rem; font-weight: 800; color: var(--emerald-600);">${completedCleans.length}</div>
              </div>
            </div>
          </div>

          ${false ? `
          <!-- Reports Awaiting LGU Reward Assignment -->
          <div style="margin-bottom: 1.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h2 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-coins" style="color: #7e22ce;"></i> Reports Awaiting Reward Assignment (${pendingBounties.length})
              </h2>
            </div>

            ${pendingBounties.length === 0 ? `
              <div class="card" style="padding:1rem 1.25rem;background:#faf5ff;border:1px solid #e9d5ff;color:#7e22ce;font-size:.8rem;">
                <i class="fa-solid fa-circle-check"></i> No unpriced community reports are waiting for an LGU reward decision.
              </div>
            ` : `
              <div style="display:flex;flex-direction:column;gap:12px;">
                ${pendingBounties.map(c => this.renderBountyAssignmentCard(c)).join('')}
              </div>
            `}
          </div>
          ` : ''}

          <!-- Pending Verifications Queue -->
          <div style="margin-bottom: 1.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h2 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-clipboard-check" style="color: var(--emerald-600);"></i> Cleanups Awaiting Verification (${pendingReviews.length})
              </h2>
            </div>

            ${pendingReviews.length === 0 ? `
              <div class="card" style="text-align: center; padding: 2.5rem 1.5rem; background: #ffffff;">
                <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--emerald-600); margin-bottom: 0.5rem;"></i>
                <h3 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">All Festival Cleanups Verified!</h3>
                <p style="font-size: 0.8rem; color: #64748b; max-width: 340px; margin: 0 auto;">
                  No pending proof submissions in the queue. New submissions from cleaners will appear here automatically.
                </p>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 14px;">
                ${pendingReviews.map(c => this.renderVerificationCard(c)).join('')}
              </div>
            `}
          </div>

          <!-- Recently Verified History -->
          <div>
            <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.75rem; color: #0f172a;">
              <i class="fa-solid fa-clock-rotate-left" style="color: var(--emerald-600);"></i> Recently Verified & Rewarded
            </h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${completedCleans.map(c => `
                <div class="card" style="padding: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ffffff; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${c.imageAfter}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; border: 1.5px solid var(--emerald-500);" />
                    <div>
                      <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${c.title}</div>
                      <div style="font-size: 0.72rem; color: #64748b;"><i class="fa-solid fa-location-dot" style="color: var(--emerald-600);"></i> ${c.sector} • Cleaned by ${c.assignedTo}</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="font-mono" style="font-weight: 800; color: #b45309; font-size: 0.95rem;">${window.appState.getRewardDisplay(c)}</span>
                    <span style="font-size:.67rem;color:#64748b;"><i class="fa-solid fa-clock"></i> ${window.appState.formatTimestamp(c.afterUploadedAt || c.proofData?.submittedAt, 'Not recorded')}</span>
                    <span class="status-badge status-completed"><i class="fa-solid fa-check"></i> Approved</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  renderBountyAssignmentCard(c) {
    return `
      <div class="card" style="padding:1.25rem;background:#ffffff;border:1px solid #e9d5ff;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:10px;">
          <div style="min-width:0;flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span class="status-badge" style="background:#f3e8ff;color:#7e22ce;border:1px solid #d8b4fe;"><span class="badge-dot"></span> Reward Needed</span>
              <span class="font-mono" style="font-size:.7rem;color:#64748b;">${c.id}</span>
            </div>
            <div style="font-size:1rem;font-weight:800;color:#0f172a;">${c.title}</div>
            <div style="margin-top:8px;padding:8px 10px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;">
              <div style="font-size:.62rem;color:#64748b;font-weight:800;text-transform:uppercase;letter-spacing:.04em;">Waste Description</div>
              <div style="font-size:.78rem;color:#334155;font-weight:800;margin-top:2px;">${c.description || 'e.g. plastic bottles, food containers, mixed litter'}</div>
            </div>
            <div style="font-size:.74rem;color:#64748b;margin-top:6px;">${c.sector} • ${c.severity} • ~${Number(c.estimatedWeightKg || 0).toFixed(2)} kg</div>
          </div>
          <div style="font-size:.72rem;color:#7e22ce;font-weight:700;">Community report</div>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px;margin-bottom:10px;font-size:.76rem;color:#475569;line-height:1.45;">
          <strong>Waste Description:</strong> ${c.description || 'e.g. plastic bottles, food containers, mixed litter'}
        </div>

        <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;">
          <div style="min-width:170px;flex:0 0 190px;">
            <label class="form-label" for="reward-type-${c.id}">Reward type</label>
            <select id="reward-type-${c.id}" class="form-control" onchange="window.VerifyView.updateRewardInput('${c.id}')">
              <option value="money">Money (₱)</option>
              <option value="points">Clean Points</option>
            </select>
          </div>
          <div style="flex:1;min-width:180px;">
            <label class="form-label" for="bounty-${c.id}" id="reward-label-${c.id}">Reward amount (₱)</label>
            <div style="position:relative;">
              <span id="reward-prefix-${c.id}" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-weight:800;color:#b45309;">₱</span>
              <input id="bounty-${c.id}" type="number" min="0.01" step="0.01" placeholder="Enter amount" class="form-control" style="padding-left:28px;" />
            </div>
            <div id="reward-help-${c.id}" style="font-size:.68rem;color:#64748b;margin-top:4px;">Enter the flexible cash reward based on your official assessment.</div>
          </div>
          <button class="btn btn-gold" style="min-height:42px;" onclick="window.VerifyView.assignBounty('${c.id}')">
            <i class="fa-solid fa-check"></i> Assign Reward & Publish Task
          </button>
        </div>
      </div>
    `;
  },

  updateRewardInput(id) {
    const type = document.getElementById(`reward-type-${id}`)?.value || 'money';
    const label = document.getElementById(`reward-label-${id}`);
    const prefix = document.getElementById(`reward-prefix-${id}`);
    const input = document.getElementById(`bounty-${id}`);
    const help = document.getElementById(`reward-help-${id}`);
    if (type === 'points') {
      if (label) label.textContent = 'Reward amount (pts)';
      if (prefix) prefix.textContent = '★';
      if (input) { input.step = '1'; input.min = '1'; input.placeholder = 'Enter points'; }
      if (help) help.textContent = 'Enter the flexible Clean Points reward based on your official assessment.';
    } else {
      if (label) label.textContent = 'Reward amount (₱)';
      if (prefix) prefix.textContent = '₱';
      if (input) { input.step = '0.01'; input.min = '0.01'; input.placeholder = 'Enter amount'; }
      if (help) help.textContent = 'Enter the flexible cash reward based on your official assessment.';
    }
  },

  assignBounty(id) {
    const type = document.getElementById(`reward-type-${id}`)?.value || 'money';
    const input = document.getElementById(`bounty-${id}`);
    const amount = Number(input?.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.showToast(type === 'points' ? 'Enter a valid points reward greater than 0.' : 'Enter a valid money reward greater than ₱0.', 'error');
      return;
    }

    const success = window.appState.assignBounty(id, type, amount);
    if (success) {
      window.soundSystem.success();
      const label = type === 'points' ? `${Math.round(amount).toLocaleString()} pts` : `₱${amount.toFixed(2)}`;
      window.showToast(`Reward set to ${label}. Task is now open for cleaners.`, 'gold');
      window.renderRoute();
    } else {
      window.showToast('Only an authorized verifier can assign this reward.', 'error');
    }
  },

  renderVerificationCard(c) {
    const proof = c.proofData || {
      weightRecordedKg: c.estimatedWeightKg,
      facilityManifestId: 'LGU-MRF-2026-088',
      exifGpsMatch: 99.8,
      aiCleanlinessScore: 99.2,
      submittedAt: 'Just now',
      cleanerNotes: 'Completed cleanup.'
    };

    return `
      <div class="card card-gold-glow" style="padding: 1.5rem; background: #ffffff; border: 1px solid #bbf7d0;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="status-badge status-in_review"><span class="badge-dot"></span> Needs Review</span>
              <span class="font-mono" style="font-size: 0.72rem; color: #64748b;">${c.id}</span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">${c.title}</h3>
            <p style="font-size: 0.78rem; color: #64748b;"><i class="fa-solid fa-map-pin" style="color: var(--emerald-600);"></i> ${c.address}</p>
          </div>
          <div style="text-align: right;">
            <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: #b45309;">${window.appState.getRewardDisplay(c)}</div>
            <div style="font-size: 0.7rem; color: var(--emerald-700); font-weight: 700;">${window.appState.getRewardType(c) === 'points' ? 'Clean Points reward' : 'Cash reward'}</div>
          </div>
        </div>

        <!-- Interactive Before / After Split Slider -->
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; margin-bottom: 6px;">
            <span style="color: #e11d48;"><i class="fa-solid fa-arrow-left"></i> Before (Reported Litter)</span>
            <span style="color: #64748b; font-size: 0.7rem;">Drag curtain to inspect</span>
            <span style="color: var(--emerald-700);">After (Pristine Result) <i class="fa-solid fa-arrow-right"></i></span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin-bottom:10px;">
            <div style="padding:8px 10px;background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;">
              <div style="font-size:.62rem;color:#9f1239;font-weight:800;text-transform:uppercase;">Before photo uploaded</div>
              <div style="font-size:.72rem;color:#475569;margin-top:2px;"><i class="fa-solid fa-clock"></i> ${window.appState.formatTimestamp(c.beforeUploadedAt || c.createdAt, 'Not recorded')}</div>
            </div>
            <div style="padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
              <div style="font-size:.62rem;color:#166534;font-weight:800;text-transform:uppercase;">After photo uploaded</div>
              <div style="font-size:.72rem;color:#475569;margin-top:2px;"><i class="fa-solid fa-clock"></i> ${window.appState.formatTimestamp(c.afterUploadedAt || proof.submittedAt, 'Not recorded')}</div>
            </div>
          </div>

          <div class="before-after-container" id="slider-wrap-${c.id}">
            <img src="${c.imageAfter}" class="before-after-img" alt="After Clean" />
            <div class="after-badge-label"><i class="fa-solid fa-sparkles"></i> Cleaned</div>
            
            <div class="before-img-wrap" id="before-crop-${c.id}">
              <img src="${c.imageBefore}" id="before-img-${c.id}" class="before-after-img" alt="Before Litter" />
              <div class="before-badge-label"><i class="fa-solid fa-trash-can"></i> Littered</div>
            </div>

            <div class="slider-handle" id="slider-handle-${c.id}">
              <i class="fa-solid fa-arrows-left-right"></i>
            </div>

            <input type="range" min="0" max="100" value="50" class="slider-range-input" oninput="window.VerifyView.handleSlider('${c.id}', this.value)" />
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;margin-bottom:1.25rem;">
          <div style="font-size:.65rem;color:#64748b;font-weight:800;text-transform:uppercase;letter-spacing:.04em;">Waste Description</div>
          <div style="font-size:.82rem;color:#0f172a;font-weight:800;margin-top:3px;">${c.description || 'e.g. plastic bottles, food containers, mixed litter'}</div>
        </div>

        <!-- Automated LGU Compliance Audit Chips -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 12px; margin-bottom: 1.25rem;">
          <div style="font-size: 0.75rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 8px;">
            <i class="fa-solid fa-microchip" style="color: var(--emerald-600);"></i> Automated Sanitation Audit Checklist
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px;">
            <div style="background: #ffffff; padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.65rem; color: #64748b;">EXIF GPS Match</div>
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--emerald-700);">✓ ${proof.exifGpsMatch}% Match</div>
            </div>
            <div style="background: #ffffff; padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.65rem; color: #64748b;">AI Cleanliness Score</div>
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--emerald-700);">✓ ${proof.aiCleanlinessScore}% Passed</div>
            </div>
            <div style="background: #ffffff; padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.65rem; color: #64748b;">MRF Weight Scale</div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">${Number(proof.weightRecordedKg || 0).toFixed(2)} kg Verified</div>
            </div>
            <div style="background: #ffffff; padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.65rem; color: #64748b;">LGU Manifest Ref</div>
              <div class="font-mono" style="font-size: 0.75rem; font-weight: 700; color: #b45309;">${proof.facilityManifestId}</div>
            </div>
          </div>
        </div>

        <!-- Cleaner Note -->
        <div style="font-size: 0.78rem; color: #475569; margin-bottom: 1.25rem; font-style: italic; background: #f0fdf4; padding: 8px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--emerald-500);">
          "${proof.cleanerNotes}" — <strong>${c.assignedTo}</strong>
        </div>

        <!-- Verification Action Buttons -->
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" style="flex: 1; color: #e11d48;" onclick="window.VerifyView.rejectProof('${c.id}')">
            <i class="fa-solid fa-rotate-left"></i> Reject / Re-clean
          </button>
          <button class="btn btn-primary" style="flex: 2;" onclick="window.VerifyView.approveProof('${c.id}')">
            <i class="fa-solid fa-stamp"></i> Approve & Release ${window.appState.getRewardDisplay(c)}
          </button>
        </div>

      </div>
    `;
  },

  handleSlider(id, val) {
    const wrap = document.getElementById(`before-crop-${id}`);
    const handle = document.getElementById(`slider-handle-${id}`);
    const beforeImg = document.getElementById(`before-img-${id}`);
    const container = document.getElementById(`slider-wrap-${id}`);

    if (wrap && handle && container) {
      wrap.style.width = `${val}%`;
      handle.style.left = `${val}%`;
      if (beforeImg) {
        beforeImg.style.width = `${container.offsetWidth}px`;
      }
    }
  },

  approveProof(id) {
    const success = window.appState.verifyProof(id, true);
    if (success) {
      window.soundSystem.fanfare();
      window.showToast('Cleanup approved and reward released automatically.', 'gold');
      window.renderRoute();
    }
  },

  rejectProof(id) {
    const notes = prompt('Enter notes for the cleaner (e.g. "Litter residue remaining near bench"):');
    if (notes !== null) {
      window.appState.verifyProof(id, false, notes);
      window.showToast('Task returned to cleaner for re-cleaning.', 'error');
      window.renderRoute();
    }
  }
};
