// Registrira sve Chart.js elemente koje koriste komponente u src/components/*Chart.vue.
// Uvozi se jednom u main.js umjesto da svaka chart komponenta ponavlja svoju registraciju.
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler
)
