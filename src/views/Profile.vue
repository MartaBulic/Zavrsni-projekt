<template>
  <div>
    <!-- HEADER -->

    <div class="profile-header">
      <div class="avatar">
        {{ initial }}
      </div>

      <div class="profile-info">
        <h2 class="fw-bold mb-1">
          {{ user?.name }}
        </h2>

        <p class="email">
          {{ user?.email }}
        </p>

        <span class="role-badge">
          {{ user?.accountType || 'Analyst' }}
        </span>
      </div>

      <button class="edit-btn" @click="editing = !editing">
        <i class="bi bi-pencil"></i>

        Edit Profile
      </button>
    </div>

    <!-- EDIT -->

    <div v-if="editing" class="custom-card mt-4">
      <h5 class="fw-bold mb-4">Edit Profile</h5>

      <label> Name </label>

      <input v-model="name" class="form-control mb-3" />

      <label> Member since </label>

      <input type="date" v-model="memberSince" class="form-control mb-3" />

      <label> Account Type </label>

      <select v-model="accountType" class="form-control mb-3">
        <option>Analyst</option>

        <option>Manager</option>

        <option>Administrator</option>
      </select>

      <button class="save-btn" @click="saveProfile">Save Changes</button>
    </div>

    <div class="row g-4 mt-3">
      <!-- ACCOUNT -->

      <div class="col-lg-4">
        <div class="custom-card">
          <h5 class="fw-bold mb-4">Account Overview</h5>

          <div class="info-box">
            <div class="icon">
              <i class="bi bi-envelope"></i>
            </div>

            <div>
              <small> Email </small>

              <p>
                {{ user?.email }}
              </p>
            </div>
          </div>

          <div class="info-box">
            <div class="icon">
              <i class="bi bi-calendar"></i>
            </div>

            <div>
              <small> Member since </small>

              <p>
                {{ memberDate }}
              </p>
            </div>
          </div>

          <div class="info-box">
            <div class="icon">
              <i class="bi bi-person-badge"></i>
            </div>

            <div>
              <small> Account type </small>

              <p>
                {{ user?.accountType || 'Analyst' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- STATISTICS -->

      <div class="col-lg-8">
        <div class="custom-card">
          <h5 class="fw-bold mb-4">Marketing Statistics</h5>

          <div class="row g-3">
            <div class="col-md-4">
              <StatCard
                title="Campaigns"
                :value="campaigns.length"
                icon="bi bi-megaphone"
                color="blue"
              />
            </div>

            <div class="col-md-4">
              <StatCard
                title="Revenue"
                :value="'€' + formatCurrency(totalRevenue)"
                icon="bi bi-cash"
                color="green"
              />
            </div>

            <div class="col-md-4">
              <StatCard
                title="Average ROI"
                :value="averageROI + '%'"
                icon="bi bi-graph-up"
                color="purple"
              />
            </div>
          </div>
        </div>

        <div class="custom-card mt-4">
          <div class="d-flex justify-content-between">
            <h5 class="fw-bold">Profile Performance</h5>

            <strong> {{ score }}% </strong>
          </div>

          <div class="progress mt-3">
            <div class="progress-bar" :style="{ width: score + '%' }"></div>
          </div>

          <p class="description mt-3">
            Your score is calculated from campaign profitability and performance.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useAuthStore } from '../stores/auth'

import { useCampaignStore } from '../stores/campaign'

import { formatCurrency } from '../utils/metrics'
import StatCard from '../components/StatCard.vue'

const auth = useAuthStore()

const store = useCampaignStore()

const editing = ref(false)

const user = computed(() => auth.currentUser)

const name = ref(user.value?.name || '')

const memberSince = ref(user.value?.createdAt || '')

const accountType = ref(user.value?.accountType || 'Analyst')

const campaigns = computed(() => store.userCampaigns)

const initial = computed(() => {
  return user.value?.name?.charAt(0).toUpperCase() || '?'
})

const memberDate = computed(() => {
  if (!user.value?.createdAt) return '-'

  const date = new Date(user.value.createdAt)

  if (isNaN(date.getTime())) return user.value.createdAt

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

function saveProfile() {
  auth.updateProfile({
    name: name.value,

    createdAt: memberSince.value,

    accountType: accountType.value
  })

  editing.value = false
}

const totalRevenue = computed(() => {
  return campaigns.value.reduce(
    (sum, c) => sum + Number(c.revenue),

    0
  )
})

const averageROI = computed(() => {
  if (!campaigns.value.length) return 0

  let total = 0

  campaigns.value.forEach((c) => {
    if (c.budget) total += ((c.revenue - c.budget) / c.budget) * 100
  })

  return (total / campaigns.value.length).toFixed(2)
})

const score = computed(() => {
  if (!campaigns.value.length) return 0

  return Math.min(
    100,

    Math.round(Number(averageROI.value))
  )
})
</script>

<style scoped>
.profile-header {
  background: linear-gradient(#14b8a6);

  border-radius: 30px;

  padding: 25px;

  color: white;

  display: flex;

  align-items: center;

  gap: 25px;
}

.avatar {
  width: 100px;

  height: 100px;

  border-radius: 50%;

  background: white;

  color: #14b8a6;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 45px;

  font-weight: 800;
}

.profile-info {
  flex: 1;
}

.profile-header h2 {
  color: white;
}

.email {
  color: white;
  opacity: 0.9;
}

.role-badge {
  background: white;

  color: #14b8a6;

  padding: 7px 15px;

  border-radius: 20px;

  font-size: 14px;

  font-weight: 600;
}

.edit-btn {
  border: none;

  background: white;

  color: rgba(15, 23, 42, 0.95);

  padding: 10px 18px;

  border-radius: 12px;

  font-weight: 600;
}

.custom-card {
  background: var(--surface);

  border-radius: 22px;

  padding: 25px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.info-box {
  display: flex;

  gap: 15px;

  margin-bottom: 25px;
}

.icon {
  width: 40px;

  height: 40px;

  border-radius: 12px;

  background: #ccfbf1;

  color: #0f766e;

  display: flex;

  align-items: center;

  justify-content: center;
}

.info-box small {
  color: var(--text-secondary);
}

.info-box p {
  font-weight: 600;

  margin: 0;
}

.progress {
  height: 22px;

  border-radius: 20px;

  background: var(--border);
}

.progress-bar {
  background: linear-gradient(90deg, #14b8a6, #0aa593);

  border-radius: 20px;
}

.save-btn {
  background: linear-gradient(135deg, #14b8a6, #0f766e);

  color: white;

  border: none;

  padding: 10px 20px;

  border-radius: 12px;

  font-weight: 600;
}

.description {
  color: var(--text-secondary);
}

.form-control,
.form-select {
  border-radius: 12px;

  padding: 10px 14px;

  border: 1px solid var(--border);
}

.form-control:focus,
.form-select:focus {
  border-color: #14b8a6;

  box-shadow: 0 0 0 0.2rem rgba(20, 184, 166, 0.15);
}

@media (max-width: 576px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }

  .edit-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .custom-card {
    padding: 18px;
  }
}
</style>
