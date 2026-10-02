<template>
  <header class="navbar">
    <!-- LIJEVA STRANA -->

    <div class="navbar-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <i class="bi bi-list"></i>
      </button>

      <div class="brand">
        <div class="brand-icon">
          <i class="bi bi-bar-chart-fill"></i>
        </div>

        <div class="brand-text">
          <h6>AdAnalytix</h6>
        </div>
      </div>
    </div>

    <!-- DESNA STRANA -->

    <div class="navbar-right">
      <!-- NOTIFICATIONS -->

      <div class="notification-box">
        <button class="icon-btn" @click="openNotifications">
          <i class="bi bi-bell"></i>

          <span v-if="alerts.length && !dismissed" class="badge">{{ alerts.length }}</span>
        </button>

        <div
          v-if="showNotifications"
          class="notification-overlay"
          @click="showNotifications = false"
        ></div>

        <div v-if="showNotifications" class="notification-menu">
          <h6>Notifications</h6>

          <div v-for="(item, index) in alerts" :key="index" class="notification-item">
            <i :class="item.icon"></i>

            {{ item.text }}
          </div>

          <div v-if="!alerts.length" class="notification-item">
            <i class="bi bi-check-circle"></i>

            All campaigns look healthy - no alerts right now.
          </div>
        </div>
      </div>

      <!-- USER -->

      <div class="user-box" @click="goProfile">
        <div class="avatar">
          {{ initial }}
        </div>

        <div class="user-info">
          <strong>
            {{ userName }}
          </strong>

          <small>
            {{ accountType }}
          </small>
        </div>
      </div>

      <!-- LOGOUT -->

      <button class="logout-btn" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

import { useCampaignStore } from '../stores/campaign'

import { calculateROI, calculateCTR } from '../utils/metrics'

defineEmits(['toggle-sidebar'])

const auth = useAuthStore()

const router = useRouter()

const campaignStore = useCampaignStore()

const campaigns = computed(() => campaignStore.userCampaigns)

const alerts = computed(() => {
  const list = []

  campaigns.value.forEach((c) => {
    const roi = Number(calculateROI(c))

    if (c.budget && roi < 0) {
      list.push({
        icon: 'bi bi-exclamation-triangle-fill text-danger',
        text: `"${c.name}" is running at a loss (ROI ${roi}%).`
      })
    }
  })

  campaigns.value.forEach((c) => {
    const ctr = Number(calculateCTR(c))

    if (c.impressions && ctr < 1) {
      list.push({
        icon: 'bi bi-graph-down text-warning',
        text: `"${c.name}" has a low CTR (${ctr}%).`
      })
    }
  })

  return list
})

const showNotifications = ref(false)

const dismissed = ref(false)

const userName = computed(() => {
  return auth.currentUser?.name || 'User'
})

const accountType = computed(() => {
  return auth.currentUser?.accountType || 'Analyst'
})

const initial = computed(() => {
  return (auth.currentUser?.name || 'U').charAt(0).toUpperCase()
})

function logout() {
  auth.logout()

  router.push('/login')
}

function openNotifications() {
  showNotifications.value = !showNotifications.value

  dismissed.value = true
}

function goProfile() {
  router.push('/profile')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: rgba(11, 18, 32, 0.95);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  z-index: 1000;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.menu-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s;
  flex-shrink: 0;
}

.menu-btn:hover {
  background: #14b8a6;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: #14b8a6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.brand-text h6 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: white;
  white-space: nowrap;
}

.brand-text small {
  color: #94a3b8;
  font-size: 12px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-btn {
  position: relative;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #14b8a6;
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-box {
  position: relative;
}

.notification-overlay {
  display: none;
}

.notification-menu {
  position: absolute;
  right: 0;
  top: 52px;
  width: 300px;
  max-width: calc(100vw - 30px);
  background: var(--surface);
  color: var(--text);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1001;
}

.notification-menu h6 {
  margin-bottom: 15px;
  font-weight: 700;
}

.notification-item {
  padding: 12px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
}

.notification-item:hover {
  background: var(--surface-soft);
}

.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #14b8a6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info strong {
  font-size: 14px;
  color: white;
}

.user-info small {
  font-size: 12px;
  color: #94a3b8;
}

.logout-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  cursor: pointer;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
  .notification-overlay {
    display: block;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.4);
    z-index: 1000;
  }

  .notification-menu {
    position: fixed;
    top: 74px;
    left: auto;
    right: 10px;
    width: 220px;
    max-width: calc(100vw - 20px);
    padding: 14px;
  }

  .notification-menu h6 {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .notification-item {
    padding: 9px;
    font-size: 12.5px;
    gap: 8px;
  }

  .notification-item i {
    font-size: 14px;
  }
}

@media (max-width: 420px) {
  .brand-text {
    display: none;
  }

  .navbar {
    padding: 0 10px;
  }
}
</style>
