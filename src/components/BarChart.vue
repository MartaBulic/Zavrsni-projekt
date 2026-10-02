<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { Bar } from 'vue-chartjs'

import { useCampaignStore } from '../stores/campaign'
import { useChartColors } from '../composables/useChartColors'

const { titleColor, tickColor, gridColor } = useChartColors()

const store = useCampaignStore()

const campaigns = computed(() => {
  return store.userCampaigns
})

const chartData = computed(() => {
  return {
    labels: campaigns.value.map((c) => c.name),

    datasets: [
      {
        label: 'Clicks',

        data: campaigns.value.map((c) => Number(c.clicks)),

        backgroundColor: ['#14b8a6', '#38bdf8', '#818cf8', '#c084fc', '#fb7185'],

        borderRadius: 12,

        borderSkipped: false
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

      text: 'Campaign Click Performance',

      color: titleColor.value,

      font: {
        size: 16,

        weight: '700'
      }
    },

    tooltip: {
      backgroundColor: '#0b1220',

      titleColor: '#ffffff',

      bodyColor: '#cbd5e1',

      padding: 12,

      cornerRadius: 10
    }
  },

  scales: {
    x: {
      ticks: {
        color: tickColor.value
      },

      grid: {
        display: false
      }
    },

    y: {
      beginAtZero: true,

      ticks: {
        color: tickColor.value
      },

      grid: {
        color: gridColor.value
      }
    }
  }
}))
</script>

<style scoped>
.chart-wrapper {
  height: 320px;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-wrapper {
    height: 260px;
  }
}
</style>
