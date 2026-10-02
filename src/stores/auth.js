import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
  }),

  actions: {
    register(user) {
      const users = JSON.parse(localStorage.getItem('users')) || []

      const newUser = {
        ...user,

        email: user.email.trim().toLowerCase(),

        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }

      users.push(newUser)

      localStorage.setItem('users', JSON.stringify(users))
    },

    login(email, password) {
      const users = JSON.parse(localStorage.getItem('users')) || []

      const normalizedEmail = email.trim().toLowerCase()

      const found = users.find(
        (user) => user.email === normalizedEmail && user.password === password
      )

      if (found) {
        this.currentUser = found

        localStorage.setItem(
          'currentUser',

          JSON.stringify(found)
        )

        return true
      }

      return false
    },

    updateProfile(data) {
      if (!this.currentUser) return

      this.currentUser = {
        ...this.currentUser,

        ...data
      }

      localStorage.setItem(
        'currentUser',

        JSON.stringify(this.currentUser)
      )

      const users = JSON.parse(localStorage.getItem('users')) || []

      const index = users.findIndex((u) => u.email === this.currentUser.email)

      if (index !== -1) {
        users[index] = this.currentUser

        localStorage.setItem(
          'users',

          JSON.stringify(users)
        )
      }
    },

    logout() {
      this.currentUser = null

      localStorage.removeItem('currentUser')
    }
  }
})
