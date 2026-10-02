<template>
  <div class="auth-bg">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
</template>

<script setup>
// Zajednička pozadina (tamna baza + 3 blur bloba) za Splash, Login i Register -
// ista na sve tri stranice, tako da prijelaz među njima nema nikakav vizualni skok.
</script>

<style scoped>
.auth-bg {
  position: fixed;
  inset: 0;
  background: #0b1220;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
}

.blob-1 {
  top: -140px;
  left: -100px;
  width: 480px;
  height: 480px;
  background: #14b8a6;
  opacity: 0.35;
  filter: blur(110px);
}

.blob-2 {
  bottom: -160px;
  right: -120px;
  width: 520px;
  height: 520px;
  background: #0f766e;
  opacity: 0.45;
  filter: blur(120px);
}

.blob-3 {
  top: 40%;
  left: 55%;
  width: 300px;
  height: 300px;
  background: #38bdf8;
  opacity: 0.12;
  filter: blur(100px);
}
</style>
