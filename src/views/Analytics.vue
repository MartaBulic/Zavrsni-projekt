<template>
  <div>
    <div class="mb-4">
      <h1 class="fw-bold">Analytics</h1>
      <p class="text-muted">Detailed performance analysis of your marketing campaigns</p>
    </div>

    <!-- DATE FILTER -->
    <div class="card border-0 shadow-sm p-4 mb-4">
      <div class="date-filter">
        <div class="date-inputs">
          <div>
            <label class="form-label small text-muted mb-1">From</label>
            <input type="date" class="form-control" v-model="dateFrom" />
          </div>

          <div>
            <label class="form-label small text-muted mb-1">To</label>
            <input type="date" class="form-control" v-model="dateTo" />
          </div>
        </div>

        <div class="date-presets">
          <button class="preset-btn" @click="setPreset(7)">Last 7 days</button>
          <button class="preset-btn" @click="setPreset(30)">Last 30 days</button>
          <button class="preset-btn" @click="clearDateFilter">All time</button>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">Campaign Performance</h4>

        <span class="badge bg-primary"> {{ filteredCampaigns.length }} campaigns </span>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Platform</th>
              <th>CTR</th>
              <th>Conversion</th>
              <th>CPC</th>
              <th>CPA</th>
              <th>ROI</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="campaign in filteredCampaigns" :key="campaign.id">
              <td>
                <div class="fw-semibold">
                  {{ campaign.name }}
                </div>
                <small class="text-muted">
                  {{ campaign.objective }}
                </small>
              </td>

              <td>
                <span class="badge bg-light text-dark">
                  {{ campaign.platform }}
                </span>
              </td>

              <td>{{ calculateCTR(campaign) }}%</td>

              <td>{{ calculateConversion(campaign) }}%</td>

              <td>€{{ calculateCPC(campaign) }}</td>

              <td>€{{ calculateCPA(campaign) }}</td>

              <td>
                <span
                  class="badge"
                  :class="Number(calculateROI(campaign)) >= 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{ calculateROI(campaign) }}%
                </span>
              </td>
            </tr>

            <tr v-if="!filteredCampaigns.length">
              <td colspan="7" class="text-center text-muted py-5">
                No campaigns in this date range.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row mt-4 g-4">
      <div class="col-md-4">
        <StatCard
          title="Best Campaign"
          :value="bestCampaign"
          icon="bi bi-trophy-fill"
          color="blue"
        />
      </div>

      <div class="col-md-4">
        <StatCard
          title="Average CTR"
          :value="averageCTR + '%'"
          icon="bi bi-graph-up-arrow"
          color="green"
        />
      </div>

      <div class="col-md-4">
        <StatCard
          title="Average ROI"
          :value="averageROI + '%'"
          icon="bi bi-cash-stack"
          color="purple"
        />
      </div>
    </div>

    <div class="row mt-4 g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm p-4">
          <PlatformPerformanceChart :campaigns="filteredCampaigns" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCampaignStore } from '../stores/campaign'
import {
  calculateCTR,
  calculateConversionRate as calculateConversion,
  calculateCPC,
  calculateCPA,
  calculateROI
} from '../utils/metrics'
import StatCard from '../components/StatCard.vue'
import PlatformPerformanceChart from '../components/PlatformPerformanceChart.vue'

const store = useCampaignStore()

const campaigns = computed(() => store.userCampaigns)

const dateFrom = ref('')
const dateTo = ref('')

const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    if (dateFrom.value && c.startDate && c.startDate < dateFrom.value) return false
    if (dateTo.value && c.startDate && c.startDate > dateTo.value) return false
    return true
  })
})

function setPreset(days) {
  const to = new Date()
  const from = new Date()

  from.setDate(to.getDate() - days)

  dateTo.value = to.toISOString().slice(0, 10)
  dateFrom.value = from.toISOString().slice(0, 10)
}

function clearDateFilter() {
  dateFrom.value = ''
  dateTo.value = ''
}

const averageCTR = computed(() => {
  if (!filteredCampaigns.value.length) return 0

  let total = 0

  filteredCampaigns.value.forEach((c) => {
    total += Number(calculateCTR(c))
  })

  return (total / filteredCampaigns.value.length).toFixed(2)
})

const averageROI = computed(() => {
  if (!filteredCampaigns.value.length) return 0

  let total = 0

  filteredCampaigns.value.forEach((c) => {
    total += Number(calculateROI(c))
  })

  return (total / filteredCampaigns.value.length).toFixed(2)
})

const bestCampaign = computed(() => {
  if (!filteredCampaigns.value.length) return 'No data'

  return [...filteredCampaigns.value].sort(
    (a, b) => Number(calculateROI(b)) - Number(calculateROI(a))
  )[0].name
})
let refreshInterval = null

onMounted(() => {
  const enabled = localStorage.getItem('autoRefresh') !== 'false'

  if (enabled) {
    refreshInterval = setInterval(() => {
      store.refreshCampaigns()
    }, 30000)
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.card {
  border-radius: 20px;
}

table th {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.date-filter {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}

.date-inputs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.date-presets {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-btn {
  background: var(--surface-soft);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
}

.preset-btn:hover {
  background: var(--border);
}

@media (max-width: 576px) {
  .date-filter {
    align-items: stretch;
  }

  .date-inputs {
    flex-direction: column;
  }
}
</style>
