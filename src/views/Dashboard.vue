<template>
  <div class="dashboard">
    <!-- HEADER -->

    <div class="dashboard-header">
      <div>
        <h1>Welcome back, {{ firstName }}!</h1>

        <p>Monitor your digital marketing performance</p>
      </div>

      <div class="campaign-count">
        <i class="bi bi-megaphone-fill"></i>

        <div>
          <span>Total campaigns</span>

          <strong>
            {{ campaigns.length }}
          </strong>
        </div>
      </div>
    </div>

    <!-- KPI CARDS -->

    <div class="row g-4 mb-4">
      <div v-for="card in cards" :key="card.title" class="col-xl-4 col-md-6">
        <StatCard
          gradient
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :color="card.class"
        />
      </div>
    </div>

    <!-- CHARTS -->

    <div class="row g-4 mb-4 align-items-stretch">
      <div class="col-xl-8">
        <div class="chart-card h-100">
          <div class="card-title">
            <h5>Campaign Performance</h5>

            <span> Last campaigns </span>
          </div>

          <BarChart />
        </div>
      </div>

      <div class="col-xl-4">
        <div class="chart-card h-100">
          <div class="card-title">
            <h5>Platforms</h5>
          </div>

          <PieChart />
        </div>
      </div>
    </div>

    <!-- REVENUE TREND -->

    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="chart-card">
          <RevenueTrendChart />
        </div>
      </div>
    </div>

    <!-- TABLE -->

    <div class="table-card">
      <div class="card-title">
        <h5>Top Performing Campaigns</h5>

        <button class="view-btn" @click="showAll = !showAll" v-if="campaigns.length > 3">
          {{ showAll ? 'Show less' : 'View all' }}
        </button>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>

              <th>Platform</th>

              <th>Clicks</th>

              <th>ROI</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="campaign in displayedCampaigns" :key="campaign.id">
              <td>
                <button class="campaign-name" @click="openCampaign(campaign)">
                  {{ campaign.name }}
                </button>
              </td>

              <td>
                <span class="platform">
                  {{ campaign.platform }}
                </span>
              </td>

              <td>
                {{ campaign.clicks }}
              </td>

              <td>
                <span
                  class="roi"
                  :class="Number(calculateROI(campaign)) >= 0 ? 'positive' : 'negative'"
                >
                  {{ calculateROI(campaign) }}%
                </span>
              </td>
            </tr>

            <tr v-if="!displayedCampaigns.length">
              <td colspan="4" class="empty">No campaigns available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CampaignDetailsModal
      :show="showModal"
      :campaign="selectedCampaign || {}"
      @close="closeCampaign"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useCampaignStore } from '../stores/campaign'

import { useAuthStore } from '../stores/auth'

import BarChart from '../components/BarChart.vue'

import PieChart from '../components/PieChart.vue'

import RevenueTrendChart from '../components/RevenueTrendChart.vue'

import CampaignDetailsModal from '../components/CampaignDetailsModal.vue'

import StatCard from '../components/StatCard.vue'

import { calculateROI, formatCurrency } from '../utils/metrics'

const store = useCampaignStore()

const auth = useAuthStore()

const campaigns = computed(() => store.userCampaigns)

const firstName = computed(() => {
  const name = auth.currentUser?.name || ''

  return name.split(' ')[0] || 'there'
})

const showModal = ref(false)

const selectedCampaign = ref(null)

const showAll = ref(false)

function openCampaign(c) {
  selectedCampaign.value = c

  showModal.value = true
}

function closeCampaign() {
  showModal.value = false

  selectedCampaign.value = null
}

const totalClicks = computed(() => campaigns.value.reduce((a, c) => a + Number(c.clicks || 0), 0))

const totalImpressions = computed(() =>
  campaigns.value.reduce((a, c) => a + Number(c.impressions || 0), 0)
)

const totalBudget = computed(() => campaigns.value.reduce((a, c) => a + Number(c.budget || 0), 0))

const totalRevenue = computed(() => campaigns.value.reduce((a, c) => a + Number(c.revenue || 0), 0))

const averageCTR = computed(() => {
  if (!totalImpressions.value) return 0

  return ((totalClicks.value / totalImpressions.value) * 100).toFixed(2)
})

const roi = computed(() => {
  if (!totalBudget.value) return 0

  return (((totalRevenue.value - totalBudget.value) / totalBudget.value) * 100).toFixed(2)
})

const cards = computed(() => [
  {
    title: 'Total Clicks',
    value: totalClicks.value,
    icon: 'bi bi-cursor-fill',
    class: 'blue'
  },

  {
    title: 'Impressions',
    value: totalImpressions.value,
    icon: 'bi bi-eye-fill',
    class: 'purple'
  },

  {
    title: 'Overall CTR',
    value: averageCTR.value + '%',
    icon: 'bi bi-graph-up-arrow',
    class: 'green'
  },

  {
    title: 'ROI',
    value: roi.value + '%',
    icon: 'bi bi-cash-stack',
    class: 'orange'
  },

  {
    title: 'Budget',
    value: '€ ' + formatCurrency(totalBudget.value),
    icon: 'bi bi-wallet2',
    class: 'teal'
  },

  {
    title: 'Revenue',
    value: '€ ' + formatCurrency(totalRevenue.value),
    icon: 'bi bi-bar-chart-fill',
    class: 'red'
  }
])

const sortedCampaigns = computed(() => {
  return [...campaigns.value].sort((a, b) => Number(calculateROI(b)) - Number(calculateROI(a)))
})

const displayedCampaigns = computed(() => {
  return showAll.value ? sortedCampaigns.value : sortedCampaigns.value.slice(0, 3)
})
</script>

<style scoped>
.dashboard {
  color: var(--text);
}

.dashboard-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 32px;

  font-weight: 800;

  margin: 0;
}

.dashboard-header p {
  color: var(--text-secondary);

  margin-top: 8px;
}

.campaign-count {
  background: var(--surface);

  border-radius: 20px;

  padding: 18px 25px;

  display: flex;

  gap: 15px;

  align-items: center;

  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.campaign-count i {
  font-size: 28px;

  color: #14b8a6;
}

.campaign-count span {
  display: block;

  font-size: 13px;

  color: var(--text-secondary);
}

.campaign-count strong {
  font-size: 24px;
}

.chart-card,
.table-card {
  background: var(--surface);

  border-radius: 22px;

  padding: 25px;

  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.card-title {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;
}

.card-title h5 {
  font-weight: 700;

  margin: 0;
}

.card-title span {
  color: var(--text-secondary);

  font-size: 13px;
}

table {
  width: 100%;

  border-collapse: collapse;
}

th {
  text-align: left;

  color: var(--text-secondary);

  font-size: 13px;

  padding: 15px;
}

td {
  padding: 16px;

  border-top: 1px solid var(--border);
}

.campaign-name {
  border: none;

  background: none;

  color: #0f766e;

  font-weight: 600;
}

.platform {
  background: #e0f2fe;

  color: #0369a1;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 13px;
}

.roi {
  padding: 6px 12px;

  border-radius: 20px;

  font-weight: 700;
}

.roi.positive {
  background: #dcfce7;

  color: #15803d;
}

.roi.negative {
  background: #fee2e2;

  color: #dc2626;
}

.view-btn {
  border: none;

  background: #14b8a6;

  color: white;

  padding: 8px 16px;

  border-radius: 12px;

  cursor: pointer;
}

.empty {
  text-align: center;

  color: #94a3b8;

  padding: 30px;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;

    align-items: flex-start;

    gap: 20px;
  }
}
</style>
