import { createRouter, createWebHistory } from 'vue-router';
import Calendar from '@/views/Calendar.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: Calendar,
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/Teams.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
    },
  ],
});

export default router;
