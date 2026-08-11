/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Report Creation View Component (White & Green Theme)
 */

window.ReportView = {
  currentStep: 1,
  formData: {
    title: '',
    sector: 'Peñaranda Park & Provincial Capitol Grounds',
    address: 'Rizal St, Old Albay District, Legazpi City',
    lat: 13.1398,
    lng: 123.7345,
    category: 'Plastics & Beverage Cups',
    severity: 'high',
    rewardPhp: 500,
    estimatedWeightKg: 25,
    description: '',
    fundingSource: 'civic_pool',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'
  },

  render() {
    const user = window.appState.getUser();

    return `
      <div class="report-view animate-fade-in" style="padding: 1rem 0 2rem 0;">
        <div class="app-container" style="max-width: 600px;">

          <!-- Header -->
          <div style="margin-bottom: 1.25rem;">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: var(--emerald-800); padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
              <i class="fa-solid fa-camera"></i> Resident Reporting Flow
            </div>
            <h1 style="font-size: 1.4rem; font-weight: 800; margin-top: 6px; color: #0f172a;">Report Litter Hotspot</h1>
            <p style="font-size: 0.82rem; color: #64748b;">
              Pin festival litter in Legazpi City, pledge a ₱ bounty, and alert local cleaners.
            </p>
          </div>

          <!-- Wizard Progress Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; background: #ffffff; padding: 8px 14px; border-radius: var(--radius-full); border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--emerald-700);">
              Step ${this.currentStep} of 3: ${this.currentStep === 1 ? 'Location & Zone' : (this.currentStep === 2 ? 'Litter Category' : 'Photo & Bounty')}
            </div>
            <div style="display: flex; gap: 6px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: ${this.currentStep >= 1 ? 'var(--emerald-600)' : '#cbd5e1'};"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: ${this.currentStep >= 2 ? 'var(--emerald-600)' : '#cbd5e1'};"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: ${this.currentStep >= 3 ? 'var(--emerald-600)' : '#cbd5e1'};"></span>
            </div>
          </div>

          <!-- Wizard Form Container -->
          <div class="card card-gold-glow" style="padding: 1.5rem; background: #ffffff;">
            ${this.currentStep === 1 ? this.renderStep1() : ''}
            ${this.currentStep === 2 ? this.renderStep2() : ''}
            ${this.currentStep === 3 ? this.renderStep3(user) : ''}
          </div>

        </div>
      </div>
    `;
  },

  renderStep1() {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">1. Select Festival Zone in Legazpi</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">
          Choose a preset Ibalong Festival zone or drag the GPS pin on the map.
        </p>

        <!-- Festival Hotspot Presets -->
        <div class="form-group">
          <label class="form-label">Festival Hotspot Presets</label>
          <div class="chip-group">
            <button class="chip-select-btn ${this.formData.sector.includes('Peñaranda') ? 'active' : ''}" type="button" onclick="window.ReportView.selectPresetZone('Peñaranda Park & Grandstand', 13.1398, 123.7345)">
              <i class="fa-solid fa-tree"></i> Peñaranda Park
            </button>
            <button class="chip-select-btn ${this.formData.sector.includes('Boulevard') ? 'active' : ''}" type="button" onclick="window.ReportView.selectPresetZone('Legazpi Boulevard Food Strip', 13.1285, 123.7530)">
              <i class="fa-solid fa-water"></i> Legazpi Boulevard
            </button>
            <button class="chip-select-btn ${this.formData.sector.includes('Astrodome') ? 'active' : ''}" type="button" onclick="window.ReportView.selectPresetZone('Albay Astrodome Complex', 13.1465, 123.7410)">
              <i class="fa-solid fa-landmark"></i> Albay Astrodome
            </button>
            <button class="chip-select-btn ${this.formData.sector.includes('Embarcadero') ? 'active' : ''}" type="button" onclick="window.ReportView.selectPresetZone('Embarcadero de Legazpi Boardwalk', 13.1430, 123.7555)">
              <i class="fa-solid fa-ship"></i> Embarcadero Port
            </button>
            <button class="chip-select-btn ${this.formData.sector.includes('Sawangan') ? 'active' : ''}" type="button" onclick="window.ReportView.selectPresetZone('Sawangan Park & Mayon Deck', 13.1320, 123.7510)">
              <i class="fa-solid fa-mountain"></i> Sawangan Park
            </button>
          </div>
        </div>

        <!-- Interactive Map Picker -->
        <div class="form-group">
          <label class="form-label">Pin Location on Map</label>
          <div id="report-location-map" style="height: 220px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid #cbd5e1;"></div>
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <input type="text" class="form-control form-control-sm font-mono" id="report-coords" value="${this.formData.lat.toFixed(4)}, ${this.formData.lng.toFixed(4)}" readonly />
            <button class="btn btn-secondary btn-sm" type="button" onclick="window.ReportView.useCurrentGps()">
              <i class="fa-solid fa-crosshairs"></i> My GPS
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Location Landmark / Specific Address</label>
          <input type="text" class="form-control" id="report-address" value="${this.formData.address}" placeholder="e.g. Near Food Stall #14, Seaside Promenade" />
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
          <button class="btn btn-primary" onclick="window.ReportView.goToStep(2)">
            Next: Waste Details <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStep2() {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">2. Litter Category & Urgency</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Classify the waste so cleaners bring the appropriate gear.
        </p>

        <div class="form-group">
          <label class="form-label">Waste Category</label>
          <div class="chip-group">
            <button class="chip-select-btn ${this.formData.category.includes('Plastics') ? 'active' : ''}" type="button" onclick="window.ReportView.setCategory('Plastics & Beverage Cups')">
              🥤 Plastics & Cups
            </button>
            <button class="chip-select-btn ${this.formData.category.includes('Food') ? 'active' : ''}" type="button" onclick="window.ReportView.setCategory('Food Waste & Skewers')">
              🍢 Food Waste & Skewers
            </button>
            <button class="chip-select-btn ${this.formData.category.includes('Paraphernalia') ? 'active' : ''}" type="button" onclick="window.ReportView.setCategory('Festival Banners & Masks')">
              🎭 Festival Paraphernalia
            </button>
            <button class="chip-select-btn ${this.formData.category.includes('Glass') ? 'active' : ''}" type="button" onclick="window.ReportView.setCategory('Bottles & Glass Debris')">
              🍾 Glass & Bottles
            </button>
            <button class="chip-select-btn ${this.formData.category.includes('Organic') ? 'active' : ''}" type="button" onclick="window.ReportView.setCategory('Mixed Organic & Litter')">
              🍂 Mixed / General
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Urgency / Severity</label>
          <div class="chip-group">
            <button class="chip-select-btn ${this.formData.severity === 'critical' ? 'active' : ''}" type="button" onclick="window.ReportView.setSeverity('critical')">
              🔴 Critical (Blocking Parade)
            </button>
            <button class="chip-select-btn ${this.formData.severity === 'high' ? 'active' : ''}" type="button" onclick="window.ReportView.setSeverity('high')">
              🟠 High (Immediate Attention)
            </button>
            <button class="chip-select-btn ${this.formData.severity === 'medium' ? 'active' : ''}" type="button" onclick="window.ReportView.setSeverity('medium')">
              🟡 Medium (Within 24 Hours)
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Estimated Weight (kg)</label>
          <input type="number" class="form-control" id="report-weight" value="${this.formData.estimatedWeightKg}" min="5" max="500" step="5" />
        </div>

        <div class="form-group">
          <label class="form-label">Description / Notes for Cleaners</label>
          <textarea class="form-control" id="report-desc" placeholder="Describe the scene, any hazards, or best access points...">${this.formData.description}</textarea>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
          <button class="btn btn-secondary" onclick="window.ReportView.goToStep(1)">
            <i class="fa-solid fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-primary" onclick="window.ReportView.goToStep(3)">
            Next: Photo & Bounty <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStep3(user) {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">3. Photo Evidence & ₱ Bounty</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Upload clear before photos of the litter pile and assign a reward.
        </p>

        <!-- Photo Upload -->
        <div class="form-group">
          <label class="form-label">Hotspot Photo Evidence</label>
          <input type="file" accept="image/*" id="report-photo-input" style="display: none;" onchange="window.ReportView.handlePhotoUpload(event)" />
          <div class="upload-dropzone" onclick="document.getElementById('report-photo-input').click()">
            <img src="${this.formData.imageUrl}" alt="Selected hotspot photo" style="width: 100%; max-height: 140px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 6px;" />
            <div style="font-weight: 700; font-size: 0.9rem; color: #0f172a;">Tap to Upload a Photo</div>
            <div style="font-size: 0.72rem; color: #64748b;">JPG/PNG — resized automatically before saving</div>
          </div>

          <div class="upload-preset-gallery">
            <div class="upload-preset-thumb ${this.formData.imageUrl.includes('618477461853') ? 'active' : ''}" onclick="window.ReportView.setPhoto('https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80')">
              <img src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=200&q=80" />
            </div>
            <div class="upload-preset-thumb ${this.formData.imageUrl.includes('605600659873') ? 'active' : ''}" onclick="window.ReportView.setPhoto('https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80')">
              <img src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=200&q=80" />
            </div>
            <div class="upload-preset-thumb ${this.formData.imageUrl.includes('530587191325') ? 'active' : ''}" onclick="window.ReportView.setPhoto('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80')">
              <img src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=200&q=80" />
            </div>
          </div>
        </div>

        <!-- ₱ Bounty Setting -->
        <div class="form-group" style="margin-top: 1rem;">
          <label class="form-label">
            <span>₱ Bounty Reward for Cleaner</span>
            <span class="font-mono" style="color: #b45309; font-weight: 800; font-size: 1.1rem;" id="bounty-val-display">₱${this.formData.rewardPhp}</span>
          </label>
          <input type="range" class="form-control" style="padding: 0; accent-color: var(--emerald-600);" min="300" max="2500" step="50" value="${this.formData.rewardPhp}" oninput="window.ReportView.updateBountyDisplay(this.value)" />
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; margin-top: 4px;">
            <span>₱300 (Standard)</span>
            <span>₱1,200 (Large Arena)</span>
            <span>₱2,500 (Heavy)</span>
          </div>
        </div>

        <!-- Funding Source Selector -->
        <div class="form-group">
          <label class="form-label">Funding Source</label>
          <div style="display: flex; gap: 8px;">
            <div class="card ${this.formData.fundingSource === 'civic_pool' ? 'card-gold-glow' : ''}" style="flex: 1; padding: 10px; cursor: pointer; background: #f8fafc; border: 1px solid #e2e8f0;" onclick="window.ReportView.setFunding('civic_pool')">
              <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a;">🏛️ City Clean Fund</div>
              <div style="font-size: 0.7rem; color: var(--emerald-700);">LGU Sponsored</div>
            </div>
            <div class="card ${this.formData.fundingSource === 'wallet' ? 'card-gold-glow' : ''}" style="flex: 1; padding: 10px; cursor: pointer; background: #f8fafc; border: 1px solid #e2e8f0;" onclick="window.ReportView.setFunding('wallet')">
              <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a;">💳 My Civic Wallet</div>
              <div style="font-size: 0.7rem; color: #b45309;">Bal: ₱${user.phpBalance.toFixed(0)}</div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
          <button class="btn btn-secondary" onclick="window.ReportView.goToStep(2)">
            <i class="fa-solid fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-primary" onclick="window.ReportView.submitReport()">
            <i class="fa-solid fa-paper-plane"></i> Publish Report
          </button>
        </div>
      </div>
    `;
  },

  goToStep(step) {
    if (step === 2) {
      const addr = document.getElementById('report-address')?.value;
      if (addr) this.formData.address = addr;
    }
    if (step === 3) {
      const weight = document.getElementById('report-weight')?.value;
      const desc = document.getElementById('report-desc')?.value;
      if (weight) this.formData.estimatedWeightKg = parseInt(weight);
      if (desc) this.formData.description = desc;
    }

    this.currentStep = step;
    window.renderRoute();

    if (step === 1) {
      setTimeout(() => {
        if (window.MapEngine) {
          window.MapEngine.initReportLocationPicker('report-location-map', (lat, lng) => {
            this.formData.lat = lat;
            this.formData.lng = lng;
            const el = document.getElementById('report-coords');
            if (el) el.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          });
        }
      }, 100);
    }
  },

  selectPresetZone(name, lat, lng) {
    this.formData.sector = name;
    this.formData.address = `${name}, Legazpi City`;
    this.formData.lat = lat;
    this.formData.lng = lng;
    window.renderRoute();
  },

  setCategory(cat) {
    this.formData.category = cat;
    window.renderRoute();
  },

  setSeverity(sev) {
    this.formData.severity = sev;
    window.renderRoute();
  },

  setPhoto(url) {
    this.formData.imageUrl = url;
    window.renderRoute();
  },

  setFunding(source) {
    this.formData.fundingSource = source;
    window.renderRoute();
  },

  updateBountyDisplay(val) {
    this.formData.rewardPhp = parseFloat(val);
    const el = document.getElementById('bounty-val-display');
    if (el) el.innerText = `₱${val}`;
  },

  async handlePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      window.showToast('Processing photo...', 'success');
      this.formData.imageUrl = await window.compressImageToDataUrl(file);
      window.renderRoute();
    } catch (err) {
      window.showToast(err.message || 'Could not process that photo.', 'error');
    }
  },

  useCurrentGps() {
    this.formData.lat = 13.1398;
    this.formData.lng = 123.7345;
    window.showToast('GPS Locked: Legazpi City Hall / Peñaranda Park (±3m accuracy)', 'success');
    window.renderRoute();
  },

  submitReport() {
    const newReport = window.appState.addReport({
      title: `${this.formData.category} at ${this.formData.sector.split('&')[0]}`,
      sector: this.formData.sector,
      address: this.formData.address,
      lat: this.formData.lat,
      lng: this.formData.lng,
      category: this.formData.category,
      severity: this.formData.severity,
      rewardPhp: this.formData.rewardPhp,
      estimatedWeightKg: this.formData.estimatedWeightKg,
      description: this.formData.description || `Reported ${this.formData.category} during festival festivities.`,
      fundingSource: this.formData.fundingSource,
      imageUrl: this.formData.imageUrl
    });

    window.soundSystem.success();
    window.showToast(`Hotspot ${newReport.id} successfully published! Bounties unlocked for cleaners.`, 'success');
    this.currentStep = 1;
    window.location.hash = '#/commissions';
  }
};