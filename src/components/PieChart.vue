<template>
  <div class="chart-wrapper">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { Doughnut } from 'vue-chartjs'

import { useCampaignStore } from '../stores/campaign'
import { useChartColors } from '../composables/useChartColors'

const { titleColor, tickColor, surfaceColor } = useChartColors()

const store = useCampaignStore()

const campaigns = computed(() => store.userCampaigns)

const chartData = computed(() => {
  const platforms = {}

  campaigns.value.forEach((c) => {
    platforms[c.platform] = (platforms[c.platform] || 0) + 1
  })

  return {
    labels: Object.keys(platforms),

    datasets: [
      {
        label: 'Platforms',

        data: Object.values(platforms),

        backgroundColor: ['#14b8a6', '#38bdf8', '#818cf8', '#f472b6', '#fbbf24'],

        borderColor: surfaceColor.value,
        borderWidth: 1,

        hoverOffset: 8
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,

  maintainAspectRatio: false,

  cutout: '70%',

  plugins: {
    legend: {
      position: 'bottom',

      labels: {
        color: tickColor.value,

        padding: 20,

        font: {
          size: 13
        }
      }
    },

    title: {
      display: true,

      text: 'Campaign Platforms',

      color: titleColor.value,

      font: {
        size: 16,

        weight: '700'
      }
    },

    tooltip: {
      backgroundColor: '#0b1220',

      padding: 12,

      cornerRadius: 10
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
    height: 230px;
  }
}
</style>
