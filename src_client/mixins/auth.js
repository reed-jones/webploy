const authMixin = {
  methods: {
    logout: async function() {
      await this.$apollo.provider.defaultClient.cache.reset()
      localStorage.removeItem('access_token')
      this.$router.push({ name: 'home' })
    },
    login: async function(token) {
      localStorage.setItem('access_token', token)
      this.$router.push({ name: 'dashboard' })
    },
  },
}
export default authMixin
