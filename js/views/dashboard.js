/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Dashboard & Impact Analytics View Component (White & Green Theme)
 */

window.DashboardView = {
  render() {
    const user = window.appState.getUser();
    const reports = window.appState.getCommissions('all');
    const completed = reports.filter(r => r.status === 'completed');
    const totalBounties = completed.reduce((sum, r) => sum + Number(r.cleanerPayoutPhp || window.appState.getCleanerPayout(r) || r.rewardPhp || 0), 0);
    const totalWaste = completed.reduce((sum, r) => sum + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0), 0);
    const categoryTotals = completed.reduce((acc, r) => { const k = r.category || window.appState.getWasteTypeInfo(r).label; acc[k] = (acc[k] || 0) + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0); return acc; }, {});
    const userReputation = Number(user?.reputationScore || 50);
    const userRepLevel = window.appState.getReputationLevel(userReputation);
    const totalRewardPoints = completed.reduce((sum, r) => sum + Number(r.cleanPoints || 0), 0);
    const wasteDiverted = completed.reduce((sum, r) => sum + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0), 0);
    const cleanlinessScores = completed.map(r => Number(r.proofData?.aiCleanlinessScore)).filter(Number.isFinite);
    const cleanlinessScore = cleanlinessScores.length ? cleanlinessScores.reduce((a,b) => a+b, 0) / cleanlinessScores.length : 0;
    const sectorStats = {};
    completed.forEach(r => { const key = r.sector || 'Unspecified'; sectorStats[key] = (sectorStats[key] || 0) + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0); });
    const wasteCategoryStats = {};
    completed.forEach(r => {
      const key = window.appState.getWasteTypeInfo(r).label;
      wasteCategoryStats[key] = (wasteCategoryStats[key] || 0) + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0);
    });
    const sortedWasteCategories = Object.entries(wasteCategoryStats).sort((a, b) => b[1] - a[1]);

    return `
      <div class="dashboard-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 900px;">

          <!-- Header -->
          <div style="margin-bottom: 1.25rem;">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: var(--emerald-800); padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
              <i class="fa-solid fa-chart-line"></i> Civic Cleantech Intelligence
            </div>
            <h1 style="font-size: 1.4rem; font-weight: 800; margin-top: 6px; color: #0f172a;">Ibalong 2026 Festival Impact</h1>
            <p style="font-size: 0.82rem; color: #64748b;">
              Real-time environmental data across Legazpi City cleanup sectors.
            </p>
          </div>

          <!-- Top Metric Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 1.25rem;">
            <div class="card" style="padding: 1rem; text-align: center; background: #ffffff;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Total Bounties Paid</div>
              <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: #b45309; margin-top: 4px;">₱${totalBounties.toLocaleString()}</div>
              <div style="font-size: 0.65rem; color: var(--emerald-700);">Paid via GCash/Maya</div>
            </div>

            <div class="card" style="padding: 1rem; text-align: center; background: #ffffff;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Clean Points Awarded</div>
              <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: #7e22ce; margin-top: 4px;">${totalRewardPoints.toLocaleString()} pts</div>
              <div style="font-size: 0.65rem; color: #7e22ce;">Paid as points rewards</div>
            </div>

            <div class="card" style="padding: 1rem; text-align: center; background: #ffffff;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Total Waste Cleaned</div>
              <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: var(--emerald-600); margin-top: 4px;">${wasteDiverted.toLocaleString()} kg</div>
              <div style="font-size: 0.65rem; color: var(--emerald-700);">All verified cleanups • all users</div>
            </div>

            <div class="card" style="padding: 1rem; text-align: center; background: #ffffff;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Avg. Turnaround</div>
              <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: #0284c7; margin-top: 4px;">—</div>
              <div style="font-size: 0.65rem; color: #0369a1;">Spot-to-Clean Time</div>
            </div>

            <div class="card" style="padding: 1rem; text-align: center; background: #ffffff;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Cleanliness Score</div>
              <div class="font-mono" style="font-size: 1.35rem; font-weight: 800; color: var(--emerald-600); margin-top: 4px;">${cleanlinessScore ? cleanlinessScore.toFixed(1) : '—'}%</div>
              <div style="font-size: 0.65rem; color: var(--emerald-700);">LGU Audit Verified</div>
            </div>
          </div>

          <!-- Charts Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 1.25rem;">
            
            <!-- Chart 1: Waste by Festival Sector -->
            <div class="card" style="padding: 1.25rem; background: #ffffff;">
              <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-chart-column" style="color: var(--emerald-600);"></i> Waste Diverted by Festival Zone (kg)
              </h3>
              <div style="height: 220px; position: relative;">
                <canvas id="sectorChart"></canvas>
              </div>
            </div>

            <!-- Chart 2: Waste Category Breakdown -->
            <div class="card" style="padding: 1.25rem; background: #ffffff;">
              <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-chart-pie" style="color: #b45309;"></i> Total Waste Cleaned by Category
              </h3>
              <p style="font-size:.68rem;color:#64748b;margin:0 0 .75rem;">Compiled and totalled across all verified users.</p>
              <div style="height: 190px; position: relative;">
                <canvas id="materialChart"></canvas>
              </div>
            </div>

          </div>

          <!-- Global Waste Category Totals -->
          <div class="card" style="padding: 1.25rem; margin-bottom: 1.25rem; background:#ffffff;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:.8rem;">
              <div>
                <h3 style="font-size:1rem;font-weight:800;color:#0f172a;margin:0;"><i class="fa-solid fa-scale-balanced" style="color:var(--emerald-600);"></i> Waste Cleaned by Waste Category</h3>
                <div style="font-size:.7rem;color:#64748b;margin-top:3px;">All users • verified cleanup records only</div>
              </div>
              <div class="font-mono" style="font-size:1rem;font-weight:900;color:var(--emerald-700);">${wasteDiverted.toLocaleString()} kg total</div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
              ${sortedWasteCategories.length ? sortedWasteCategories.map(([label, kg]) => `
                <div style="padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                  <div style="font-size:.7rem;font-weight:900;color:#0f172a;">${label}</div>
                  <div class="font-mono" style="font-size:1rem;font-weight:800;color:var(--emerald-600);margin-top:3px;">${kg.toLocaleString()} kg</div>
                  <div style="font-size:.63rem;color:#64748b;margin-top:2px;">${wasteDiverted ? ((kg / wasteDiverted) * 100).toFixed(1) : '0.0'}% of total</div>
                </div>
              `).join('') : `<div style="grid-column:1/-1;padding:1rem;text-align:center;color:#64748b;font-size:.75rem;">No verified waste records yet.</div>`}
            </div>
          </div>

          <!-- Legazpi Barangay Cleanliness Ranking -->
          <div class="card" style="padding: 1.25rem; background: #ffffff;">
            <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.75rem; color: #0f172a;">
              <i class="fa-solid fa-medal" style="color: #b45309;"></i> Legazpi Barangay Cleanliness Ratings
            </h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${Object.entries(completed.reduce((acc, r) => {
                const key = r.address || r.sector || 'Unspecified';
                const score = Number(r.proofData?.aiCleanlinessScore);
                if (!acc[key]) acc[key] = [];
                if (Number.isFinite(score)) acc[key].push(score);
                return acc;
              }, {}))
              .map(([location, scores]) => ({ location, score: scores.length ? scores.reduce((a,b) => a+b,0)/scores.length : 0 }))
              .sort((a,b) => b.score-a.score)
              .slice(0, 10)
              .map((item, index) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm);">
                  <span style="font-weight: 600; color: #0f172a;">${index + 1}. ${item.location}</span>
                  <span class="font-mono" style="color: var(--emerald-600); font-weight: 800;">${item.score ? item.score.toFixed(1) + '% Clean' : 'No score'}</span>
                </div>
              `).join('') || `
                <div style="padding: 1rem; text-align: center; color: #64748b; font-size: 0.8rem;">
                  No completed cleanup data yet.
                </div>
              `}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:1.25rem;">
            <div class="card" style="padding:1rem;background:#ffffff;border:1px solid #bbf7d0;"><div style="font-size:.68rem;color:#64748b;text-transform:uppercase;font-weight:900;">All-Platform Waste Cleaned</div><div class="font-mono" style="font-size:1.5rem;font-weight:900;color:#047857;margin-top:4px;">${totalWaste.toFixed(2)} kg</div><div style="font-size:.7rem;color:#64748b;margin-top:3px;">All users • verified tasks</div></div>
            <div class="card" style="padding:1rem;background:#ffffff;border:1px solid #e9d5ff;"><div style="font-size:.68rem;color:#7e22ce;text-transform:uppercase;font-weight:900;">Your Reputation</div><div class="font-mono" style="font-size:1.5rem;font-weight:900;color:#7e22ce;margin-top:4px;">${userReputation}/100</div><div style="font-size:.7rem;color:#64748b;margin-top:3px;">${userRepLevel}</div></div>
            <div class="card" style="padding:1rem;background:#ffffff;border:1px solid #fde68a;"><div style="font-size:.68rem;color:#92400e;text-transform:uppercase;font-weight:900;">StreetClean Platform Fees</div><div class="font-mono" style="font-size:1.5rem;font-weight:900;color:#b45309;margin-top:4px;">₱${completed.reduce((sum,r)=>sum+Number(r.platformFeePhp||window.appState.getPlatformFee(r)||0),0).toFixed(2)}</div><div style="font-size:.7rem;color:#64748b;margin-top:3px;">5% of cash task gross rewards</div></div>
          </div>
          <div class="card" style="padding:1.25rem;margin-bottom:1.25rem;background:#ffffff;">
            <h3 style="font-size:1rem;font-weight:800;color:#0f172a;margin-bottom:.75rem;">Total Waste Cleaned by Category — All Users</h3>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1]).map(([category,kg])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;"><span style="font-size:.78rem;font-weight:800;color:#334155;">${category}</span><span class="font-mono" style="font-size:.78rem;font-weight:900;color:#047857;">${Number(kg).toFixed(2)} kg</span></div>`).join('') || '<div style="font-size:.78rem;color:#64748b;">No verified category totals yet.</div>'}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  initCharts() {
    if (!window.Chart) return;

    // Sector Bar Chart
    const ctx1 = document.getElementById('sectorChart')?.getContext('2d');
    if (ctx1) {
      if (window.sectorChartInstance) window.sectorChartInstance.destroy();
      window.sectorChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: Object.keys(window.appState.getCommissions('all').filter(r => r.status === 'completed').reduce((acc, r) => { const k = r.sector || 'Unspecified'; acc[k] = true; return acc; }, {})),
          datasets: [{
            label: 'kg Diverted',
            data: Object.values(window.appState.getCommissions('all').filter(r => r.status === 'completed').reduce((acc, r) => { const k = r.sector || 'Unspecified'; acc[k] = (acc[k] || 0) + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0); return acc; }, {})),
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: '#059669',
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
            }
          }
        }
      });
    }

    // Material Doughnut Chart
    const ctx2 = document.getElementById('materialChart')?.getContext('2d');
    if (ctx2) {
      if (window.materialChartInstance) window.materialChartInstance.destroy();
      window.materialChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: Object.keys(window.appState.getCommissions('all').filter(r => r.status === 'completed').reduce((acc, r) => { const k = window.appState.getWasteTypeInfo(r).label; acc[k] = true; return acc; }, {})),
          datasets: [{
            data: Object.values(window.appState.getCommissions('all').filter(r => r.status === 'completed').reduce((acc, r) => { const k = window.appState.getWasteTypeInfo(r).label; acc[k] = (acc[k] || 0) + Number(r.proofData?.weightRecordedKg || r.estimatedWeightKg || 0); return acc; }, {})),
            backgroundColor: [
              '#059669',
              '#f59e0b',
              '#0284c7',
              '#e11d48',
              '#10b981'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#334155',
                font: { family: 'Plus Jakarta Sans', size: 11 },
                boxWidth: 12
              }
            }
          },
          cutout: '65%'
        }
      });
    }
  }
};
