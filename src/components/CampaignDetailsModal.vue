<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <!-- HEADER -->
      <div class="modal-header">
        <div>
          <h3 class="fw-bold mb-1">
            {{ campaign.name }}
          </h3>
          <span class="badge bg-primary">
            {{ campaign.platform }}
          </span>
        </div>

        <button class="btn-close" @click="close"></button>
      </div>

      <!-- CONTENT SCROLL -->
      <div class="modal-content">
        <!-- METRICS -->
        <div class="row g-3 mt-3">
          <div class="col-md-4 col-6">
            <div class="metric-card">
              <small>Budget</small>
              <h4>€ {{ campaign.budget }}</h4>
            </div>
          </div>

          <div class="col-md-4 col-6">
            <div class="metric-card">
              <small>Revenue</small>
              <h4>€ {{ campaign.revenue }}</h4>
            </div>
          </div>

          <div class="col-md-4 col-6">
            <div class="metric-card">
              <small>ROI</small>
              <h4>{{ roi }}%</h4>
            </div>
          </div>

          <div class="col-md-4 col-6">
            <div class="metric-card">
              <small>Clicks</small>
              <h4>{{ campaign.clicks }}</h4>
            </div>
          </div>

          <div class="col-md-4 col-6">
            <div class="metric-card">
              <small>Impressions</small>
              <h4>{{ campaign.impressions }}</h4>
            </div>
          </div>

          <div class="col-md-4 col-6">
            <div class="metric-card">
              <small>CTR</small>
              <h4>{{ ctr }}%</h4>
            </div>
          </div>
        </div>

        <!-- CHART -->
        <div class="chart-box mt-4">
          <h5 class="fw-bold mb-3">Performance Overview</h5>

          <div class="chart-wrapper">
            <CampaignFunnelChart :campaign="campaign" />
          </div>
        </div>

        <!-- RECOMMENDATION -->

        <div v-if="showRecommendations" class="recommendation mt-4">
          <div class="d-flex">
            <i class="bi bi-lightbulb-fill text-warning fs-4 me-3"></i>

            <div>
              <h6 class="fw-bold mb-1">Campaign Recommendation</h6>

              <p class="mb-0">
                {{ recommendation }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="btn btn-primary px-4" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CampaignFunnelChart from './CampaignFunnelChart.vue'
import { calculateCTR, calculateROI } from '../utils/metrics'

const props = defineProps({
  show: Boolean,
  campaign: Object
})

const emit = defineEmits(['close'])

const showRecommendations = ref(localStorage.getItem('performanceTips') !== 'false')

function close() {
  emit('close')
}

const ctr = computed(() => calculateCTR(props.campaign))

const roi = computed(() => calculateROI(props.campaign))

const recommendation = computed(() => {
  const roiValue = Number(roi.value)
  const ctrValue = Number(ctr.value)

  if (roiValue > 150 && ctrValue > 5)
    return 'Excellent campaign performance. Consider increasing the budget and scaling this campaign.'

  if (roiValue > 50)
    return 'Good campaign performance. Continue optimizing targeting and creatives.'

  if (roiValue < 0)
    return 'This campaign is generating losses. Review budget allocation and audience targeting.'

  if (ctrValue < 3) return 'CTR is low. Improve creatives and audience targeting.'

  return 'Campaign performance is stable. Continue monitoring results.'
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(15, 23, 42, 0.55);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2000;

  padding: 20px;
}

.modal-container {
  background: var(--surface);

  width: 760px;

  max-width: 95%;

  max-height: 85vh;

  border-radius: 24px;

  padding: 24px;

  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);

  display: flex;

  flex-direction: column;
}

.modal-header {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  padding-bottom: 15px;

  border-bottom: 1px solid var(--border);
}

.modal-content {
  overflow-y: auto;

  padding-right: 5px;
}

.metric-card {
  background: var(--surface-soft);

  border: 1px solid var(--border);

  border-radius: 18px;

  padding: 15px;

  transition: 0.2s;
}

.metric-card:hover {
  transform: translateY(-3px);
}

.metric-card small {
  color: var(--text-secondary);
}

.metric-card h4 {
  margin-top: 8px;

  margin-bottom: 0;

  font-weight: 700;

  color: var(--text);
}

.chart-box {
  border: 1px solid var(--border);

  border-radius: 20px;

  padding: 18px;
}

.chart-wrapper {
  height: 260px;
}

.recommendation {
  background: #fffbeb;

  border: 1px solid #fde68a;

  border-radius: 18px;

  padding: 18px;

  color: #92400e;
}

.recommendation h6,
.recommendation p {
  color: #92400e;
}

.modal-footer {
  display: flex;

  justify-content: flex-end;

  padding-top: 15px;

  border-top: 1px solid var(--border);

  margin-top: 15px;
}
</style>
