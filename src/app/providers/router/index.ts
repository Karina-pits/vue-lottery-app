import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/entities/session';

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
      component: () => import('@/pages/home').then((m) => m.HomePage),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about').then((m) => m.AboutPage),
      meta: { title: 'About author' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login').then((m) => m.LoginPage),
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
          component: () => import('@/pages/users').then((m) => m.UsersPage),
          meta: { title: 'Users' },
        },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
          props: true,
          meta: { title: 'User details' },
          children: [
            {
              // вкладений маршрут: /users/:id/edit
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/pages/user-details').then((m) => m.UserEditPage),
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
      component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
      meta: { title: 'Page not found' },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useSessionStore();
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
