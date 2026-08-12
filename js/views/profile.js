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

            <!-- Role Switch Quick Buttons -->
            <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
              <button class="btn ${user.role === 'resident' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchRole('resident')">
                <i class="fa-solid fa-camera"></i> Resident
              </button>
              <button class="btn ${user.role === 'cleaner' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.switchRole('cleaner')">
                <i class="fa-solid fa-broom"></i> Cleaner
              </button>
              <button class="btn ${user.role === 'verifier' ? 'btn-gold' : 'btn-secondary'} btn-sm" onclick="window.switchRole('verifier')">
                <i class="fa-solid fa-shield-halved"></i> Verifier
              </button>
            </div>
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
              <i class="fa-solid fa-award" style="color: #b45309;"></i> Garbage Collection Badges
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              ${WASTE_BADGES.map(b => {
                const unlocked = Number(user.stats?.kgRecycled || 0) >= b.threshold;
                return `
                <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--radius-md);background:${unlocked ? (b.color === 'gold' ? '#fffbeb' : '#f0fdf4') : '#f8fafc'};border:1px solid ${unlocked ? (b.color === 'gold' ? '#fde68a' : '#bbf7d0') : '#e2e8f0'};opacity:${unlocked ? '1' : '.72'};">
                  <div style="position:relative;width:40px;height:40px;flex:0 0 40px;border-radius:var(--radius-sm);background:${unlocked ? (b.color === 'gold' ? '#fef3c7' : '#dcfce7') : '#e2e8f0'};color:${unlocked ? (b.color === 'gold' ? '#b45309' : 'var(--emerald-700)') : '#94a3b8'};display:flex;align-items:center;justify-content:center;font-size:1.1rem;">
                    <i class="fa-solid ${b.icon}"></i>
                    ${unlocked ? '<span style="position:absolute;right:-5px;bottom:-5px;width:17px;height:17px;border-radius:50%;background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.55rem;border:2px solid #fff;"><i class="fa-solid fa-check"></i></span>' : ''}
                  </div>
                  <div style="min-width:0;flex:1;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <span style="font-weight:800;font-size:.85rem;color:#0f172a;">${b.name}</span>
                      <span style="font-size:.62rem;font-weight:900;color:${unlocked ? '#166534' : '#64748b'};background:${unlocked ? '#dcfce7' : '#e2e8f0'};padding:2px 6px;border-radius:999px;text-transform:uppercase;">${unlocked ? 'Earned' : 'Locked'}</span>
                    </div>
                    <div style="font-size:.7rem;color:#64748b;">${b.desc}</div>
                    <div style="font-size:.62rem;font-weight:800;color:#94a3b8;margin-top:2px;">${b.threshold} kg milestone</div>
                  </div>
                </div>`;
              }).join('')}
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