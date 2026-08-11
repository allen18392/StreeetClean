/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * User Profile & Operator Identity View Component (White & Green Theme)
 */

window.ProfileView = {
  render() {
    const user = window.appState.getUser();

    return `
      <div class="profile-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 680px;">

          <!-- Profile Hero Card -->
          <div class="card card-gold-glow" style="padding: 1.5rem; text-align: center; margin-bottom: 1.25rem; background: #ffffff; border: 1px solid #bbf7d0;">
            <img src="${user.avatar}" alt="${user.name}" style="width: 84px; height: 84px; border-radius: var(--radius-full); object-fit: cover; border: 3px solid var(--emerald-500); margin: 0 auto 0.75rem auto; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);" />
            
            <h1 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 2px; color: #0f172a;">${user.name}</h1>
            <div style="font-size: 0.8rem; font-weight: 800; color: #b45309; text-transform: uppercase; font-family: var(--font-mono); margin-bottom: 6px;">
              ${user.roleTitle}
            </div>
            <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 1.25rem;">
              <i class="fa-solid fa-location-dot" style="color: var(--emerald-600);"></i> ${user.barangay}
            </div>

            <!-- Role badge + cleaner application -->
            <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
              <span class="btn ${user.role === 'verifier' ? 'btn-gold' : 'btn-primary'} btn-sm" style="pointer-events: none;">
                <i class="fa-solid ${user.role === 'cleaner' ? 'fa-broom' : user.role === 'verifier' ? 'fa-shield-halved' : 'fa-camera'}"></i>
                ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              ${user.role === 'resident' ? `
                <button class="btn btn-secondary btn-sm" onclick="window.applyForCleaner()" ${user.cleanerApplicationStatus === 'pending' ? 'disabled' : ''}>
                  <i class="fa-solid fa-broom"></i> ${user.cleanerApplicationStatus === 'pending' ? 'Cleaner Application Pending' : 'Apply to be a Cleaner'}
                </button>
              ` : ''}
            </div>
            <p style="font-size: 0.72rem; color: #94a3b8; margin-top: 8px;">
              Roles are granted by festival admins — Cleaner via application review, Verifier by direct assignment.
            </p>
          </div>

          <!-- Impact Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.25rem;">
            <div class="card" style="padding: 12px; text-align: center; background: #ffffff;">
              <div style="font-size: 0.68rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Completed</div>
              <div class="font-mono" style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-top: 2px;">${user.stats.completedCleans}</div>
            </div>
            <div class="card" style="padding: 12px; text-align: center; background: #ffffff;">
              <div style="font-size: 0.68rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Waste Diverted</div>
              <div class="font-mono" style="font-size: 1.2rem; font-weight: 800; color: var(--emerald-600); margin-top: 2px;">${user.stats.kgRecycled} kg</div>
            </div>
            <div class="card" style="padding: 12px; text-align: center; background: #ffffff;">
              <div style="font-size: 0.68rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Verification Rate</div>
              <div class="font-mono" style="font-size: 1.2rem; font-weight: 800; color: var(--emerald-600); margin-top: 2px;">${user.stats.verificationRate}%</div>
            </div>
          </div>

          <!-- Earned Badges & Honors -->
          <div class="card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: #ffffff;">
            <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.75rem; color: #0f172a;">
              <i class="fa-solid fa-award" style="color: #b45309;"></i> Ibalong 2026 Civic Badges & Certifications
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              ${user.badges.map(b => `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: ${b.color === 'gold' ? '#fef3c7' : '#dcfce7'}; color: ${b.color === 'gold' ? '#b45309' : 'var(--emerald-700)'}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                    <i class="fa-solid ${b.icon}"></i>
                  </div>
                  <div>
                    <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${b.name}</div>
                    <div style="font-size: 0.7rem; color: #64748b;">${b.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Certified Gear & Tools -->
          <div class="card" style="padding: 1.25rem; background: #ffffff;">
            <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.75rem; color: #0f172a;">
              <i class="fa-solid fa-toolbox" style="color: var(--emerald-600);"></i> Assigned Sanitation Equipment
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${user.gear.map(g => `
                <span style="font-size: 0.78rem; font-weight: 700; color: #166534; background: #dcfce7; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: var(--radius-full);">
                  <i class="fa-solid fa-check" style="color: var(--emerald-700); font-size: 0.7rem;"></i> ${g}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Sign Out -->
          <div class="card" style="padding: 1rem 1.25rem; background: #ffffff; margin-top: 1.25rem;">
            <button class="btn btn-secondary btn-block" style="color: #e11d48; border-color: #fecaca;" onclick="window.logoutUser()">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </button>
          </div>

        </div>
      </div>
    `;
  }
};