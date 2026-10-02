<template>
  <aside class="sidebar" :class="{ open: open }">
    <div class="sidebar-top">
      <div class="sidebar-header">
        <div class="workspace">
          <div class="workspace-icon">
            <i class="bi bi-bar-chart-fill"></i>
          </div>

          <div>
            <strong> Workspace </strong>
          </div>
        </div>

        <button class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" @click="$emit('close')">
          <i class="bi bi-house-door"></i>

          <span> Dashboard </span>
        </router-link>

        <router-link to="/campaigns" @click="$emit('close')">
          <i class="bi bi-megaphone"></i>

          <span> Campaigns </span>
        </router-link>

        <router-link to="/analytics" @click="$emit('close')">
          <i class="bi bi-bar-chart-line"></i>

          <span> Analytics </span>
        </router-link>

        <router-link to="/reports" @click="$emit('close')">
          <i class="bi bi-file-earmark-text"></i>

          <span> Reports </span>
        </router-link>

        <router-link to="/profile" @click="$emit('close')">
          <i class="bi bi-person"></i>

          <span> Profile </span>
        </router-link>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <router-link to="/settings" @click="$emit('close')">
        <i class="bi bi-gear"></i>

        <span> Settings </span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: #0b1220;
  color: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transform: translateX(-100%);
  padding-top: 70px;
}

.sidebar.open {
  transform: translateX(0);
  box-shadow: 10px 0 40px rgba(0, 0, 0, 0.35);
}

.sidebar-header {
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.workspace {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-icon {
  width: 45px;
  height: 45px;
  border-radius: 14px;
  background: #14b8a6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.workspace strong {
  display: block;
  font-size: 15px;
  color: white;
}

.close-btn {
  width: 35px;
  height: 35px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 14px;
}

.sidebar-nav a,
.sidebar-bottom a {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 13px 16px;
  border-radius: 14px;
  text-decoration: none;
  color: #cbd5e1;
  font-size: 15px;
  font-weight: 500;
  transition: 0.2s;
}

.sidebar-nav a i,
.sidebar-bottom a i {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-nav a:hover,
.sidebar-bottom a:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.router-link-active {
  background: #14b8a6 !important;
  color: white !important;
  box-shadow: 0 8px 20px rgba(20, 184, 166, 0.25);
}

.sidebar-bottom {
  padding: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
@media (max-width: 991px) {
  .sidebar {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    padding-top: 64px;
  }
}

@media (max-width: 576px) {
  .sidebar {
    width: 82%;
    max-width: 300px;
  }

  .sidebar-header {
    padding: 16px 18px;
  }

  .workspace-icon {
    width: 38px;
    height: 38px;
    font-size: 17px;
  }

  .sidebar-nav {
    padding: 6px 10px;
  }

  .sidebar-nav a,
  .sidebar-bottom a {
    padding: 12px 14px;
    font-size: 14px;
  }
}
</style>
