import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaigns: JSON.parse(localStorage.getItem('campaigns')) || []
  }),

  actions: {
    refreshCampaigns() {
      this.campaigns = JSON.parse(localStorage.getItem('campaigns')) || []
    },

    saveToLocalStorage() {
      localStorage.setItem('campaigns', JSON.stringify(this.campaigns))
    },

    addCampaign(campaign) {
      this.campaigns.push(campaign)
      this.saveToLocalStorage()
    },

    updateCampaign(updatedCampaign) {
      const index = this.campaigns.findIndex((c) => c.id === updatedCampaign.id)

      if (index !== -1) {
        this.campaigns.splice(index, 1, { ...updatedCampaign })
        this.saveToLocalStorage()
      }
    },

    deleteCampaign(id) {
      this.campaigns = this.campaigns.filter((c) => c.id !== id)
      this.saveToLocalStorage()
    }
  },

  getters: {
    userCampaigns: (state) => {
      const auth = useAuthStore()
      const user = auth.currentUser

      if (!user) return []

      return state.campaigns.filter((c) => c.userEmail === user.email)
    }
  }
})
