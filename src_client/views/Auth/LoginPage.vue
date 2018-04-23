<template lang='pug'>
#login
  label Email
    input(type='text' v-model='email')
  label Password
    input(type='password' v-model='password')
  button(@click='AttemptSignIn') Sign In
</template>

<script>
import { LOGIN_MUTATION } from '../../graphql'

import authMixin from '../../mixins/auth'
export default {
  mixins: [authMixin],
  data: () => ({
    email: 'reedjones@reedjones.com',
    password: 'password',
  }),
  methods: {
    async AttemptSignIn() {
      // Call to the graphql mutation
      try {
        let data = await this.$apollo.mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            email: this.email,
            password: this.password,
          },
        })
        this.login(data.data.login)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style>

</style>
