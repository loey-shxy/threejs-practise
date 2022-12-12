import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/earth',
      component: () => import('@/views/pages/layout/layout.vue'),
      children: [
        {
          path: '/vr-house-viewing',
          name: 'vr-house-viewing',
          component: () => import('@/views/pages/vr-house-view/vr-house-view.vue')
        },
        {
          path: '/earth',
          name: 'earth',
          component: () => import('@/views/pages/earth/earth.vue')
        }
      ]
    }
  ]
})

export default router
