import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import TambahBarang from './views/TambahBarang.vue'
import OrderBarang from './views/OrderBarang.vue'
import OrderHistory from './views/OrderHistory.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tambah',
      name: 'tambahBarang',
      component: TambahBarang
    },
    {
      path: '/order',
      name: 'orderBarang',
      component: OrderBarang
    },
    {
      path: '/orderHistory',
      name: 'orderHistory',
      component: OrderHistory
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
