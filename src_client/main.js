import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './routes/index.js'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
  // get the authentication token from localstorage if it exists
  const token = localStorage.getItem('access_token')

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost/graphql',
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default new Vue({
  el: '#app',
  router,
  provide: apolloProvider.provide(),
  render: h => h(App),
})
