<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { calculateROI } from '../utils/metrics'
import { useChartColors } from '../composables/useChartColors'

const { titleColor, tickColor, gridColor } = useChartColors()

const props = defineProps({
  campaigns: {
    type: Array,
    required: true
  }
})

const platformAverages = computed(() => {
  const groups = {}

  props.campaigns.forEach((c) => {
    if (!groups[c.platform]) groups[c.platform] = []

    groups[c.platform].push(Number(calculateROI(c)))
  })

  return Object.entries(groups).map(([platform, values]) => ({
    platform,
    avgROI: values.reduce((a, b) => a + b, 0) / values.length
  }))
})

const chartData = computed(() => ({
  labels: platformAverages.value.map((p) => p.platform),
  datasets: [
    {
      label: 'Average ROI (%)',
      data: platformAverages.value.map((p) => Number(p.avgROI.toFixed(2))),
      backgroundColor: ['#14b8a6', '#38bdf8', '#818cf8', '#f472b6', '#fbbf24'],
      borderRadius: 12,
      borderSkipped: false
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Average ROI by Platform',
      color: titleColor.value,
      font: { size: 16, weight: '700' }
    },
    tooltip: {
      backgroundColor: '#0b1220',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => ctx.parsed.y + '%'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: tickColor.value },
      grid: { display: false }
    },
    y: {
      ticks: {
        color: tickColor.value,
        callback: (value) => value + '%'
      },
      grid: { color: gridColor.value }
    }
  }
}))
</script>

<style scoped>
.chart-wrapper {
  height: 300px;
  width: 100%;
}
</style>
