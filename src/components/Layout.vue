<template>
  <div class="layout">
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>

    <main class="content" :class="{ collapsed: !sidebarOpen }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--bg);
}

.content {
  margin-top: 70px;
  margin-left: 260px;
  padding: 32px;
  min-height: calc(100vh - 70px);
  transition: 0.3s ease;
}

.content.collapsed {
  margin-left: 0;
}

.overlay {
  position: fixed;
  inset: 70px 0 0 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 998;
}

@media (max-width: 991px) {
  .content,
  .content.collapsed {
    margin-left: 0;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .content,
  .content.collapsed {
    margin-top: 64px;
    min-height: calc(100vh - 64px);
  }

  .overlay {
    inset: 64px 0 0 0;
  }
}
</style>
