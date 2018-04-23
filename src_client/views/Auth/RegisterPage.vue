<template lang='pug'>
#register
  label Username
    input(type='text' v-model='username')
  br
  label Email
    input(type='text' v-model='email')
  br
  label Password
    input(type='password' v-model='password')
  br
  button(@click='register') Sign In
</template>

<script>
import { REGISTER_MUTATION, LOGIN_MUTATION } from '../../graphql'

import authMixin from '../../mixins/auth'
export default {
  mixins: [authMixin],
  data: () => ({
    username: '',
    email: '',
    password: '',
  }),
  methods: {
    async register() {
      // Call to the graphql mutation
      try {
        await this.$apollo.mutate({
          mutation: REGISTER_MUTATION,
          variables: {
            username: this.username,
            email: this.email,
            password: this.password,
          },
        })

        this.login(data.data.register)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style>

</style>
