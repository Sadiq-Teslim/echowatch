// scripts/settings.js

document.addEventListener('DOMContentLoaded', () => {
  // --- PARTICLE BACKGROUND ---
  function createParticles () {
    const container = document.getElementById('particles')
    if (!container) return
    const count = 30
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      p.style.left = `${Math.random() * 100}%`
      p.style.animationDelay = `${Math.random() * 25}s`
      p.style.animationDuration = `${Math.random() * 15 + 25}s`
      container.appendChild(p)
    }
  }

  // --- DOM ELEMENT SELECTORS ---
  const navLinks = document.querySelectorAll('.nav-link')
  const settingsPanels = document.querySelectorAll('.settings-panel')
  const cameraListContainer = document.getElementById('camera-list-container')
  const cameraCountInput = document.getElementById('camera-count')
  const addCameraBtn = document.getElementById('add-camera-btn')
  const saveChangesBtn = document.getElementById('save-changes-btn')
  const modal = document.getElementById('add-camera-modal')
  const cameraForm = document.getElementById('camera-form')
  const cancelModalBtn = document.getElementById('cancel-modal-btn')
  const toast = document.getElementById('toast-notification')
  const newCameraNameInput = document.getElementById('new-camera-name')
  const newCameraIpInput = document.getElementById('new-camera-ip')

  // --- STATE MANAGEMENT ---
  const localStorageKey = 'echoWatchSettingsV3' // Using V3 to avoid conflicts
  let settings = {}

  const defaultSettings = {
    cameras: [
      { id: 1, name: 'Main Entrance', ip: '192.168.1.100' },
      { id: 2, name: 'Parking Lot', ip: '192.168.1.101' },
      { id: 3, name: 'Reception Area', ip: '192.168.1.102' }
    ],
    alerts: { loitering: true, threat: true, zone: false },
    notifications: { email: 'security@example.com', enabled: true },
    account: { username: 'AdminUser' }
  }

  // --- CORE FUNCTIONS ---

  // Handles showing the correct panel and setting the active link.
  const showPanel = targetId => {
    settingsPanels.forEach(panel => panel.classList.add('hidden'))
    const targetPanel = document.getElementById(targetId)
    if (targetPanel) {
      targetPanel.classList.remove('hidden')
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === targetId)
    })
  }

  const createCameraElement = (camera, index) => {
    const cameraDiv = document.createElement('div')
    cameraDiv.className =
      'camera-item flex items-center justify-between p-4 bg-gray-700/40 rounded-lg border border-gray-600/30 hover:border-cyan-400/50 transition-all duration-300'
    cameraDiv.innerHTML = `
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-white">${camera.name}</h4>
                    <p class="text-sm text-gray-400">${camera.ip}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="edit-camera-btn p-2 text-gray-400 hover:text-cyan-400 transition-colors" data-index="${index}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button class="remove-camera-btn p-2 text-gray-400 hover:text-red-400 transition-colors" data-index="${index}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>`
    return cameraDiv
  }

  const renderCameras = () => {
    cameraListContainer.innerHTML = ''
    if (settings.cameras.length === 0) {
      cameraListContainer.innerHTML = `<div class="text-center py-12 text-gray-400"><p class="text-lg">No cameras connected</p><p class="text-sm">Click "Add Camera" to get started</p></div>`
    } else {
      settings.cameras.forEach((camera, index) => {
        const cameraElement = createCameraElement(camera, index)
        cameraListContainer.appendChild(cameraElement)
      })
    }
    cameraCountInput.value = settings.cameras.length
  }

  const renderAllSettings = () => {
    renderCameras()
    document.getElementById('alert-loitering').checked =
      settings.alerts.loitering
    document.getElementById('alert-threat').checked = settings.alerts.threat
    document.getElementById('alert-zone').checked = settings.alerts.zone
    document.getElementById('notification-email').value =
      settings.notifications.email
    document.getElementById('notification-toggle').checked =
      settings.notifications.enabled
    document.getElementById('account-username').value =
      settings.account.username
    document.getElementById('account-password').value = ''
  }

  const loadSettings = () => {
    const savedSettings = localStorage.getItem(localStorageKey)
    settings = savedSettings
      ? JSON.parse(savedSettings)
      : JSON.parse(JSON.stringify(defaultSettings))
    renderAllSettings()
  }

  const saveSettings = () => {
    settings.alerts.loitering =
      document.getElementById('alert-loitering').checked
    settings.alerts.threat = document.getElementById('alert-threat').checked
    settings.alerts.zone = document.getElementById('alert-zone').checked
    settings.notifications.email =
      document.getElementById('notification-email').value
    settings.notifications.enabled = document.getElementById(
      'notification-toggle'
    ).checked
    settings.account.username =
      document.getElementById('account-username').value

    localStorage.setItem(localStorageKey, JSON.stringify(settings))
    showToast('All settings saved successfully!')
  }

  const showToast = message => {
    toast.querySelector('span').textContent = message
    toast.classList.remove('hidden')
    setTimeout(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'translateY(0)'
    }, 10)
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(8px)'
      setTimeout(() => toast.classList.add('hidden'), 300)
    }, 3000)
  }

  // --- EVENT LISTENERS ---

  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      showPanel(link.dataset.target)
    })
  })

  // Modal Controls
  addCameraBtn.addEventListener('click', () => modal.classList.remove('hidden'))
  cancelModalBtn.addEventListener('click', () => modal.classList.add('hidden'))
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden')
  })

  cameraForm.addEventListener('submit', e => {
    e.preventDefault()
    const newCamera = {
      id: Date.now(),
      name: newCameraNameInput.value,
      ip: newCameraIpInput.value
    }
    settings.cameras.push(newCamera)
    renderCameras()
    modal.classList.add('hidden')
    cameraForm.reset()
  })

  // Using Event Delegation for Edit/Remove buttons
  cameraListContainer.addEventListener('click', e => {
    const removeButton = e.target.closest('.remove-camera-btn')
    if (removeButton) {
      const indexToRemove = parseInt(removeButton.dataset.index)
      if (confirm('Are you sure you want to remove this camera?')) {
        settings.cameras.splice(indexToRemove, 1)
        renderCameras()
      }
      return
    }

    const editButton = e.target.closest('.edit-camera-btn')
    if (editButton) {
      const indexToEdit = parseInt(editButton.dataset.index)
      const camera = settings.cameras[indexToEdit]
      const newName = prompt('Enter new camera name:', camera.name)
      if (newName && newName.trim() !== '') {
        camera.name = newName.trim()
        renderCameras()
      }
    }
  })

  saveChangesBtn.addEventListener('click', saveSettings)

  // --- INITIALIZATION ---
  createParticles()
  loadSettings()
  if (navLinks.length > 0) {
    showPanel(navLinks[0].dataset.target)
  }
})
