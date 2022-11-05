import { createRouter, createWebHashHistory  } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'
import OrdersView from '../views/OrdersView.vue'
import OrderHistory from '../views/OrderHistory.vue'
import AddUpdateFood from '../views/AddUpdateFood.vue'
import Accounting from '../views/Accounting.vue'
const router = createRouter({
  history: createWebHashHistory (import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path:'/orders',
      name:'orders',
      component:OrdersView
    },
    {
      path:'/orderhistory',
      name:'orderhistory',
      component:OrderHistory
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Registration
    },
    {
      path: '/addfood',
      name: 'addfood',
      component: AddUpdateFood
    },
    {
      path: '/updatefood/:id',
      name: 'updatefood',
      component: AddUpdateFood,
      props: true
    },
    {
      path: '/accounting',
      name: 'accounting',
      component: Accounting,
      props: true
    }
  ]
})

export default router
