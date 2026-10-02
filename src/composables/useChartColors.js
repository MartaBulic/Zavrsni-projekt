import { computed } from 'vue'
import { useTheme } from './useTheme'

// Zajedničke boje za naslove/oznake na Chart.js grafovima, koje se prilagođavaju
// trenutnoj temi (light/dark). Koristi se u svim *Chart.vue komponentama.
export function useChartColors() {
  const { isDark } = useTheme()

  const titleColor = computed(() => (isDark.value ? '#e2e8f0' : '#1e293b'))
  const tickColor = computed(() => (isDark.value ? '#94a3b8' : '#475569'))
  const gridColor = computed(() =>
    isDark.value ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.15)'
  )
  // matches the card/surface background so pie/doughnut slice borders blend in, not clash
  const surfaceColor = computed(() => (isDark.value ? '#1e293b' : '#ffffff'))

  return { titleColor, tickColor, gridColor, surfaceColor }
}
