<template>
  <div class="splash" :class="{ exiting: isExiting }" @click="skip">
    <AuthBackground />

    <div class="splash-content">
      <div class="monogram-block">
        <div class="monogram">
          <span class="letter letter-white">A</span>
          <span class="letter letter-teal">A</span>
        </div>
        <div class="accent-line"></div>
      </div>

      <div class="text-block">
        <span class="title">Welcome to AdAnalytix</span>
        <span class="subtitle">Your personal digital marketing data analysis system.</span>
      </div>

      <div class="dots">
        <div class="dot dot-active"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>

    <div class="skip-hint">Click anywhere to skip</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AuthBackground from '../components/AuthBackground.vue'

const router = useRouter()

const isExiting = ref(false)

let timer = null
let finished = false

function finish() {
  if (finished) return

  finished = true

  clearTimeout(timer)
  window.removeEventListener('keydown', finish)

  sessionStorage.setItem('splashShown', 'true')
  isExiting.value = true

  setTimeout(() => {
    router.push('/login')
  }, 350)
}

function skip() {
  finish()
}

onMounted(() => {
  timer = setTimeout(finish, 5000)
  window.addEventListener('keydown', finish)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('keydown', finish)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap');

.splash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5000;
  font-family:
    'Manrope',
    system-ui,
    -apple-system,
    sans-serif;
}

/* Pozadina (tamna, s blob krugovima) ostaje čvrsta cijelo vrijeme - blijedi
   samo sadržaj, tako da nema "bljeska" svijetle pozadine ispod prije nego
   se Login (koji je i sam taman) prikaže. */
.splash-content,
.skip-hint {
  transition: opacity 0.35s ease;
}

.splash.exiting .splash-content,
.splash.exiting .skip-hint {
  opacity: 0;
}

.splash-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
  padding: 0 24px;
}

.monogram-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.monogram {
  display: flex;
}

.letter {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.letter-white {
  color: #ffffff;
}

.letter-teal {
  color: #14b8a6;
  margin-left: -7px;
}

.accent-line {
  width: 26px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #0f766e 0%, #14b8a6 100%);
}

.text-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 16px;
  font-weight: 500;
  color: #94d9ce;
}

.dots {
  display: flex;
  gap: 6px;
  margin-top: 14px;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
}

.dot-active {
  width: 22px;
  background: #14b8a6;
}

.skip-hint {
  position: absolute;
  z-index: 1;
  bottom: 22px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 480px) {
  .title {
    font-size: 26px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
