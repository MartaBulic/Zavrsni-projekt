<template>
  <div>
    <div class="mb-4">
      <h1 class="fw-bold">Marketing Reports</h1>

      <p class="text-muted">Overview of your campaign results and generated insights</p>
    </div>

    <!-- TOP CARDS -->

    <div class="row g-4">
      <div class="col-md-3">
        <StatCard title="Campaigns" :value="totalCampaigns" icon="bi bi-megaphone" color="blue" />
      </div>

      <div class="col-md-3">
        <StatCard
          title="Total Budget"
          :value="'€ ' + formatCurrency(totalBudget)"
          icon="bi bi-wallet2"
          color="teal"
        />
      </div>

      <div class="col-md-3">
        <StatCard
          title="Revenue"
          :value="'€ ' + formatCurrency(totalRevenue)"
          icon="bi bi-cash-stack"
          color="green"
        />
      </div>

      <div class="col-md-3">
        <StatCard
          title="Average ROI"
          :value="averageROI + '%'"
          icon="bi bi-graph-up"
          color="purple"
        />
      </div>
    </div>

    <div class="row mt-4 g-4">
      <!-- PERFORMANCE -->

      <div class="col-lg-6">
        <div class="card-box">
          <h5 class="fw-bold">Performance Summary</h5>

          <hr />

          <div class="info-row">
            <span> Total clicks </span>

            <strong>
              {{ totalClicks }}
            </strong>
          </div>

          <div class="info-row">
            <span> Total conversions </span>

            <strong>
              {{ totalConversions }}
            </strong>
          </div>

          <div class="info-row">
            <span> Overall CTR </span>

            <strong> {{ averageCTR }}% </strong>
          </div>

          <div class="info-row">
            <span> Best Campaign </span>

            <strong>
              {{ bestCampaign }}
            </strong>
          </div>

          <div class="info-row">
            <span> Best Platform </span>

            <strong>
              {{ bestPlatform }}
            </strong>
          </div>
        </div>
      </div>

      <!-- RECOMMENDATIONS -->

      <div class="col-lg-6" v-if="showTips">
        <div class="card-box">
          <h5 class="fw-bold">Automatic Recommendations</h5>

          <hr />

          <div v-for="(item, index) in recommendations" :key="index" class="recommendation">
            <i class="bi bi-lightbulb-fill"></i>

            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <!-- ROI TABLE -->

    <div class="card-box mt-4">
      <h5 class="fw-bold mb-3">Campaign ROI Ranking</h5>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Campaign</th>

              <th>Platform</th>

              <th>ROI</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="campaign in sortedCampaigns" :key="campaign.id">
              <td class="fw-semibold">
                {{ campaign.name }}
              </td>

              <td>
                {{ campaign.platform }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="Number(calculateROI(campaign)) >= 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{ calculateROI(campaign) }}%
                </span>
              </td>
            </tr>

            <tr v-if="!campaigns.length">
              <td colspan="3" class="text-center text-muted py-4">No campaigns available.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useCampaignStore } from '../stores/campaign'

import { calculateROI, formatCurrency } from '../utils/metrics'
import StatCard from '../components/StatCard.vue'

const store = useCampaignStore()

const campaigns = computed(() => store.userCampaigns)

// SETTINGS CONNECTION

const showTips = computed(() => {
  return localStorage.getItem('performanceTips') !== 'false'
})

const totalCampaigns = computed(() => campaigns.value.length)

const totalBudget = computed(() => {
  return campaigns.value.reduce((sum, c) => sum + Number(c.budget || 0), 0)
})

const totalRevenue = computed(() => {
  return campaigns.value.reduce((sum, c) => sum + Number(c.revenue || 0), 0)
})

const totalClicks = computed(() => {
  return campaigns.value.reduce((sum, c) => sum + Number(c.clicks || 0), 0)
})

const totalConversions = computed(() => {
  return campaigns.value.reduce((sum, c) => sum + Number(c.conversions || 0), 0)
})

const averageCTR = computed(() => {
  let impressions = campaigns.value.reduce((sum, c) => sum + Number(c.impressions || 0), 0)

  if (!impressions) return 0

  return ((totalClicks.value / impressions) * 100).toFixed(2)
})

const averageROI = computed(() => {
  if (!campaigns.value.length) return 0

  let total = 0

  campaigns.value.forEach((c) => {
    total += Number(calculateROI(c))
  })

  return (total / campaigns.value.length).toFixed(2)
})

const bestCampaign = computed(() => {
  if (!campaigns.value.length) return 'No data'

  return [...campaigns.value].sort((a, b) => Number(calculateROI(b)) - Number(calculateROI(a)))[0]
    .name
})

const bestPlatform = computed(() => {
  if (!campaigns.value.length) return 'No data'

  let platforms = {}

  campaigns.value.forEach((c) => {
    if (!platforms[c.platform]) platforms[c.platform] = []

    platforms[c.platform].push(Number(calculateROI(c)))
  })

  let best = ''

  let value = -Infinity

  Object.keys(platforms).forEach((p) => {
    let avg = platforms[p].reduce((a, b) => a + b, 0) / platforms[p].length

    if (avg > value) {
      value = avg

      best = p
    }
  })

  return best
})

const recommendations = computed(() => {
  let result = []

  if (!campaigns.value.length) {
    return ['Add your first campaign to generate insights.']
  }

  if (Number(averageROI.value) < 50)
    result.push('ROI is low. Consider optimizing budget allocation.')

  if (Number(averageCTR.value) < 3)
    result.push('CTR is low. Improve creatives and audience targeting.')

  if (Number(averageROI.value) > 150)
    result.push('Excellent performance. Consider increasing campaign budget.')

  if (!result.length) result.push('Campaign performance is stable.')

  return result
})

const sortedCampaigns = computed(() => {
  return [...campaigns.value].sort((a, b) => Number(calculateROI(b)) - Number(calculateROI(a)))
})
</script>

<style scoped>
.card-box {
  background: var(--surface);

  padding: 25px;

  border-radius: 20px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;

  justify-content: space-between;

  padding: 12px 0;

  border-bottom: 1px solid var(--border);
}

.info-row:last-child {
  border: none;
}

.recommendation {
  background: var(--surface-soft);

  border-radius: 14px;

  padding: 15px;

  margin-bottom: 12px;
}

.recommendation i {
  color: #f59e0b;

  margin-right: 10px;
}

table th {
  color: var(--text-secondary);

  font-size: 0.9rem;
}
</style>
