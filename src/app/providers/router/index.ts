import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/entities/session/model/auth.store';

declare module 'vue-router' {
  interface RouteMeta {
    /** Сторінка доступна лише авторизованим користувачам */
    requiresAuth?: boolean;
    /** Сторінка доступна лише гостям (напр. /login) */
    guestOnly?: boolean;
    /** Заголовок вкладки браузера */
    title?: string;
    /** Назва layout-а, у якому відображається сторінка */
    layout?: 'default' | 'auth';
  }
}

const APP_TITLE = 'Vue Lottery App';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomePage.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/ui/AboutPage.vue'),
      meta: { title: 'About author' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/ui/LoginPage.vue'),
      meta: { title: 'Login', layout: 'auth', guestOnly: true },
    },
    {
      // /users та всі вкладені маршрути потребують авторизації
      path: '/users',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'users',
          component: () => import('@/pages/users/ui/UsersPage.vue'),
          meta: { title: 'Users' },
        },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/pages/user-details/ui/UserDetailsPage.vue'),
          props: true,
          meta: { title: 'User details' },
          children: [
            {
              // вкладений маршрут: /users/:id/edit
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/pages/user-details/ui/UserEditPage.vue'),
              props: true,
              meta: { title: 'Edit user' },
            },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
      meta: { title: 'Page not found' },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.initSession();

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'users' };
  }
  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE;
});
