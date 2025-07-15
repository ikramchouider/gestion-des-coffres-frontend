import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SignupView from '@/views/SignupView.vue';
import LoginView from '@/views/LoginView.vue';
import HistoryView from '@/views/HistoryView.vue';
import DashbordView from '@/views/DashbordView.vue';
import AddBoxView from '@/views/AddBoxView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Signup',
      name: 'Signup',
      component: SignupView,
    },
    {
      path: '/Login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/History/:id',
      name: 'History',
      component: HistoryView,
    },
        {
      path: '/Dashbord/add',
      name: 'add-box',
      component: AddBoxView,
    },
    {
      path: '/Dashbord',
      name: 'Dashbord',
      component: DashbordView,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;