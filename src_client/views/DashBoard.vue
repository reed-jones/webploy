<template lang='pug'>
#dashboard
  h1 Dashboard
  h2 Email: {{ me.email  }}
  h2 Username: {{ me.username }}
  h2 Verified: {{ me.verified }}
  router-link(:to=`{name: "home"}`) #[button Home]
  button(@click='logout') Logout

  .add-site(v-if='me.verified')
    label URL
      input(type='text' v-model="newSite.url")
    br
    label Repo
      input(type='text' v-model="newSite.repo")
    br
    label NPM Build Script (e.g. 'build')
      input(type='text' v-model="newSite.build_command")
    br
    label Build Directory (e.g. 'dist')
      input(type='text' v-model="newSite.public_directory")
    br
    button(@click='addSite') Add Site
  ul
    li(v-for="site in mySites") {{ site.url }}
      button(@click="buildSite(site.id)") Build Site!

</template>

<script>
import {
  ABOUT_ME_QUERY,
  ADD_SITE_MUTATION,
  BUILD_SITE_MUTATION,
  MY_SITES_QUERY,
} from '../graphql'
import authMixin from '../mixins/auth'
export default {
  mixins: [authMixin],
  data() {
    return {
      me: {
        // filled by apollo
      },
      mySites: {
        //
      },
      newSite: {
        url: '',
        repo: '',
        build_command: '',
        public_directory: '',
      },
    }
  },
  methods: {
    async addSite() {
      // Call to the graphql mutation
      try {
        let data = await this.$apollo.mutate({
          mutation: ADD_SITE_MUTATION,
          variables: {
            url: this.newSite.url,
            repo: this.newSite.repo,
            build_command: this.newSite.build_command,
            public_directory: this.newSite.public_directory,
          },
        })
        this.mySites = [...this.mySites, data.data.addSite]
      } catch (error) {
        console.error(error)
      }
    },
    async buildSite(id) {
      // Call to the graphql mutation
      try {
        let data = await this.$apollo.mutate({
          mutation: BUILD_SITE_MUTATION,
          variables: {
            id,
          },
        })
        // this.mySites = [...this.mySites, data.data.addSite]
        console.log('Site Builing!')
      } catch (error) {
        console.error(error)
      }
    },
  },
  apollo: {
    me: {
      query: ABOUT_ME_QUERY,
      error(error) {
        // could not get details about user
        console.log(error)
        this.logout()
      },
    },

    mySites: {
      query: MY_SITES_QUERY,
    },
  },
}
</script>

<style>

</style>
