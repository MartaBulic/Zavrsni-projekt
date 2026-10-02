import { createRouter, createWebHistory } from 'vue-router'

import Splash from '../views/Splash.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import Layout from '../components/Layout.vue'

import Dashboard from '../views/Dashboard.vue'
import Campaigns from '../views/Campaigns.vue'
import Analytics from '../views/Analytics.vue'
import Reports from '../views/Reports.vue'
import Settings from '../views/Settings.vue'
import Profile from '../views/Profile.vue'

import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/splash',
    component: Splash
  },

  {
    path: '/login',
    component: Login
  },

  {
    path: '/register',
    component: Register
  },

  {
    path: '/',
    component: Layout,

    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'campaigns',
        component: Campaigns
      },
      {
        path: 'analytics',
        component: Analytics
      },
      {
        path: 'reports',
        component: Reports
      },
      {
        path: 'settings',
        component: Settings
      },
      {
        path: 'profile',
        component: Profile
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  const publicPages = ['/login', '/register', '/splash']

  const currentUser = authStore.currentUser

  // splash se prikazuje samo jednom po sesiji (sessionStorage), prije svega ostalog
  const splashShown = sessionStorage.getItem('splashShown') === 'true'

  if (!splashShown && to.path !== '/splash') {
    return '/splash'
  }

  // ako korisnik nije prijavljen, a ide na privatnu stranicu
  if (!publicPages.includes(to.path) && !currentUser) {
    return '/login'
  }

  // ako je već prijavljen i ide na login/register
  if ((to.path === '/login' || to.path === '/register') && currentUser) {
    return '/dashboard'
  }

  return true
})

export default router
