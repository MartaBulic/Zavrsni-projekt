<template>
  <div>
    <div class="mb-4">
      <h1 class="fw-bold">Settings</h1>

      <p class="text-muted">Customize your application preferences</p>
    </div>

    <div class="setting-card">
      <h5 class="fw-bold mb-4">Dashboard Preferences</h5>

      <div class="setting-row">
        <div>
          <strong> Performance Tips </strong>

          <p>Show recommendations for campaigns</p>
        </div>

        <label class="switch">
          <input type="checkbox" v-model="performanceTips" />

          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div>
          <strong> Auto Refresh Analytics </strong>

          <p>Automatically refresh dashboard and analytics data every 30 seconds</p>
        </div>

        <label class="switch">
          <input type="checkbox" v-model="autoRefresh" />

          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div>
          <strong> Dark Mode </strong>

          <p>Switch the whole app to a dark color theme</p>
        </div>

        <label class="switch">
          <input type="checkbox" :checked="isDark" @change="toggleTheme" />

          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="setting-card">
      <h5 class="fw-bold mb-4">Current Preferences</h5>

      <div class="status-item">
        <span> Performance Tips </span>

        <span :class="performanceTips ? 'active' : 'inactive'">
          {{ performanceTips ? 'Enabled' : 'Disabled' }}
        </span>
      </div>

      <div class="status-item">
        <span> Auto Refresh Analytics </span>

        <span :class="autoRefresh ? 'active' : 'inactive'">
          {{ autoRefresh ? 'Enabled' : 'Disabled' }}
        </span>
      </div>
    </div>

    <div class="setting-card">
      <h5 class="fw-bold mb-4">Data</h5>

      <p class="text-muted">
        All your data (account, campaigns, preferences) is stored only in this browser. Download a
        backup so you don't lose it, or restore one on another browser.
      </p>

      <div class="data-actions">
        <button class="data-btn" @click="exportBackup">
          <i class="bi bi-download me-2"></i>
          Download backup
        </button>

        <button class="data-btn" @click="triggerImport">
          <i class="bi bi-upload me-2"></i>
          Restore backup
        </button>

        <input
          ref="importInput"
          type="file"
          accept="application/json"
          class="d-none"
          @change="importBackup"
        />
      </div>

      <p v-if="importMessage" class="import-message" :class="importSuccess ? 'success' : 'error'">
        {{ importMessage }}
      </p>
    </div>

    <div class="setting-card">
      <h5 class="fw-bold text-danger">Account</h5>

      <p class="text-muted">Manage your account session</p>

      <button class="logout-btn" @click="logout">
        <i class="bi bi-box-arrow-right me-2"></i>

        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useAuthStore } from '../stores/auth'

import { useRouter } from 'vue-router'

import { useTheme } from '../composables/useTheme'

import { downloadFile } from '../utils/download'

const auth = useAuthStore()

const router = useRouter()

const { isDark, toggleTheme } = useTheme()

const performanceTips = ref(localStorage.getItem('performanceTips') !== 'false')

const autoRefresh = ref(localStorage.getItem('autoRefresh') !== 'false')

watch(performanceTips, (value) => {
  localStorage.setItem('performanceTips', value)
})

watch(autoRefresh, (value) => {
  localStorage.setItem('autoRefresh', value)
})

function logout() {
  auth.logout()

  router.push('/login')
}

const importInput = ref(null)
const importMessage = ref('')
const importSuccess = ref(false)

const BACKUP_KEYS = ['users', 'currentUser', 'campaigns', 'performanceTips', 'autoRefresh', 'theme']

function exportBackup() {
  const data = {}

  BACKUP_KEYS.forEach((key) => {
    data[key] = localStorage.getItem(key)
  })

  const date = new Date().toISOString().slice(0, 10)

  downloadFile(JSON.stringify(data, null, 2), `dashboard-backup-${date}.json`, 'application/json')
}

function triggerImport() {
  importInput.value?.click()
}

function importBackup(event) {
  const file = event.target.files[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result)

      BACKUP_KEYS.forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          localStorage.setItem(key, data[key])
        }
      })

      importSuccess.value = true
      importMessage.value = 'Backup restored successfully. Reloading...'

      setTimeout(() => location.reload(), 1200)
    } catch {
      importSuccess.value = false
      importMessage.value = 'This file is not a valid backup.'
    }
  }

  reader.readAsText(file)

  event.target.value = ''
}
</script>

<style scoped>
.setting-card {
  background: var(--surface);
  border-radius: 22px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
}

.setting-row:last-child {
  border: none;
}

.setting-row p {
  margin-top: 5px;
  font-size: 14px;
  color: var(--text-secondary);
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
}

.status-item:last-child {
  border: none;
}

.active {
  color: #16a34a;
  font-weight: 700;
}

.inactive {
  color: #dc2626;
  font-weight: 700;
}

.switch {
  position: relative;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  inset: 0;
  background: #cbd5e1;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.slider:before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background: #14b8a6;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.logout-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
}

.logout-btn:hover {
  background: #fecaca;
}

.data-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.data-btn {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
}

.import-message {
  margin-top: 14px;
  font-weight: 600;
  font-size: 14px;
}

.import-message.success {
  color: #16a34a;
}

.import-message.error {
  color: #dc2626;
}

@media (max-width: 576px) {
  .setting-card {
    padding: 18px;
    border-radius: 16px;
  }

  .setting-row {
    align-items: flex-start;
  }

  .setting-row strong {
    font-size: 14px;
  }

  .setting-row p {
    font-size: 12.5px;
  }
}
</style>
