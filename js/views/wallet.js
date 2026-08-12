/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Wallet & Earnings View Component (White & Green Theme)
 */

window.WalletView = {
  render() {
    const user = window.appState.getUser();
    const transactions = window.appState.getTransactions();

    return `
      <div class="wallet-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 800px;">

          <!-- Wallet Master Balance Card (Crisp White with Mint Glow) -->
          <div class="card card-gold-glow" style="
            background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
            border-radius: var(--radius-xl);
            padding: 1.75rem 1.5rem;
            margin-bottom: 1.25rem;
            border: 1px solid #bbf7d0;
            box-shadow: var(--shadow-md);
          ">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div class="brand-icon" style="width: 32px; height: 32px; font-size: 0.95rem;">
                    <i class="fa-solid fa-vault"></i>
                  </div>
                  <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">Ibalong Civic Wallet</span>
                </div>
                <span class="status-badge status-completed"><i class="fa-solid fa-link"></i> ${user.payoutProvider} Connected</span>
              </div>

              <div style="margin-bottom: 1.25rem;">
                <div style="font-size: 0.78rem; color: var(--emerald-800); text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Available Cashout Balance</div>
                <div class="font-mono" style="font-size: clamp(2rem, 5vw, 2.75rem); font-weight: 800; color: #b45309; line-height: 1.1; margin-top: 4px;">
                  ₱${user.phpBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                  + <strong style="color: var(--emerald-700);">${user.cleanPoints.toLocaleString()}</strong> Ibalong Clean Points
                </div>
              </div>

              <!-- Quick Stats Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 1.25rem; background: #ffffff; padding: 10px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
                <div>
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Cleans Completed</div>
                  <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: var(--emerald-600);">${user.stats.completedCleans} Sites</div>
                </div>
                <div>
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Total Waste Diverted</div>
                  <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: #b45309;">${user.stats.kgRecycled} kg</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-gold btn-sm" onclick="window.WalletView.openWithdrawModal()">
                  <i class="fa-solid fa-money-bill-transfer"></i> Cashout via ${user.payoutProvider}
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.showToast('Linked GCash / Maya account: ' + window.appState.getUser().payoutAccount, 'gold')">
                  <i class="fa-solid fa-gear"></i> Payment Settings
                </button>
              </div>
            </div>
          </div>

          <!-- Partner Rewards -->
          <div class="card partner-rewards-card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%); border: 1px solid #e9d5ff;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:1rem;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="brand-icon" style="width:32px;height:32px;font-size:.9rem;background:#f3e8ff;color:#7e22ce;"><i class="fa-solid fa-gift"></i></div>
                  <h3 style="font-size:1rem;font-weight:800;color:#0f172a;margin:0;">Partner Rewards</h3>
                </div>
                <div style="font-size:.72rem;color:#64748b;margin-top:5px;">Use your accumulated Ibalong Clean Points to claim partner perks.</div>
              </div>
              <div style="padding:6px 10px;border-radius:999px;background:#f3e8ff;color:#7e22ce;font-weight:800;font-size:.72rem;white-space:nowrap;">${user.cleanPoints.toLocaleString()} pts</div>
            </div>
            <div class="partner-reward-grid">
              ${window.WalletView.partnerRewards.map(reward => {
                const canClaim = user.cleanPoints >= reward.points;
                return `
                  <div class="partner-reward-card">
                    <div class="partner-reward-icon" style="background:${reward.bg};color:${reward.color};"><i class="fa-solid ${reward.icon}"></i></div>
                    <div style="flex:1;min-width:0;">
                      <div style="font-size:.65rem;color:#64748b;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${reward.partner}</div>
                      <div style="font-weight:800;color:#0f172a;font-size:.86rem;margin:2px 0;">${reward.name}</div>
                      <div style="font-size:.7rem;color:#7e22ce;font-weight:800;">${reward.points.toLocaleString()} pts</div>
                    </div>
                    <button class="btn btn-sm ${canClaim ? 'btn-secondary' : ''}" ${canClaim ? `onclick="window.WalletView.claimPartnerReward('${reward.id}')"` : 'disabled'} style="white-space:nowrap;">${canClaim ? 'Claim' : 'Need points'}</button>
                  </div>`;
              }).join('')}
            </div>
            <div style="font-size:.65rem;color:#94a3b8;margin-top:.75rem;">Partner reward names and point costs are configurable for your confirmed sponsors.</div>
          </div>

          <!-- Ibalong Festival 2026 Eco-Warrior Leaderboard -->
          <div class="card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-trophy" style="color: #b45309;"></i> Ibalong 2026 Waste Collection Leaderboard
              </h3>
              <span style="font-size: 0.75rem; color: #b45309; font-weight: 700;">Ranked by Waste Collected</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${window.appState.getAllUsersList()
                .filter(u => Number(u.stats?.kgRecycled || 0) > 0)
                .sort((a, b) => Number(b.stats?.kgRecycled || 0) - Number(a.stats?.kgRecycled || 0))
                .slice(0, 10)
                .map((u, index) => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-sm); background: ${u.id === user.id ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${u.id === user.id ? '#a7f3d0' : '#e2e8f0'};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-weight: 800; font-size: 1rem; color: ${index === 0 ? '#b45309' : '#64748b'};">#${index + 1}</span>
                      <img src="${u.avatar}" alt="${u.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                      <div>
                        <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${u.name}${u.id === user.id ? ' (You)' : ''}</div>
                        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:3px;">
                          <span style="font-size: 0.7rem; color: #64748b;">${u.barangay || 'Barangay not set'} • ${u.stats.completedCleans || 0} Cleans</span>
                        </div>
                      </div>
                    </div>
                    <div style="display:flex;align-items:flex-end;gap:8px;flex-direction:column;text-align:right;">
                      ${(() => {
                        const kg = Number(u.stats?.kgRecycled || 0);
                        const earned = getWasteBadges(kg);
                        const badge = earned.length ? earned[earned.length - 1] : null;
                        return badge
                          ? `<span title="${badge.desc}" style="display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:${badge.color === 'gold' ? '#fffbeb' : '#f0fdf4'};border:1px solid ${badge.color === 'gold' ? '#fde68a' : '#bbf7d0'};color:${badge.color === 'gold' ? '#a16207' : '#166534'};font-size:.62rem;font-weight:900;white-space:nowrap;"><i class="fa-solid ${badge.icon}"></i>${badge.name}</span>`
                          : `<span style="display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:#f8fafc;border:1px solid #e2e8f0;color:#94a3b8;font-size:.62rem;font-weight:800;white-space:nowrap;"><i class="fa-solid fa-lock"></i>No badge yet</span>`;
                      })()}
                      <div class="font-mono" style="font-weight: 900; color: ${u.id === user.id ? 'var(--emerald-700)' : '#475569'}; font-size: 0.95rem;">${Number(u.stats?.kgRecycled || 0).toFixed(2)} kg</div>
                      <div style="font-size:.62rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">waste collected</div>
                    </div>
                  </div>
                `).join('') || `
                  <div style="padding: 1rem; text-align: center; color: #64748b; font-size: 0.8rem;">
                    No cleaner accounts yet.
                  </div>
                `}
            </div>
          </div>

          <!-- Transaction Ledger -->
          <div class="card" style="padding: 1.25rem; background: #ffffff;">
            <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.75rem; color: #0f172a;">
              <i class="fa-solid fa-receipt" style="color: var(--emerald-600);"></i> Transaction & Payout Ledger
            </h3>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${transactions.map(tx => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: ${tx.points < 0 ? '#f3e8ff' : (tx.amountPhp > 0 ? '#dcfce7' : '#fee2e2')}; color: ${tx.points < 0 ? '#7e22ce' : (tx.amountPhp > 0 ? 'var(--emerald-700)' : '#e11d48')}; display: flex; align-items: center; justify-content: center; font-size: 1rem;">
                      <i class="fa-solid ${tx.points < 0 ? 'fa-gift' : (tx.amountPhp > 0 ? 'fa-arrow-down-left' : 'fa-arrow-up-right')}"></i>
                    </div>
                    <div>
                      <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${tx.title}</div>
                      <div style="font-size: 0.7rem; color: #64748b;">${tx.date} at ${tx.time} • ${tx.channel}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div class="font-mono" style="font-weight: 800; font-size: 0.95rem; color: ${tx.points < 0 ? '#7e22ce' : (tx.amountPhp > 0 ? 'var(--emerald-700)' : '#64748b')};">
                      ${tx.points < 0 ? `-${Math.abs(tx.points).toLocaleString()} pts` : (tx.amountPhp > 0 ? `+₱${Number(tx.amountPhp).toFixed(2)}` : `${Number(tx.points || 0).toLocaleString()} pts`)}
                    </div>
                    <span class="status-badge status-completed" style="font-size: 0.65rem; padding: 2px 6px;">Completed</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  partnerRewards: [
    { id: 'eco-100', partner: 'EcoMart', name: '₱100 Eco Voucher', points: 500, icon: 'fa-basket-shopping', bg: '#ecfdf5', color: '#047857' },
    { id: 'green-meal', partner: 'GreenBite', name: '₱150 Green Meal Voucher', points: 750, icon: 'fa-utensils', bg: '#fef3c7', color: '#b45309' },
    { id: 'cycle-pass', partner: 'CycleHub', name: '1-Day Bike Pass', points: 600, icon: 'fa-bicycle', bg: '#eff6ff', color: '#1d4ed8' },
    { id: 'recycle-kit', partner: 'GreenCycle', name: 'Recycling Starter Kit', points: 900, icon: 'fa-recycle', bg: '#f3e8ff', color: '#7e22ce' }
  ],

  async claimPartnerReward(id) {
    const reward = this.partnerRewards.find(r => r.id === id);
    if (!reward) return;
    const user = window.appState.getUser();
    if (!user || user.cleanPoints < reward.points) {
      window.showToast('You need more Clean Points for this reward.', 'error');
      return;
    }
    const redemption = await window.appState.redeemPartnerReward(reward);
    if (redemption) {
      window.soundSystem.fanfare();
      window.showToast(`${reward.name} claimed from ${reward.partner}! ${reward.points.toLocaleString()} points redeemed.`, 'gold');
      window.renderRoute();
    }
  },

  openWithdrawModal() {
    const user = window.appState.getUser();
    const modalHtml = `
      <div class="modal-card">
        <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <div class="brand-icon" style="width: 44px; height: 44px; margin: 0 auto 0.5rem auto; font-size: 1.25rem;">
            <i class="fa-solid fa-money-bill-transfer"></i>
          </div>
          <h2 style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">Instant Cashout</h2>
          <p style="font-size: 0.78rem; color: #64748b;">Transfer your earned festival bounties instantly to GCash / Maya.</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 12px; margin-bottom: 1.25rem; text-align: center;">
          <div style="font-size: 0.7rem; color: #166534;">Available Balance</div>
          <div class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #b45309;">₱${user.phpBalance.toFixed(2)}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Cashout Amount (₱)</label>
          <input type="number" class="form-control font-mono" id="withdraw-amt" value="${user.phpBalance > 500 ? 500 : user.phpBalance}" min="100" max="${user.phpBalance}" step="100" />
        </div>

        <div class="form-group">
          <label class="form-label">Payout Channel</label>
          <select class="form-control" id="withdraw-provider">
            <option value="GCash" ${user.payoutProvider === 'GCash' ? 'selected' : ''}>GCash${user.payoutProvider === 'GCash' && user.payoutAccount ? ` (${user.payoutAccount})` : ''}</option>
            <option value="Maya" ${user.payoutProvider === 'Maya' ? 'selected' : ''}>Maya${user.payoutProvider === 'Maya' && user.payoutAccount ? ` (${user.payoutAccount})` : ''}</option>
            <option value="LandBank">LandBank PesoNet</option>
          </select>
        </div>

        <button class="btn btn-gold btn-block" style="margin-top: 1rem;" onclick="window.WalletView.executeWithdrawal()">
          <i class="fa-solid fa-bolt"></i> Confirm Instant Cashout
        </button>
      </div>
    `;
    window.openModal(modalHtml);
  },

  executeWithdrawal() {
    const amt = parseFloat(document.getElementById('withdraw-amt')?.value || 0);
    const provider = document.getElementById('withdraw-provider')?.value || 'GCash';

    if (amt <= 0) {
      window.showToast('Please enter a valid cashout amount.', 'error');
      return;
    }

    const success = window.appState.withdraw(amt, provider);
    if (success) {
      window.soundSystem.fanfare();
      window.closeModal();
      window.showToast(`₱${amt.toFixed(2)} sent directly to your ${provider} account! Reference: WD-${Date.now().toString().slice(-6)}`, 'gold');
      window.renderRoute();
    } else {
      window.showToast('Insufficient wallet balance.', 'error');
    }
  }
};
