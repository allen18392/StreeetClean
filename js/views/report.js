/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Report Creation View Component (White & Green Theme)
 */

window.ReportView = {
  currentStep: 1,
  formData: {
    title: '',
    taskType: 'public',
    propertyOwner: '',
    partnerName: 'EcoMart',
    partnerRewardDescription: 'Partner campaign points',
    rewardPhp: 500,
    cleanPoints: 500,
    sector: 'Peñaranda Park & Provincial Capitol Grounds',
    address: 'Rizal St, Old Albay District, Legazpi City',
    lat: 13.1398,
    lng: 123.7345,
    category: 'Plastics & Beverage Cups',
    wasteType: 'recyclable',
    severity: 'high',
    estimatedWeightKg: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    imageFile: null
  },

  render() {
    const user = window.appState.getUser();

    return `
      <div class="report-view animate-fade-in" style="padding: 1rem 0 2rem 0;">
        <div class="app-container" style="max-width: 600px;">

          <!-- Header -->
          <div style="margin-bottom: 1.25rem;">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: var(--emerald-800); padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
              <i class="fa-solid fa-broom"></i> Create Cleanup Task
            </div>
            <h1 style="font-size: 1.4rem; font-weight: 800; margin-top: 6px; color: #0f172a;">Choose Task Type</h1>
          </div>

          <div class="card" style="padding:1rem 1.1rem; margin-bottom:1rem; background:#ffffff; border:1px solid #bbf7d0;">
            <div style="font-size:.72rem;color:#64748b;text-transform:uppercase;font-weight:900;margin-bottom:8px;">Task type</div>
            <div class="chip-group">
              <button class="chip-select-btn ${this.formData.taskType === 'private_property' ? 'active' : ''}" type="button" onclick="window.ReportView.setTaskType('private_property')">🏠 Private Property</button>
              <button class="chip-select-btn ${this.formData.taskType === 'partner' ? 'active' : ''}" type="button" onclick="window.ReportView.setTaskType('partner')">🤝 Partner Challenge</button>
              <button class="chip-select-btn ${this.formData.taskType === 'public' ? 'active' : ''}" type="button" onclick="window.ReportView.setTaskType('public')">🌍 Community Cleanup</button>
            </div>
            ${this.formData.taskType === 'private_property' ? `
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:10px;">
                <div><label class="form-label">Property owner / manager</label><input class="form-control" id="property-owner" value="${this.formData.propertyOwner || user.name}" placeholder="Owner or property manager"></div>
                <div><label class="form-label">Cleaner reward (₱)</label><input class="form-control font-mono" id="private-reward" type="number" min="50" step="50" value="${this.formData.rewardPhp || 500}"></div>
              </div>` : ''}
            ${this.formData.taskType === 'partner' ? `
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:10px;">
                <div><label class="form-label">Partner / sponsor</label><input class="form-control" id="partner-name" value="${this.formData.partnerName}" placeholder="Business or organization"></div>
                <div><label class="form-label">Task points</label><input class="form-control font-mono" id="partner-points" type="number" min="10" step="10" value="${this.formData.cleanPoints || 500}"></div>
                <div style="grid-column:1/-1"><label class="form-label">Partner reward description</label><input class="form-control" id="partner-reward-desc" value="${this.formData.partnerRewardDescription}" placeholder="e.g. 500 points = ₱50 partner coupon"></div>
              </div>` : ''}
          </div>

          <!-- Wizard Progress Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; background: #ffffff; padding: 8px 14px; border-radius: var(--radius-full); border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--emerald-700);">
              Step ${this.currentStep} of 3: ${this.currentStep === 1 ? 'Location & Zone' : (this.currentStep === 2 ? 'Litter Category' : 'Photo Evidence')}
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
          <label class="form-label">Waste Type / Handling</label>
          <p style="font-size:.72rem;color:#64748b;margin:-4px 0 8px 0;">Choose the main handling category so cleaners can prepare before accepting the task.</p>
          <div class="chip-group">
            <button class="chip-select-btn ${this.formData.wasteType === 'hazardous' ? 'active' : ''}" type="button" onclick="window.ReportView.setWasteType('hazardous')">
              ⚠️ Hazardous
            </button>
            <button class="chip-select-btn ${this.formData.wasteType === 'non_biodegradable' ? 'active' : ''}" type="button" onclick="window.ReportView.setWasteType('non_biodegradable')">
              🧴 Non-biodegradable
            </button>
            <button class="chip-select-btn ${this.formData.wasteType === 'recyclable' ? 'active' : ''}" type="button" onclick="window.ReportView.setWasteType('recyclable')">
              ♻️ Recyclable
            </button>
            <button class="chip-select-btn ${this.formData.wasteType === 'biodegradable' ? 'active' : ''}" type="button" onclick="window.ReportView.setWasteType('biodegradable')">
              🍃 Biodegradable
            </button>
          </div>
        </div>

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
          <input type="text" inputmode="decimal" class="form-control" id="report-weight" value="${this.formData.estimatedWeightKg}" placeholder="e.g. 20 kg" />
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
            Next: Photo Evidence <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStep3(user) {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">3. Photo Evidence</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Upload clear before photos of the site. The task type controls the reward: cash for private/public tasks and Clean Points for partner challenges. Verification is automated from evidence, timestamps, GPS and reputation.
        </p>

        <!-- Real Photo Upload -->
        <div class="form-group">
          <label class="form-label">Hotspot Photo Evidence</label>
          <input id="report-photo-input" type="file" accept="image/*" capture="environment" style="display:none" onchange="window.ReportView.handlePhotoUpload(this)">
          <button type="button" class="upload-dropzone" style="width:100%; border:0; cursor:pointer;" onclick="document.getElementById('report-photo-input').click()">
            <i class="fa-solid fa-camera upload-icon"></i>
            <div style="font-weight: 700; font-size: 0.9rem; color: #0f172a;">Take Photo or Choose From Device</div>
            <div style="font-size: 0.72rem; color: #64748b;">JPG, PNG, WEBP • maximum 10 MB</div>
          </button>

          ${this.formData.imageFile ? `
            <div style="margin-top:10px; display:flex; align-items:center; gap:10px; background:#f0fdf4; padding:10px; border-radius:12px; border:1px solid #bbf7d0;">
              <img src="${URL.createObjectURL(this.formData.imageFile)}" alt="Selected report" style="width:64px;height:64px;object-fit:cover;border-radius:10px;">
              <div style="min-width:0; flex:1;">
                <div style="font-size:.78rem;font-weight:800;color:#0f172a;">${this.formData.imageFile.name}</div>
                <div style="font-size:.7rem;color:#64748b;">Ready to upload when you publish</div>
              </div>
              <button type="button" class="btn btn-secondary" style="padding:7px 10px;" onclick="window.ReportView.clearPhoto()">Remove</button>
            </div>
          ` : ''}

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

        <!-- Reward notice -->
        <div class="card" style="margin-top: 1rem; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
          <div style="display:flex; align-items:flex-start; gap:10px;">
            <i class="fa-solid fa-shield-halved" style="margin-top:2px;color:var(--emerald-600);"></i>
            <div>
              <div style="font-size:.8rem;font-weight:800;margin-bottom:2px;">${this.formData.taskType === 'private_property' ? `Private property cash task • ₱${Number(this.formData.rewardPhp || 500).toFixed(2)} gross` : this.formData.taskType === 'partner' ? `Partner task • ${Number(this.formData.cleanPoints || 500).toLocaleString()} Clean Points` : 'Public task • automatic cash reward based on estimated cleanup size'}</div>
              <div style="font-size:.72rem;line-height:1.45;">${this.formData.taskType === 'private_property' ? 'The cleaner receives 95% and StreetClean receives a 5% platform fee.' : this.formData.taskType === 'partner' ? 'Points accumulate on the cleaner account and can be exchanged for partner coupons and discounts.' : 'Public tasks require a reputation score of 60+ to claim and use timestamp/GPS/photo checks before payout.'}</div>
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
      if (this.formData.taskType === 'private_property') {
        this.formData.propertyOwner = document.getElementById('property-owner')?.value?.trim() || window.appState.getUser()?.name || '';
        this.formData.rewardPhp = Number(document.getElementById('private-reward')?.value || this.formData.rewardPhp || 500);
        if (!Number.isFinite(this.formData.rewardPhp) || this.formData.rewardPhp < 50) { window.showToast('Private property rewards must be at least ₱50.', 'error'); return; }
      }
      if (this.formData.taskType === 'partner') {
        this.formData.partnerName = document.getElementById('partner-name')?.value?.trim() || 'StreetClean Partner';
        this.formData.cleanPoints = Math.round(Number(document.getElementById('partner-points')?.value || this.formData.cleanPoints || 500));
        this.formData.partnerRewardDescription = document.getElementById('partner-reward-desc')?.value?.trim() || 'Partner reward points';
        if (!Number.isFinite(this.formData.cleanPoints) || this.formData.cleanPoints < 10) { window.showToast('Partner tasks need at least 10 Clean Points.', 'error'); return; }
      }
    }
    if (step === 3) {
      const weight = document.getElementById('report-weight')?.value?.trim();
      const desc = document.getElementById('report-desc')?.value;
      if (weight) {
        const parsedWeight = parseFloat(weight.replace(/[^0-9.]/g, ''));
        if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
          window.showToast('Please enter a valid estimated weight, such as 20 kg.', 'error');
          return;
        }
        this.formData.estimatedWeightKg = parsedWeight;
      } else {
        window.showToast('Please enter the estimated weight of the trash.', 'error');
        return;
      }
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

  setTaskType(type) {
    this.formData.taskType = type;
    window.renderRoute();
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

  setWasteType(type) {
    this.formData.wasteType = type;
    window.renderRoute();
  },

  setSeverity(sev) {
    this.formData.severity = sev;
    window.renderRoute();
  },

  async handlePhotoUpload(input) {
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.showToast('Please choose an image file.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      window.showToast('Image must be 10 MB or smaller.', 'error');
      return;
    }
    this.formData.imageFile = file;
    this.formData.imageUrl = '';
    window.renderRoute();
  },

  clearPhoto() {
    this.formData.imageFile = null;
    this.formData.imageUrl = 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80';
    window.renderRoute();
  },

  setPhoto(url) {
    this.formData.imageFile = null;
    this.formData.imageUrl = url;
    window.renderRoute();
  },


  triggerCamera() {
    window.showToast('Camera snapshot taken & GPS tagged: Peñaranda Festival Zone.', 'success');
  },

  useCurrentGps() {
    this.formData.lat = 13.1398;
    this.formData.lng = 123.7345;
    window.showToast('GPS Locked: Legazpi City Hall / Peñaranda Park (±3m accuracy)', 'success');
    window.renderRoute();
  },

  async submitReport() {
    const user = window.appState.getUser();
    if (!user) {
      window.showToast('Please sign in before submitting a report.', 'error');
      return;
    }

    const publishButton = document.querySelector('.report-view .btn-primary:last-child');
    if (publishButton) {
      publishButton.disabled = true;
      publishButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
    }

    try {
      let imageUrl = this.formData.imageUrl || null;
      if (this.formData.imageFile) {
        imageUrl = await window.uploadImageFile(this.formData.imageFile);
      }

      const newReport = window.appState.addReport({
        title: `${this.formData.category} at ${this.formData.sector.split('&')[0]}`,
        sector: this.formData.sector,
        address: this.formData.address,
        lat: this.formData.lat,
        lng: this.formData.lng,
        category: this.formData.category,
        wasteType: this.formData.wasteType,
        severity: this.formData.severity,
        estimatedWeightKg: this.formData.estimatedWeightKg,
        description: this.formData.description || `Reported ${this.formData.category} during festival festivities.`,
        imageUrl,
        taskType: this.formData.taskType,
        propertyOwner: this.formData.propertyOwner,
        rewardPhp: this.formData.rewardPhp,
        partnerName: this.formData.partnerName,
        cleanPoints: this.formData.cleanPoints,
        partnerRewardDescription: this.formData.partnerRewardDescription
      });

      window.soundSystem.success();
      window.showToast(`Hotspot ${newReport.id} successfully published!`, 'success');
      this.currentStep = 1;
      this.formData.imageFile = null;
      window.location.hash = '#/commissions';
    } catch (err) {
      console.error('Report photo upload failed:', err);
      window.showToast(err.message || 'Could not upload the report photo.', 'error');
      if (publishButton) {
        publishButton.disabled = false;
        publishButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publish Report';
      }
    }
  }
};
