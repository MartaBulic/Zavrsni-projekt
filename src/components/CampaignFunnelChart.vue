<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useChartColors } from '../composables/useChartColors'

const { titleColor, tickColor, gridColor } = useChartColors()

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

const chartData = computed(() => ({
  labels: ['Impressions', 'Clicks', 'Conversions'],
  datasets: [
    {
      label: 'Funnel',
      data: [
        Number(props.campaign.impressions) || 0,
        Number(props.campaign.clicks) || 0,
        Number(props.campaign.conversions) || 0
      ],
      backgroundColor: ['#38bdf8', '#14b8a6', '#818cf8'],
      borderRadius: 12,
      borderSkipped: false
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Conversion Funnel',
      color: titleColor.value,
      font: { size: 16, weight: '700' }
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
      beginAtZero: true,
      ticks: { color: tickColor.value },
      grid: { color: gridColor.value }
    },
    y: {
      ticks: { color: tickColor.value },
      grid: { display: false }
    }
  }
}))
</script>

<style scoped>
.chart-wrapper {
  height: 260px;
  width: 100%;
}
</style>
