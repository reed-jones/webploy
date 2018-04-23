import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// async function getPages() {
// const LandingPage = import('../views/LandingPage')
// }
// import().then(function(LandingPage) {
//   console.log(LandingPage)
// })
// const pages = {
//   LandingPage: import('../views/LandingPage'),
//   // blog: import('./pages/blog'),
// }
// import LandingPage from '../views/LandingPage'
const LandingPage = () => import('../views/LandingPage')
const LoginPage = () => import('../views/Auth/LoginPage')
const RegisterPage = () => import('../views/Auth/RegisterPage')
const DashBoard = () => import('../views/DashBoard')

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // if (USER DOES NOT EXIST IN LOCAL STORAGE) {
    if (!localStorage.access_token) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
