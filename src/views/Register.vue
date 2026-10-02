<template>
  <div class="register-page" data-bs-theme="light">
    <AuthBackground />

    <div class="card register-card" :class="{ leaving: isLeaving }">
      <div class="card-body p-4">
        <h2 class="text-center fw-bold mb-3">Register</h2>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <form @submit.prevent="registerUser">
          <div class="mb-2">
            <label class="form-label"> Full Name </label>

            <div class="input-icon">
              <i class="bi bi-person"></i>
              <input class="form-control" v-model="name" />
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label"> Email </label>

            <div class="input-icon">
              <i class="bi bi-envelope"></i>
              <input type="email" class="form-control" v-model="email" />
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label"> Password </label>

            <div class="input-icon">
              <i class="bi bi-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model="password"
              />
              <button
                type="button"
                class="toggle-password"
                tabindex="-1"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label"> Confirm Password </label>

            <div class="input-icon">
              <i class="bi bi-lock"></i>
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                v-model="confirmPassword"
              />
              <button
                type="button"
                class="toggle-password"
                tabindex="-1"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button class="btn btn-primary w-100" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            Register
          </button>
        </form>

        <hr />

        <p class="text-center">
          Already have an account?

          <a href="#" @click.prevent="goToLogin">Login</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import AuthBackground from '../components/AuthBackground.vue'

const router = useRouter()

const auth = useAuthStore()

const name = ref('')

const email = ref('')

const password = ref('')

const confirmPassword = ref('')

const error = ref('')

const success = ref('')

const showPassword = ref(false)

const showConfirmPassword = ref(false)

const isSubmitting = ref(false)

const isLeaving = ref(false)

function goToLogin() {
  isLeaving.value = true

  setTimeout(() => {
    router.push('/login')
  }, 200)
}

watch([name, email, password, confirmPassword], () => {
  error.value = ''
})

function registerUser() {
  error.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields.'

    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long.'

    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'

    return
  }

  const users = JSON.parse(localStorage.getItem('users')) || []

  const normalizedEmail = email.value.trim().toLowerCase()

  const exists = users.find((u) => u.email === normalizedEmail)

  if (exists) {
    error.value = 'User already exists.'

    return
  }

  auth.register({
    name: name.value,

    email: email.value,

    password: password.value
  })

  success.value = 'Registration successful!'

  isSubmitting.value = true

  setTimeout(() => {
    router.push('/login')
  }, 1500)
}
</script>

<style scoped>
/* Ova stranica namjerno ne koristi dijeljene --bg/--surface/--text varijable
   (i zaključava data-bs-theme na "light") tako da dark mode nigdje ne utječe na izgled. */
.register-page {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-soft: #f1f5f9;
  --text: #0f172a;
  --text-secondary: #64748b;
  --border: #e2e8f0;

  position: relative;
  min-height: 100vh;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
}

.register-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 470px;
  border: none;
  border-radius: 20px;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 25px 50px -15px rgba(11, 18, 32, 0.45);
  animation: card-in 0.35s ease;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.register-card.leaving {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-icon {
  position: relative;
}

.input-icon i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 15px;
}

.input-icon .form-control {
  padding-left: 42px;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--text);
}

.form-control {
  height: 44px;
  border-radius: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}

.form-control:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  outline: none;
}

.btn {
  height: 44px;
  font-weight: 600;
  border-radius: 10px;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

hr {
  margin: 14px 0;
}

a {
  color: #14b8a6;
  font-weight: 600;
  text-decoration: none;
}

a:hover {
  color: #0d9488;
  text-decoration: underline;
}

.error-message {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 15px;
}

.success-message {
  color: #16a34a;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}

@media (max-width: 576px) {
  .card-body {
    padding: 2rem 1.5rem !important;
  }

  .register-card {
    border-radius: 14px;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
