/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Clean, Friendly & Streamlined Home View Component (White & Green Aesthetic)
 */

window.HomeView = {
  render() {
    const user = window.appState.getUser();

    return `
      <div class="home-view animate-fade-in" style="padding: 1.25rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 720px;">
          
          <!-- Clean & Inspiring Festival Welcome Hero (White / Mint Glow) -->
          <div class="card card-gold-glow" style="
            background: linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%);
            border-radius: var(--radius-xl);
            padding: 2.25rem 1.75rem;
            margin-bottom: 1.5rem;
            text-align: center;
            border: 1px solid #bbf7d0;
            box-shadow: 0 10px 30px -4px rgba(16, 185, 129, 0.12);
          ">
            
            <div style="max-width: 540px; margin: 0 auto;">
              
              <!-- Festival Badge -->
              <div style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; border: 1px solid #fde68a; padding: 5px 14px; border-radius: var(--radius-full); margin-bottom: 1rem;">
                <i class="fa-solid fa-masks-theater" style="color: #b45309;"></i>
                <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">Ibalong Festival 2026 • Legazpi City</span>
              </div>

              <!-- Main Heading -->
              <h1 style="font-size: clamp(1.75rem, 5vw, 2.35rem); font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; color: #0f172a;">
                Keep Legazpi Clean & <span class="gradient-text">Festive</span>
              </h1>
              
              <!-- Simple, Friendly Mission Statement -->
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.75rem;">
                A community-led cleanup initiative for the 2026 Ibalong Festival. Report litter along parade routes, claim cleanup tasks in your area, and help keep our city pristine.
              </p>

              <!-- Two Primary Action Buttons -->
              <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
                <a href="#/report" class="btn btn-gold btn-lg" style="min-width: 190px;" onclick="window.soundSystem.click()">
                  <i class="fa-solid fa-camera"></i> Report Litter
                </a>
                <a href="#/commissions" class="btn btn-primary btn-lg" style="min-width: 190px;" onclick="window.soundSystem.click()">
                  <i class="fa-solid fa-broom"></i> Find Cleanup Tasks
                </a>
              </div>

            </div>
          </div>

          <!-- Section: Select Your Role -->
          <div style="margin-bottom: 1.5rem;">
            <div style="text-align: center; margin-bottom: 1rem;">
              <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">How Would You Like to Help?</h2>
              <p style="font-size: 0.82rem; color: #64748b;">Select a role to start participating in the festival cleanup.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              
              <!-- Resident Role Card -->
              <div class="card ${user.role === 'resident' ? 'card-gold-glow' : ''}" style="padding: 1.25rem 1rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #ffffff;" onclick="window.switchRole('resident')">
                <div>
                  <div style="width: 46px; height: 46px; border-radius: var(--radius-full); background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin: 0 auto 0.75rem auto;">
                    <i class="fa-solid fa-camera"></i>
                  </div>
                  <h3 style="font-size: 1rem; margin-bottom: 4px; color: #0f172a;">Resident</h3>
                  <p style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-bottom: 1rem;">
                    Spot litter during festival activities and pin the location for local cleaners.
                  </p>
                </div>
                <button class="btn btn-sm ${user.role === 'resident' ? 'btn-primary' : 'btn-secondary'}" style="width: 100%; border-radius: var(--radius-full);">
                  ${user.role === 'resident' ? '<i class="fa-solid fa-check"></i> Active Role' : 'Select Resident'}
                </button>
              </div>

              <!-- Cleaner Role Card -->
              <div class="card ${user.role === 'cleaner' ? 'card-gold-glow' : ''}" style="padding: 1.25rem 1rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #ffffff;" onclick="window.switchRole('cleaner')">
                <div>
                  <div style="width: 46px; height: 46px; border-radius: var(--radius-full); background: #dcfce7; color: var(--emerald-600); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin: 0 auto 0.75rem auto;">
                    <i class="fa-solid fa-broom"></i>
                  </div>
                  <h3 style="font-size: 1rem; margin-bottom: 4px; color: #0f172a;">Cleaner</h3>
                  <p style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-bottom: 1rem;">
                    Pick up reported cleanup tasks, clear the area, and upload before/after photos.
                  </p>
                </div>
                <button class="btn btn-sm ${user.role === 'cleaner' ? 'btn-primary' : 'btn-secondary'}" style="width: 100%; border-radius: var(--radius-full);">
                  ${user.role === 'cleaner' ? '<i class="fa-solid fa-check"></i> Active Role' : 'Select Cleaner'}
                </button>
              </div>

              <!-- Verifier Role Card -->
              <div class="card ${user.role === 'verifier' ? 'card-gold-glow' : ''}" style="padding: 1.25rem 1rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #ffffff;" onclick="window.switchRole('verifier')">
                <div>
                  <div style="width: 46px; height: 46px; border-radius: var(--radius-full); background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin: 0 auto 0.75rem auto;">
                    <i class="fa-solid fa-shield-halved"></i>
                  </div>
                  <h3 style="font-size: 1rem; margin-bottom: 4px; color: #0f172a;">Verifier</h3>
                  <p style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-bottom: 1rem;">
                    Inspect photo proofs submitted by cleaners and approve completed work.
                  </p>
                </div>
                <button class="btn btn-sm ${user.role === 'verifier' ? 'btn-primary' : 'btn-secondary'}" style="width: 100%; border-radius: var(--radius-full);">
                  ${user.role === 'verifier' ? '<i class="fa-solid fa-check"></i> Active Role' : 'Select Verifier'}
                </button>
              </div>

            </div>
          </div>

          <!-- Simple Interactive Festival Map Shortcut (Clean White & Emerald) -->
          <div class="card" style="padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h4 style="font-size: 0.95rem; margin-bottom: 2px; color: #0f172a;">Festival Cleanup Map</h4>
                <p style="font-size: 0.78rem; color: #64748b;">View cleanups around Peñaranda Park, Legazpi Boulevard, and Astrodome.</p>
              </div>
            </div>
            <a href="#/commissions" class="btn btn-secondary btn-sm" onclick="window.soundSystem.click()">
              <i class="fa-solid fa-arrow-right"></i> Open Map
            </a>
          </div>

        </div>
      </div>
    `;
  }
};
