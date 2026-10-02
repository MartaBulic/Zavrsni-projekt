<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { Line } from 'vue-chartjs'

import { useCampaignStore } from '../stores/campaign'
import { useChartColors } from '../composables/useChartColors'

const { titleColor, tickColor, gridColor } = useChartColors()

const store = useCampaignStore()

const campaigns = computed(() => store.userCampaigns)

const sortedByDate = computed(() => {
  return [...campaigns.value]

    .filter((c) => c.startDate)

    .sort((a, b) => a.startDate.localeCompare(b.startDate))
})

const chartData = computed(() => {
  let running = 0

  const points = sortedByDate.value.map((c) => {
    running += Number(c.revenue || 0)

    return running
  })

  return {
    labels: sortedByDate.value.map((c) => c.startDate),

    datasets: [
      {
        label: 'Cumulative Revenue',
        data: points,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20,184,166,.18)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 3
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false
    },

    title: {
      display: true,
      text: 'Cumulative Revenue Over Time',
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
        label: (ctx) => '€ ' + ctx.parsed.y.toLocaleString('hr-HR')
      }
    }
  },

  scales: {
    x: {
      ticks: { color: tickColor.value },
      grid: { display: false }
    },

    y: {
      beginAtZero: true,
      ticks: {
        color: tickColor.value,
        callback: (value) => '€ ' + value
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
