// /scripts/settings.js
// This script manages all interactivity on the settings page.

document.addEventListener('DOMContentLoaded', () => {

  // --- I. STATE & CONSTANTS ---
  const LOCAL_STORAGE_KEY = 'echoWatchSettingsV4'; // Use a new version to avoid conflicts
  let settings = {};

  const DEFAULT_SETTINGS = {
    cameras: [
      { id: Date.now() + 1, name: 'Main Entrance', ip: '192.168.1.100' },
      { id: Date.now() + 2, name: 'Parking Lot', ip: '192.168.1.101' },
      { id: Date.now() + 3, name: 'Reception Area', ip: '192.168.1.102' }
    ],
    alerts: { loitering: true, threat: true, zone: false },
    notifications: { email: 'security@example.com', enabled: true, sms: '555-123-4567', smsEnabled: false },
    account: { username: 'AdminUser' }
  };

  // --- II. DOM ELEMENT CACHING ---
  // Cache all DOM elements we'll need to interact with.
  const DOM = {
    particlesContainer: document.getElementById('particles'),
    navLinks: document.querySelectorAll('.nav-link'),
    settingsPanels: document.querySelectorAll('.settings-panel'),
    cameraListContainer: document.getElementById('camera-list-container'),
    cameraCountInput: document.getElementById('camera-count'),
    addCameraBtn: document.getElementById('add-camera-btn'),
    saveChangesBtn: document.getElementById('save-changes-btn'),
    modal: document.getElementById('add-camera-modal'),
    cameraForm: document.getElementById('camera-form'),
    cancelModalBtn: document.getElementById('cancel-modal-btn'),
    toast: document.getElementById('toast-notification'),
    newCameraNameInput: document.getElementById('new-camera-name'),
    newCameraIpInput: document.getElementById('new-camera-ip'),
  };

  // --- III. UI & RENDER FUNCTIONS ---

  /**
   * Creates and appends animated particles to the background container.
   */
  const createParticles = () => {
    if (!DOM.particlesContainer) return;
    const count = 30;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 25}s`;
      p.style.animationDuration = `${Math.random() * 15 + 25}s`;
      fragment.appendChild(p);
    }
    DOM.particlesContainer.appendChild(fragment);
  };

  /**
   * Manages the visibility of settings panels and the active state of navigation links.
   * @param {string} targetId The ID of the panel to display.
   */
  const showPanel = (targetId) => {
    DOM.settingsPanels.forEach(panel => panel.classList.add('hidden'));
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
    }
    DOM.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === targetId);
    });
  };

  /**
   * Generates the HTML for a single camera item.
   * @param {object} camera The camera data object.
   * @param {number} index The camera's index in the settings array.
   * @returns {HTMLElement} The generated camera element.
   */
  const createCameraElement = (camera, index) => {
    const div = document.createElement('div');
    div.className = 'camera-item flex items-center justify-between p-4 rounded-lg';
    div.innerHTML = `
      <div class="flex items-center min-w-0">
        <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
        </div>
        <div class="min-w-0">
          <h4 class="text-lg font-semibold text-white truncate">${camera.name}</h4>
          <p class="text-sm text-gray-400 truncate">${camera.ip}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2 flex-shrink-0">
        <button class="edit-camera-btn p-2 text-gray-400 hover:text-cyan-400 transition-colors" data-index="${index}" aria-label="Edit ${camera.name}"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
        <button class="remove-camera-btn p-2 text-gray-400 hover:text-red-400 transition-colors" data-index="${index}" aria-label="Remove ${camera.name}"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
      </div>`;
    return div;
  };

  /**
   * Renders the full list of cameras into the DOM.
   */
  const renderCameras = () => {
    if (!DOM.cameraListContainer || !DOM.cameraCountInput) return;
    DOM.cameraListContainer.innerHTML = '';
    if (settings.cameras.length === 0) {
      DOM.cameraListContainer.innerHTML = `<div class="text-center py-12 text-gray-400"><p class="text-lg">No cameras connected</p><p class="text-sm">Click "Add Camera" to get started</p></div>`;
    } else {
      const fragment = document.createDocumentFragment();
      settings.cameras.forEach((camera, index) => fragment.appendChild(createCameraElement(camera, index)));
      DOM.cameraListContainer.appendChild(fragment);
    }
    DOM.cameraCountInput.value = settings.cameras.length;
  };

  /**
   * Shows a temporary toast notification.
   * @param {string} message The message to display.
   */
  const showToast = (message) => {
    if (!DOM.toast) return;
    DOM.toast.querySelector('span').textContent = message;
    DOM.toast.classList.remove('hidden');
    setTimeout(() => {
      DOM.toast.style.opacity = '1';
      DOM.toast.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
      DOM.toast.style.opacity = '0';
      DOM.toast.style.transform = 'translateY(8px)';
      setTimeout(() => DOM.toast.classList.add('hidden'), 300);
    }, 3000);
  };

  // --- IV. DATA & LOGIC FUNCTIONS ---

  /**
   * Safely gets a DOM element and sets its property, avoiding errors if the element doesn't exist.
   * @param {string} id The ID of the element.
   * @param {string} property The property to set (e.g., 'value', 'checked').
   * @param {*} value The value to set.
   */
  const safeSetProperty = (id, property, value) => {
    const element = document.getElementById(id);
    if (element) {
      element[property] = value;
    }
  };

  /**
   * Populates all form fields with data from the `settings` object.
   */
  const populateAllForms = () => {
    safeSetProperty('alert-loitering', 'checked', settings.alerts.loitering);
    safeSetProperty('alert-threat', 'checked', settings.alerts.threat);
    safeSetProperty('alert-zone', 'checked', settings.alerts.zone);
    safeSetProperty('notification-email', 'value', settings.notifications.email);
    safeSetProperty('notification-toggle', 'checked', settings.notifications.enabled);
    safeSetProperty('notification-sms', 'value', settings.notifications.sms || '');
    safeSetProperty('sms-toggle', 'checked', settings.notifications.smsEnabled || false);
    safeSetProperty('account-username', 'value', settings.account.username);
    safeSetProperty('account-password', 'value', '');
  };

  /**
   * Reads all form data from the DOM and updates the `settings` object.
   */
  const gatherFormData = () => {
    const getChecked = (id) => document.getElementById(id)?.checked || false;
    const getValue = (id) => document.getElementById(id)?.value || '';

    settings.alerts.loitering = getChecked('alert-loitering');
    settings.alerts.threat = getChecked('alert-threat');
    settings.alerts.zone = getChecked('alert-zone');
    settings.notifications.email = getValue('notification-email');
    settings.notifications.enabled = getChecked('notification-toggle');
    settings.notifications.sms = getValue('notification-sms');
    settings.notifications.smsEnabled = getChecked('sms-toggle');
    settings.account.username = getValue('account-username');
  };

  /**
   * Loads settings from localStorage or uses defaults, then renders everything.
   */
  const loadAndRender = () => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    settings = savedSettings ? JSON.parse(savedSettings) : JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    populateAllForms();
    renderCameras();
  };

  /**
   * Saves the current state of settings to localStorage.
   */
  const saveAllChanges = () => {
    gatherFormData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    showToast('All settings saved successfully!');
  };

  // --- V. EVENT HANDLERS ---
  const handleCameraFormSubmit = (e) => { e.preventDefault(); const newName = DOM.newCameraNameInput.value.trim(); const newIp = DOM.newCameraIpInput.value.trim(); if (newName && newIp) { settings.cameras.push({ id: Date.now(), name: newName, ip: newIp }); renderCameras(); DOM.modal.classList.add('hidden'); DOM.cameraForm.reset(); } };
  const handleCameraListClick = (e) => { const removeBtn = e.target.closest('.remove-camera-btn'); if (removeBtn) { const index = parseInt(removeBtn.dataset.index, 10); if (confirm(`Remove camera "${settings.cameras[index].name}"?`)) { settings.cameras.splice(index, 1); renderCameras(); } return; } const editBtn = e.target.closest('.edit-camera-btn'); if (editBtn) { const index = parseInt(editBtn.dataset.index, 10); const camera = settings.cameras[index]; const newName = prompt('Enter new camera name:', camera.name); if (newName && newName.trim()) { camera.name = newName.trim(); renderCameras(); } } };

  // --- VI. INITIALIZATION ---
  const init = () => {
    createParticles();
    loadAndRender();

    // Setup Event Listeners
    DOM.navLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showPanel(link.dataset.target); }));
    if (DOM.addCameraBtn) DOM.addCameraBtn.addEventListener('click', () => DOM.modal.classList.remove('hidden'));
    if (DOM.cancelModalBtn) DOM.cancelModalBtn.addEventListener('click', () => DOM.modal.classList.add('hidden'));
    if (DOM.modal) DOM.modal.addEventListener('click', (e) => { if (e.target === DOM.modal) DOM.modal.classList.add('hidden'); });
    if (DOM.cameraForm) DOM.cameraForm.addEventListener('submit', handleCameraFormSubmit);
    if (DOM.cameraListContainer) DOM.cameraListContainer.addEventListener('click', handleCameraListClick);
    if (DOM.saveChangesBtn) DOM.saveChangesBtn.addEventListener('click', saveAllChanges);

    // Show the first panel by default
    if (DOM.navLinks.length > 0) {
      showPanel(DOM.navLinks[0].dataset.target);
    }
  };

  init();
});