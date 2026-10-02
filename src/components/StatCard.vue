<template>
  <div class="stat-card" :class="[gradient ? 'gradient' : 'plain', color]">
    <div v-if="icon" class="stat-icon" :class="color">
      <i :class="icon"></i>
    </div>

    <div class="stat-text">
      <span class="stat-title">{{ title }}</span>
      <strong class="stat-value">{{ value }}</strong>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: '' },
  color: { type: String, default: 'blue' },
  gradient: { type: Boolean, default: false }
})
</script>

<style scoped>
.stat-card {
  container-type: inline-size;
  border-radius: 20px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* kad je kartica preuska za ikonu + tekst u istom redu (npr. ugniježđeni grid stupci),
   slažemo ih okomito umjesto da tekst pokušava stati u premalo prostora */
@container (max-width: 170px) {
  .stat-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

.stat-card.plain {
  background: var(--surface);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.stat-card.plain .stat-icon {
  order: 1;
}
.stat-card.plain .stat-text {
  order: 2;
}

.stat-card.gradient {
  min-height: 150px;
  color: white;
  justify-content: space-between;
  transition: 0.3s;
}

.stat-card.gradient:hover {
  transform: translateY(-7px);
}

.stat-card.gradient .stat-text {
  order: 1;
}
.stat-card.gradient .stat-icon {
  order: 2;
}

.stat-text {
  min-width: 0;
  flex: 1;
}

.stat-title {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-card.gradient .stat-title {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  overflow-wrap: break-word;
  word-break: break-word;
}

.stat-card.gradient .stat-value {
  color: white;
  font-size: 32px;
  letter-spacing: -1px;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  color: white;
}

.stat-card.gradient .stat-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 58px;
  height: 58px;
  font-size: 25px;
}

.stat-card.plain .stat-icon.blue {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
}
.stat-card.plain .stat-icon.green {
  background: linear-gradient(135deg, #059669, #2dd4bf);
}
.stat-card.plain .stat-icon.purple {
  background: linear-gradient(135deg, #4f46e5, #818cf8);
}
.stat-card.plain .stat-icon.teal {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}

.stat-card.gradient.blue {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
}
.stat-card.gradient.purple {
  background: linear-gradient(135deg, #4f46e5, #818cf8);
}
.stat-card.gradient.green {
  background: linear-gradient(135deg, #059669, #2dd4bf);
}
.stat-card.gradient.orange {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
}
.stat-card.gradient.teal {
  background: linear-gradient(135deg, #0b1220, #14b8a6);
}
.stat-card.gradient.red {
  background: linear-gradient(135deg, #6b21a8, #c026d3);
}
</style>
