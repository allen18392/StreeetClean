/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Auth & Account Management View Component (White & Green Theme)
 */

window.AuthView = {
  activeTab: 'login',
  selectedRole: 'cleaner',
  registerStep: 1,
  selectedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',

  // Step 2's fields live in this object so their values survive the
  // full-view re-render that happens every time setStep() runs.
  formData: {
    name: '',
    email: '',
    password: '',
    barangay: '',
    customLocation: '',
    phone: ''
  },

  avatarPresets: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
  ],

  render() {
    const currentUser = window.appState.getUser();

    return `
      <div class="auth-view animate-fade-in" style="padding: 1.25rem 0 3rem 0;">
        <div class="app-container" style="max-width: 500px;">

          <!-- Header Card -->
          <div class="card card-gold-glow" style="text-align: center; margin-bottom: 1.25rem; padding: 1.5rem 1.25rem; background: #ffffff; border: 1px solid #bbf7d0;">
            <div class="brand-icon" style="width: 48px; height: 48px; margin: 0 auto 0.5rem auto; font-size: 1.4rem;">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <h1 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 2px; color: #0f172a;">
              Street<span class="gradient-text">Clean</span> Account Hub
            </h1>
            <div style="font-size: 0.75rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
              Ibalong Festival 2026 • Legazpi City
            </div>
            <p style="font-size: 0.82rem; color: #64748b; line-height: 1.45; max-width: 380px; margin: 0 auto 1.25rem auto;">
              Sign in with your registered account or create a new profile to join the festival cleanup.
            </p>

            <!-- Tab Switcher -->
            <div style="display: flex; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: var(--radius-full); padding: 4px; gap: 4px;">
              <button class="btn btn-sm ${this.activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; border-radius: var(--radius-full);" onclick="window.AuthView.setTab('login')">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
              </button>
              <button class="btn btn-sm ${this.activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; border-radius: var(--radius-full);" onclick="window.AuthView.setTab('register')">
                <i class="fa-solid fa-user-plus"></i> Create Account
              </button>
            </div>
          </div>

          ${this.activeTab === 'login' ? this.renderLogin(currentUser) : this.renderRegister()}

        </div>
      </div>
    `;
  },

  renderLogin(currentUser) {
    return `
      <div class="card" style="padding: 1.5rem; background: #ffffff;">
        
        <!-- Credential Sign In Form -->
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">Account Sign In</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Enter the email address you registered with:
        </p>

        <form onsubmit="event.preventDefault(); window.AuthView.handleLogin();">
          <div class="form-group">
            <label class="form-label">Email or Mobile Number</label>
             <input type="text" class="form-control" id="login-identifier" placeholder="e.g. maria@example.com" value="${currentUser ? currentUser.email : ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" id="login-password" placeholder="••••••••" value="${this.formData.password}" required />
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="margin-top: 0.5rem; margin-bottom: 1.5rem;">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Account
          </button>
        </form>


      </div>
    `;
  },

  renderRegister() {
    return `
      <div class="card" style="padding: 1.5rem; background: #ffffff;">
        
        <!-- Registration Stepper -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 700; color: ${this.registerStep >= 1 ? 'var(--emerald-700)' : '#94a3b8'};">
            <span style="width: 20px; height: 20px; border-radius: 50%; background: ${this.registerStep >= 1 ? 'var(--emerald-600)' : '#cbd5e1'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.68rem;">1</span>
            Role
          </div>
          <div style="height: 2px; flex: 1; background: ${this.registerStep >= 2 ? 'var(--emerald-500)' : '#e2e8f0'}; margin: 0 6px;"></div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 700; color: ${this.registerStep >= 2 ? 'var(--emerald-700)' : '#94a3b8'};">
            <span style="width: 20px; height: 20px; border-radius: 50%; background: ${this.registerStep >= 2 ? 'var(--emerald-600)' : '#cbd5e1'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.68rem;">2</span>
            Profile
          </div>
          <div style="height: 2px; flex: 1; background: ${this.registerStep >= 3 ? 'var(--emerald-500)' : '#e2e8f0'}; margin: 0 6px;"></div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 700; color: ${this.registerStep >= 3 ? 'var(--emerald-700)' : '#94a3b8'};">
            <span style="width: 20px; height: 20px; border-radius: 50%; background: ${this.registerStep >= 3 ? 'var(--emerald-600)' : '#cbd5e1'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.68rem;">3</span>
            Payout
          </div>
        </div>

        ${this.registerStep === 1 ? this.renderStep1() : ''}
        ${this.registerStep === 2 ? this.renderStep2() : ''}
        ${this.registerStep === 3 ? this.renderStep3() : ''}

      </div>
    `;
  },

  renderStep1() {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">1. Select Account Role</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Choose your account type for the Ibalong Festival cleanup:
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
          
          <div class="card ${this.selectedRole === 'resident' ? 'card-gold-glow' : ''}" style="padding: 12px; cursor: pointer; background: #f8fafc; border: 1px solid #e2e8f0;" onclick="window.AuthView.selectRole('resident')">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                  <i class="fa-solid fa-camera"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a;">Resident / Reporter</div>
                  <div style="font-size: 0.72rem; color: #64748b;">Report festival litter & pin locations.</div>
                </div>
              </div>
              <input type="radio" name="regRole" ${this.selectedRole === 'resident' ? 'checked' : ''} />
            </div>
          </div>

          <div class="card ${this.selectedRole === 'cleaner' ? 'card-gold-glow' : ''}" style="padding: 12px; cursor: pointer; background: #f8fafc; border: 1px solid #e2e8f0;" onclick="window.AuthView.selectRole('cleaner')">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                  <i class="fa-solid fa-broom"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a;">Cleaner / Eco-Warrior</div>
                  <div style="font-size: 0.72rem; color: #64748b;">Claim cleanup tasks & earn ₱ bounties.</div>
                </div>
              </div>
              <input type="radio" name="regRole" ${this.selectedRole === 'cleaner' ? 'checked' : ''} />
            </div>
          </div>

          <div class="card ${this.selectedRole === 'verifier' ? 'card-gold-glow' : ''}" style="padding: 12px; cursor: pointer; background: #f8fafc; border: 1px solid #e2e8f0;" onclick="window.AuthView.selectRole('verifier')">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a;">Verifier / Marshall</div>
                  <div style="font-size: 0.72rem; color: #64748b;">Audit photo proofs & approve cleanups.</div>
                </div>
              </div>
              <input type="radio" name="regRole" ${this.selectedRole === 'verifier' ? 'checked' : ''} />
            </div>
          </div>

        </div>

        <button class="btn btn-primary btn-block" onclick="window.AuthView.setStep(2)">
          Continue to Profile Details <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
  },

  renderStep2() {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">2. User Profile Details</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Enter your personal details for your new account:
        </p>

        <!-- Avatar Preset Gallery -->
        <div class="form-group">
          <label class="form-label">Choose Avatar Profile Picture</label>
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 8px;">
            ${this.avatarPresets.map(av => `
              <img src="${av}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2.5px solid ${this.selectedAvatar === av ? 'var(--emerald-500)' : '#e2e8f0'};" onclick="window.AuthView.setAvatar('${av}')" />
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Full Legal Name</label>
          <input type="text" class="form-control" id="reg-name" placeholder="e.g. Christian Hernandez" value="${this.formData.name}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-control" id="reg-email" placeholder="e.g. christian@example.com" value="${this.formData.email}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Create Password</label>
          <input type="password" class="form-control" id="reg-password" placeholder="At least 6 characters" value="${this.formData.password}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control" id="reg-custom-location" value="${this.formData.customLocation}" placeholder="e.g. Barangay Rawis, Legazpi City" required />
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 5px;">Type your barangay, street, landmark, or full address.</div>
        </div>

        <div class="form-group">
          <label class="form-label">Mobile Phone (GCash / Maya)</label>
          <input type="tel" class="form-control" id="reg-phone" placeholder="e.g. 0917-555-1234" value="${this.formData.phone}" required />
        </div>

        <div style="display: flex; gap: 8px; margin-top: 1.25rem;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="window.AuthView.setStep(1)">
            <i class="fa-solid fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-primary" style="flex: 2;" onclick="window.AuthView.setStep(3)">
            Next: Payout Details <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStep3() {
    return `
      <div>
        <h2 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">3. Instant ₱ Payout Setup</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem;">
          Link your mobile wallet for instant cleanup bounty payouts:
        </p>

        <div class="form-group">
          <label class="form-label">Preferred Payout Gateway</label>
          <div class="chip-group">
            <button class="chip-select-btn active" type="button"><i class="fa-solid fa-mobile-screen"></i> GCash</button>
            <button class="chip-select-btn" type="button"><i class="fa-solid fa-wallet"></i> Maya</button>
            <button class="chip-select-btn" type="button"><i class="fa-solid fa-building-columns"></i> LandBank</button>
          </div>
        </div>

        <div class="card" style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; margin-bottom: 1.25rem;">
          <div style="display: flex; gap: 8px;">
            <i class="fa-solid fa-gift" style="color: var(--emerald-600); font-size: 1.2rem; margin-top: 2px;"></i>
            <div style="font-size: 0.78rem; color: #166534;">
              <strong>Welcome Civic Grant:</strong> New registered accounts receive an initial ₱500 civic credit and 250 Ibalong points automatically!
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="window.AuthView.setStep(2)">
            <i class="fa-solid fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-primary" style="flex: 2;" onclick="window.AuthView.createRealAccount()">
            <i class="fa-solid fa-user-check"></i> Register & Sign In
          </button>
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    window.renderRoute();
  },

  selectRole(role) {
    this.selectedRole = role;
    window.renderRoute();
  },

  setStep(step) {
    // If we're leaving step 2, its input fields are about to be destroyed
    // by the re-render — grab their current values first so nothing is lost.
    if (this.registerStep === 2) {
      this.formData.name = document.getElementById('reg-name')?.value ?? this.formData.name;
      this.formData.email = document.getElementById('reg-email')?.value ?? this.formData.email;
      this.formData.password = document.getElementById('reg-password')?.value ?? this.formData.password;
      this.formData.customLocation = document.getElementById('reg-custom-location')?.value ?? this.formData.customLocation;
      this.formData.phone = document.getElementById('reg-phone')?.value ?? this.formData.phone;
    }
    this.registerStep = step;
    window.renderRoute();
  },

  setAvatar(url) {
    this.selectedAvatar = url;
    window.renderRoute();
  },

  async handleLogin() {
    const idInput = document.getElementById('login-identifier');
    const passInput = document.getElementById('login-password');
    const identifier = idInput ? idInput.value : '';
    const password = passInput ? passInput.value : '';

    if (!identifier) {
      window.showToast('Please enter your email or mobile number.', 'error');
      return;
    }
    window.showToast('Signing in...', 'success');
    const result = await window.appState.loginUser(identifier, password);
    if (result.success) {
      window.soundSystem.success();
      window.showToast(`Welcome back, ${result.user.name}! Signed in as ${result.user.role.toUpperCase()}.`, 'success');
      window.location.hash = '#/dashboard';
    } else {
      window.showToast(result.message, 'error');
    }
  },

  async createRealAccount() {
    // Step 3 (where this button lives) has no reg-* input fields — those
    // only exist on step 2 and are captured into this.formData by setStep()
    // when the user leaves step 2. Also do one last capture here in case
    // they never left step 2 through setStep (e.g. only one step was shown).
    const liveName = document.getElementById('reg-name')?.value;
    if (liveName !== undefined) this.formData.name = liveName;
    const liveEmail = document.getElementById('reg-email')?.value;
    if (liveEmail !== undefined) this.formData.email = liveEmail;
    const livePassword = document.getElementById('reg-password')?.value;
    if (livePassword !== undefined) this.formData.password = livePassword;
    const liveCustomLocation = document.getElementById('reg-custom-location')?.value;
    if (liveCustomLocation !== undefined) this.formData.customLocation = liveCustomLocation;
    const livePhone = document.getElementById('reg-phone')?.value;
    if (livePhone !== undefined) this.formData.phone = livePhone;

    const rawName = this.formData.name || '';
    const email = this.formData.email.trim();
    const password = this.formData.password;
    const barangay = (this.formData.customLocation || '').trim();
    const phone = this.formData.phone || '';

    if (!rawName.trim() || !email || !password || !barangay) {
      window.showToast('Please complete your name, email, password, and location.', 'error');
      this.registerStep = 2;
      window.renderRoute();
      return;
    }
    const name = rawName.trim();

    window.showToast('Creating your account...', 'success');
    const result = await window.appState.registerUser({
      name: name,
      email: email,
      password: password,
      role: this.selectedRole,
      barangay: barangay,
      phone: phone,
      avatar: this.selectedAvatar,
      payoutProvider: 'GCash',
      payoutAccount: phone
    });

    if (result.success) {
      window.soundSystem.success();
      window.showToast(`Account created for ${result.user.name}! Welcome to Ibalong 2026.`, 'success');
      this.registerStep = 1;
      this.formData = { name: '', email: '', password: '', barangay: '', customLocation: '', phone: '' };
      window.location.hash = '#/dashboard';
    } else {
      window.showToast(result.message, 'error');
    }
  },

  createAccount() {
    this.createRealAccount();
  }
};