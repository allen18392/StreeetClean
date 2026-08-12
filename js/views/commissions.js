/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Commissions & Task Dashboard View Component (White & Green Theme)
 */

window.CommissionsView = {
  activeFilter: 'all',
  activeView: 'grid',

  render() {
    const user = window.appState.getUser();
    const commissions = window.appState.getCommissions(this.activeFilter);
    const openCount = window.appState.getCommissions('open').length;
    const activeCount = window.appState.getCommissions('in_progress').length;
    const reviewCount = window.appState.getCommissions('in_review').length;
    const pendingBountyCount = window.appState.getCommissions('pending_bounty').length;

    return `
      <div class="commissions-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 900px;">

          <!-- Cleaner Top Earnings & Status Bar -->
          <div class="card card-gold-glow" style="padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i class="fa-solid fa-broom"></i>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: var(--emerald-800); text-transform: uppercase; font-weight: 800;">Active Cleaner Dashboard</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${user.name} • <span style="color: #b45309;">${user.barangay.split(',')[0]}</span></div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 14px;">
              <div>
                <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">Available Balance</div>
                <div class="font-mono" style="font-size: 1.15rem; font-weight: 800; color: #b45309;">₱${user.phpBalance.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <!-- Controls Header: Filter Tabs & View Switcher -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 1.25rem;">
            
            <!-- Filter Pills -->
            <div class="chip-group" style="overflow-x: auto; max-width: 100%; padding-bottom: 4px;">
              <button class="chip-select-btn ${this.activeFilter === 'all' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('all')">
                All (${window.appState.commissions.length})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'open' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('open')">
                🟡 Open Tasks (${openCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'pending_bounty' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('pending_bounty')">
                🟣 Awaiting LGU Reward (${pendingBountyCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'in_progress' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('in_progress')">
                🔵 Claimed / Active (${activeCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'in_review' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('in_review')">
                🟠 In Review (${reviewCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'completed' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('completed')">
                🟢 Verified & Paid
              </button>
            </div>

            <!-- Grid vs Map Toggle -->
            <div style="display: inline-flex; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: var(--radius-full); padding: 2px;">
              <button class="btn btn-sm ${this.activeView === 'grid' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; border-radius: var(--radius-full);" onclick="window.CommissionsView.setView('grid')">
                <i class="fa-solid fa-table-cells"></i> Cards
              </button>
              <button class="btn btn-sm ${this.activeView === 'map' ? 'btn-gold' : 'btn-secondary'}" style="padding: 4px 10px; border-radius: var(--radius-full);" onclick="window.CommissionsView.setView('map')">
                <i class="fa-solid fa-map-location-dot"></i> Map
              </button>
            </div>

          </div>

          <!-- Main Content Area (Grid or Map) -->
          ${this.activeView === 'map' ? this.renderMapView() : this.renderGridView(commissions)}

        </div>
      </div>
    `;
  },

  renderGridView(commissions) {
    if (!commissions.length) {
      return `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem; background: #ffffff;">
          <div style="font-size: 2.5rem; color: var(--emerald-600); margin-bottom: 0.5rem;"><i class="fa-solid fa-broom-ball"></i></div>
          <h3 style="font-size: 1.1rem; margin-bottom: 6px; color: #0f172a;">No Cleanups In This Category</h3>
          <p style="font-size: 0.8rem; color: #64748b; max-width: 320px; margin: 0 auto 1.25rem auto;">
            All hotspots here have been cleared, or none have been submitted yet.
          </p>
          <a href="#/report" class="btn btn-gold btn-sm"><i class="fa-solid fa-camera"></i> Report New Hotspot</a>
        </div>
      `;
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
        ${commissions.map(c => this.renderCard(c)).join('')}
      </div>
    `;
  },

  renderCard(c) {
    const wasteType = window.appState.getWasteTypeInfo(c);
    return `
      <div class="card task-card" style="background: #ffffff;" onclick="window.openTaskModal('${c.id}')">
        <div class="task-card-header">
          <div class="task-card-status-group">
            ${c.status === 'pending_bounty'
              ? '<span class="task-card-pending-badge"><span class="badge-dot"></span> Pending Bounty</span>'
              : `<span class="status-badge status-${c.status}"><span class="badge-dot"></span> ${c.status.replace('_', ' ')}</span>`}
            <span class="severity-pill ${c.severity}">${c.severity}</span>
          </div>
          <div class="task-card-bounty ${window.appState.getRewardAmount(c) > 0 ? '' : 'is-tba'}">
            ${window.appState.getRewardDisplay(c)}
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 9px 0;">
          <span style="display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;background:${wasteType.bg};color:${wasteType.color};border:1px solid ${wasteType.border};font-size:.69rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;">
            <span style="font-size:.9rem;">${wasteType.icon}</span> ${wasteType.label}
          </span>
          <span style="font-size:.68rem;color:#64748b;font-weight:700;">Waste handling</span>
        </div>

        <div class="task-card-img-wrap">
          <img src="${c.imageBefore}" class="task-card-img" alt="${c.title}" />

        </div>

        <div>
          <h3 style="font-size: 0.96rem; font-weight: 800; margin-bottom: 4px; line-height: 1.35; color: #0f172a;">
            ${c.title}
          </h3>
          <p style="font-size: 0.76rem; color: #64748b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${c.description}
          </p>
        </div>

        <div class="task-card-meta">
          <div>
            <i class="fa-solid fa-weight-hanging" style="color: var(--emerald-600);"></i> ~${Number(c.estimatedWeightKg || 0).toFixed(2)} kg
          </div>
        </div>
      </div>
    `;
  },

  renderMapView() {
    setTimeout(() => {
      if (window.MapEngine) {
        window.MapEngine.initCommissionsMap('commissions-map-canvas', window.appState.getCommissions(this.activeFilter));
      }
    }, 100);

    return `
      <div class="card" style="padding: 0.75rem; background: #ffffff; border-radius: var(--radius-xl); overflow: hidden;">
        <div id="commissions-map-canvas" style="width: 100%; height: 500px; border-radius: var(--radius-lg); z-index: 10;"></div>
      </div>
    `;
  },

  setFilter(filter) {
    this.activeFilter = filter;
    window.renderRoute();
  },

  setView(view) {
    this.activeView = view;
    window.renderRoute();
  }
};
