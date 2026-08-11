/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Verification & Marshall Audit View Component (White & Green Theme)
 */

window.VerifyView = {
  render() {
    const user = window.appState.getUser();
    const pendingReviews = window.appState.getCommissions('in_review');
    const completedCleans = window.appState.getCommissions('completed');

    return `
      <div class="verify-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 800px;">

          <!-- Verifier Status Banner -->
          <div class="card card-gold-glow" style="padding: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-full); background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: #b45309; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">
                  Official LGU Sanitation Audit Hub
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
              <i class="fa-solid fa-clock-rotate-left" style="color: var(--emerald-600);"></i> Recently Verified & Escrow Released
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
                    <span class="font-mono" style="font-weight: 800; color: #b45309; font-size: 0.95rem;">₱${c.rewardPhp}</span>
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
            <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: #b45309;">₱${c.rewardPhp.toFixed(0)}</div>
            <div style="font-size: 0.7rem; color: var(--emerald-700); font-weight: 700;">+${c.cleanPoints} points</div>
          </div>
        </div>

        <!-- Interactive Before / After Split Slider -->
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; margin-bottom: 6px;">
            <span style="color: #e11d48;"><i class="fa-solid fa-arrow-left"></i> Before (Reported Litter)</span>
            <span style="color: #64748b; font-size: 0.7rem;">Drag curtain to inspect</span>
            <span style="color: var(--emerald-700);">After (Pristine Result) <i class="fa-solid fa-arrow-right"></i></span>
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
              <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">${proof.weightRecordedKg} kg Verified</div>
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
            <i class="fa-solid fa-stamp"></i> Approve & Release ₱${c.rewardPhp.toFixed(0)}
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

  async approveProof(id) {
    try {
      await window.appState.verifyProof(id, true);
      window.soundSystem.fanfare();
      window.showToast('Escrow Payout Approved! ₱ Bounty & Clean Points released to cleaner.', 'gold');
      window.renderRoute();
    } catch (err) {
      window.showToast(err.message || 'Could not approve this cleanup.', 'error');
    }
  },

  async rejectProof(id) {
    const notes = prompt('Enter notes for the cleaner (e.g. "Litter residue remaining near bench"):');
    if (notes === null) return;
    try {
      await window.appState.verifyProof(id, false, notes);
      window.showToast('Task returned to cleaner for re-cleaning.', 'error');
      window.renderRoute();
    } catch (err) {
      window.showToast(err.message || 'Could not process this rejection.', 'error');
    }
  }
};
