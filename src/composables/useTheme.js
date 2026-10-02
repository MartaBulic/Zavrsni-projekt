import { ref, watch } from 'vue'

// Jedan dijeljeni ref za cijelu aplikaciju - svaka komponenta koja pozove
// useTheme() dobiva isto stanje, bez potrebe za Pinia store-om.
const isDark = ref(localStorage.getItem('theme') === 'dark')

function applyTheme() {
  const theme = isDark.value ? 'dark' : 'light'

  document.documentElement.setAttribute('data-theme', theme)

  // Bootstrap 5.3+ built-in color mode - adapts .table, .card, .badge, .form-control, etc.
  document.documentElement.setAttribute('data-bs-theme', theme)
}

applyTheme()

watch(isDark, (value) => {
  localStorage.setItem('theme', value ? 'dark' : 'light')
  applyTheme()
})

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
