<template>
  <div class="campaigns-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Campaigns</h1>
        <p>Create, manage and optimize your digital marketing campaigns</p>
      </div>

      <div class="header-actions">
        <button class="export-btn" @click="exportCSV" :disabled="!campaigns.length">
          <i class="bi bi-download"></i>
          Export CSV
        </button>

        <button class="new-btn" @click="showCreateForm">
          <i class="bi bi-plus-lg"></i>
          New Campaign
        </button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="stats-grid">
      <StatCard
        title="Total campaigns"
        :value="campaigns.length"
        icon="bi bi-megaphone-fill"
        color="blue"
      />

      <StatCard
        title="Active campaigns"
        :value="activeCampaigns"
        icon="bi bi-lightning-charge-fill"
        color="green"
      />

      <StatCard
        title="Best ROI"
        :value="bestROI + '%'"
        icon="bi bi-graph-up-arrow"
        color="purple"
      />

      <StatCard
        title="Total revenue"
        :value="'€ ' + formatCurrency(totalRevenue)"
        icon="bi bi-cash-stack"
        color="teal"
      />
    </div>

    <!-- Campaign form -->
    <div v-if="showForm" ref="formSection" class="card-box form-card">
      <div class="section-header">
        <div>
          <h4>{{ editing ? 'Edit Campaign' : 'Create New Campaign' }}</h4>
          <p>Fill in the campaign details below</p>
        </div>

        <span v-if="editing" class="status-badge editing"> Editing </span>
      </div>

      <div v-if="formError" class="form-error">
        <i class="bi bi-exclamation-circle-fill"></i>
        {{ formError }}
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Campaign name</label>
          <input class="form-control" v-model="campaign.name" placeholder="e.g. Summer Sale 2026" />
        </div>

        <div class="form-group">
          <label>Platform</label>
          <select class="form-select" v-model="campaign.platform">
            <option>Facebook</option>
            <option>Instagram</option>
            <option>Google Ads</option>
            <option>TikTok</option>
          </select>
        </div>

        <div class="form-group">
          <label>Objective</label>
          <select class="form-select" v-model="campaign.objective">
            <option>Traffic</option>
            <option>Sales</option>
            <option>Leads</option>
            <option>Brand Awareness</option>
          </select>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select class="form-select" v-model="campaign.status">
            <option>Active</option>
            <option>Completed</option>
            <option>Paused</option>
          </select>
        </div>

        <div class="form-group">
          <label>Start date</label>
          <input type="date" class="form-control" v-model="campaign.startDate" />
        </div>

        <div class="form-group">
          <label>End date</label>
          <input type="date" class="form-control" v-model="campaign.endDate" />
        </div>

        <div class="form-group">
          <label>Budget (€)</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="campaign.budget"
            placeholder="0.00"
          />
        </div>

        <div class="form-group">
          <label>Revenue (€)</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="campaign.revenue"
            placeholder="0.00"
          />
        </div>

        <div class="form-group">
          <label>Clicks</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="campaign.clicks"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label>Impressions</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="campaign.impressions"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label>Conversions</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="campaign.conversions"
            placeholder="0"
          />
        </div>
      </div>

      <div class="form-actions">
        <button class="save-btn" :disabled="isSaving" @click="saveCampaign">
          <i class="bi bi-check-circle-fill"></i>
          {{ editing ? 'Update Campaign' : 'Save Campaign' }}
        </button>

        <button class="cancel-btn" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card-box filters-card">
      <div class="filters-grid">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="search" placeholder="Search campaigns..." />
        </div>

        <select class="form-select" v-model="platformFilter">
          <option value="">All Platforms</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>Google Ads</option>
          <option>TikTok</option>
        </select>

        <select class="form-select" v-model="statusFilter">
          <option value="">All Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Paused</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card-box table-card">
      <div class="section-header">
        <div>
          <h4>My Campaigns</h4>
          <p>{{ filteredCampaigns.length }} campaigns found</p>
        </div>
      </div>

      <div class="table-responsive">
        <table class="campaign-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Revenue</th>
              <th>CTR</th>
              <th>ROI</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in filteredCampaigns" :key="item.id">
              <td>
                <div class="campaign-info">
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.startDate }} - {{ item.endDate }}</small>
                </div>
              </td>

              <td>
                <span class="platform-badge">
                  {{ item.platform }}
                </span>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="{
                    active: item.status === 'Active',
                    completed: item.status === 'Completed',
                    paused: item.status === 'Paused'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>

              <td>€ {{ formatCurrency(item.budget) }}</td>
              <td>€ {{ formatCurrency(item.revenue) }}</td>
              <td>{{ calculateCTR(item) }}%</td>

              <td>
                <span
                  class="roi-badge"
                  :class="Number(calculateROI(item)) >= 0 ? 'positive' : 'negative'"
                >
                  {{ calculateROI(item) }}%
                </span>
              </td>

              <td class="actions">
                <button class="action-btn edit" @click="editCampaign(item)">
                  <i class="bi bi-pencil-square"></i>
                </button>

                <button class="action-btn delete" @click="remove(item.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="!filteredCampaigns.length">
              <td colspan="8" class="empty-state">
                <i class="bi bi-folder2-open"></i>
                <p>No campaigns found</p>
                <span>Create your first campaign to start tracking performance</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, nextTick } from 'vue'
import { useCampaignStore } from '../stores/campaign'
import { useAuthStore } from '../stores/auth'
import { calculateROI, calculateCTR, formatCurrency } from '../utils/metrics'
import { downloadFile, csvEscape } from '../utils/download'
import StatCard from '../components/StatCard.vue'

const store = useCampaignStore()
const auth = useAuthStore()
const campaigns = computed(() => store.userCampaigns)

const editing = ref(false)
const showForm = ref(false)
const search = ref('')
const platformFilter = ref('')
const statusFilter = ref('')
const formSection = ref(null)
const formError = ref('')
const isSaving = ref(false)

const emptyCampaign = {
  id: null,
  name: '',
  platform: 'Facebook',
  objective: 'Traffic',
  status: 'Active',
  startDate: '',
  endDate: '',
  budget: 0,
  revenue: 0,
  clicks: 0,
  impressions: 0,
  conversions: 0
}

const campaign = reactive({ ...emptyCampaign })

function scrollToForm() {
  nextTick(() => {
    formSection.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}

function showCreateForm() {
  cancelEdit()
  showForm.value = true
  scrollToForm()
}

function exportCSV() {
  const headers = [
    'Name',
    'Platform',
    'Objective',
    'Status',
    'Start Date',
    'End Date',
    'Budget',
    'Revenue',
    'Clicks',
    'Impressions',
    'Conversions',
    'CTR (%)',
    'ROI (%)'
  ]

  const rows = campaigns.value.map((c) => [
    c.name,
    c.platform,
    c.objective,
    c.status,
    c.startDate,
    c.endDate,
    c.budget,
    c.revenue,
    c.clicks,
    c.impressions,
    c.conversions,
    calculateCTR(c),
    calculateROI(c)
  ])

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')

  downloadFile(csv, 'campaigns.csv', 'text/csv;charset=utf-8')
}

const filteredCampaigns = computed(() => {
  const term = search.value.trim().toLowerCase()

  return campaigns.value
    .filter((c) => {
      const searchMatch = c.name.toLowerCase().includes(term)
      const platformMatch = !platformFilter.value || c.platform === platformFilter.value
      const statusMatch = !statusFilter.value || c.status === statusFilter.value
      return searchMatch && platformMatch && statusMatch
    })
    .sort((a, b) => Number(calculateROI(b)) - Number(calculateROI(a)))
})

const activeCampaigns = computed(() => campaigns.value.filter((c) => c.status === 'Active').length)

const totalRevenue = computed(() => campaigns.value.reduce((sum, c) => sum + Number(c.revenue), 0))

const bestROI = computed(() => {
  if (!campaigns.value.length) return 0
  return Math.max(...campaigns.value.map((c) => Number(calculateROI(c)))).toFixed(2)
})

function validateCampaign() {
  if (!campaign.name.trim()) {
    return 'Please enter campaign name.'
  }

  if (campaign.budget < 0 || campaign.revenue < 0) {
    return 'Budget and revenue cannot be negative.'
  }

  if (campaign.clicks < 0 || campaign.impressions < 0 || campaign.conversions < 0) {
    return 'Clicks, impressions and conversions cannot be negative.'
  }

  if (campaign.clicks > campaign.impressions && campaign.impressions > 0) {
    return 'Clicks cannot be greater than impressions.'
  }

  if (campaign.startDate && campaign.endDate && campaign.startDate > campaign.endDate) {
    return 'Start date cannot be after end date.'
  }

  return ''
}

function saveCampaign() {
  if (isSaving.value) return

  formError.value = validateCampaign()

  if (formError.value) return

  isSaving.value = true

  const data = {
    ...campaign,
    id: editing.value ? campaign.id : Date.now(),
    userEmail: auth.currentUser.email
  }

  if (editing.value) {
    store.updateCampaign(data)
  } else {
    store.addCampaign(data)
  }

  cancelEdit()
  showForm.value = false
  isSaving.value = false
}

function editCampaign(item) {
  editing.value = true
  showForm.value = true
  formError.value = ''

  Object.assign(campaign, item)

  scrollToForm()
}

function cancelEdit() {
  editing.value = false
  showForm.value = false
  formError.value = ''

  Object.assign(campaign, { ...emptyCampaign })
}

function remove(id) {
  if (confirm('Delete this campaign?')) {
    store.deleteCampaign(id)
  }
}
</script>

<style scoped>
.campaigns-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header,
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  margin: 0;
}

.page-header p,
.section-header p {
  color: var(--text-secondary);
  margin: 6px 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.new-btn,
.save-btn {
  background: linear-gradient(135deg, #14b8a6, #0f766e);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 600;
}

.export-btn {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 600;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 18px;
}

.form-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 14px;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.card-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-top: 24px;
}

.form-group label {
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  display: block;
}

.form-control,
.form-select {
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 12px 14px;
}

.form-control::placeholder {
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-box input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid var(--border);
  border-radius: 14px;
}

.search-box input::placeholder {
  color: var(--text-secondary);
}

.campaign-table {
  width: 100%;
  border-collapse: collapse;
}

.campaign-table th {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
}

.campaign-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border);
}

.campaign-info {
  display: flex;
  flex-direction: column;
}

.campaign-info strong {
  color: var(--text);
}

.campaign-info small {
  color: var(--text-secondary);
}

.platform-badge {
  background: #ecfeff;
  color: #0f766e;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.completed {
  background: #e2e8f0;
  color: #475569;
}

.status-badge.paused {
  background: #fef3c7;
  color: #b45309;
}

.roi-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.roi-badge.positive {
  background: #dcfce7;
  color: #15803d;
}

.roi-badge.negative {
  background: #fee2e2;
  color: #dc2626;
}

.actions {
  text-align: right;
}

.action-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 12px;
  margin-left: 8px;
}

.action-btn.edit {
  background: #eff6ff;
  color: #2563eb;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 42px;
  color: var(--text-secondary);
}

@media (max-width: 991px) {
  .stats-grid,
  .form-grid,
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .page-header,
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .card-box {
    padding: 18px;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .new-btn,
  .header-actions .export-btn {
    flex: 1;
  }
}
</style>
