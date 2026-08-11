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
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Locked in Escrow</div>
                  <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: #0284c7;">₱${user.escrowLockedPhp.toFixed(2)}</div>
                </div>
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

          <!-- Ibalong Festival 2026 Eco-Warrior Leaderboard -->
          <div class="card" style="margin-bottom: 1.25rem; padding: 1.25rem; background: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-trophy" style="color: #b45309;"></i> Ibalong 2026 Eco-Warrior Leaderboard
              </h3>
              <span style="font-size: 0.75rem; color: #b45309; font-weight: 700;">Top Festival Cleaners</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              
              <!-- Rank 1 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-sm); background: #fef3c7; border: 1px solid #fde68a;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-weight: 800; font-size: 1.1rem; color: #b45309;">🥇 #1</span>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">Eduardo Ramos</div>
                    <div style="font-size: 0.7rem; color: #64748b;">Barangay Puro • 52 Cleans</div>
                  </div>
                </div>
                <div class="font-mono" style="font-weight: 800; color: #b45309; font-size: 0.9rem;">₱18,450</div>
              </div>

              <!-- Rank 2 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-sm); background: #ecfdf5; border: 1px solid #a7f3d0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-weight: 800; font-size: 1.1rem; color: var(--emerald-700);">🥈 #2</span>
                  <img src="${user.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--emerald-500);" />
                  <div>
                    <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${user.name} (You)</div>
                    <div style="font-size: 0.7rem; color: var(--emerald-700);">${user.barangay.split(',')[0]} • ${user.stats.completedCleans} Cleans</div>
                  </div>
                </div>
                <div class="font-mono" style="font-weight: 800; color: var(--emerald-700); font-size: 0.9rem;">₱${user.phpBalance.toFixed(0)}</div>
              </div>

              <!-- Rank 3 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-sm); background: #f8fafc; border: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-weight: 800; font-size: 1.1rem; color: #94a3b8;">🥉 #3</span>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">Teresa Morales</div>
                    <div style="font-size: 0.7rem; color: #64748b;">Barangay Bitano • 38 Cleans</div>
                  </div>
                </div>
                <div class="font-mono" style="font-weight: 800; color: #475569; font-size: 0.9rem;">₱12,800</div>
              </div>

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
                    <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: ${tx.amountPhp > 0 ? '#dcfce7' : '#fee2e2'}; color: ${tx.amountPhp > 0 ? 'var(--emerald-700)' : '#e11d48'}; display: flex; align-items: center; justify-content: center; font-size: 1rem;">
                      <i class="fa-solid ${tx.amountPhp > 0 ? 'fa-arrow-down-left' : 'fa-arrow-up-right'}"></i>
                    </div>
                    <div>
                      <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${tx.title}</div>
                      <div style="font-size: 0.7rem; color: #64748b;">${tx.date} at ${tx.time} • ${tx.channel}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div class="font-mono" style="font-weight: 800; font-size: 0.95rem; color: ${tx.amountPhp > 0 ? 'var(--emerald-700)' : '#e11d48'};">
                      ${tx.amountPhp > 0 ? '+' : ''}₱${Math.abs(tx.amountPhp).toFixed(2)}
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
            <option value="GCash">GCash (0928-551-3941 - Maria Bataller)</option>
            <option value="Maya">Maya (0917-882-1920)</option>
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
