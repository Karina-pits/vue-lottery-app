import { createApp } from 'vue';
import { configureAuthHandlers } from '@/shared/api';
import { registerServices } from '@/app/providers/services';
import { createAppPinia } from '@/app/providers/store';
import { router } from '@/app/providers/router';
import { useSessionStore } from '@/entities/session';
import '@/app/styles/main.scss';
import App from './App.vue';

registerServices();

const app = createApp(App);
app.use(createAppPinia());
app.use(router);

// HTTP-клієнт не знає про Pinia — підключаємо йому обробники авторизації
const auth = useSessionStore();
configureAuthHandlers({
  getAccessToken: () => auth.accessToken,
  refreshAccessToken: () => auth.refreshAccessToken(),
  onAuthFailure: () => {
    auth.logout();
    const current = router.currentRoute.value;
    // Під час початкової навігації редірект виконує сам guard
    if (current.matched.some((record) => record.meta.requiresAuth)) {
      void router.push({ name: 'login', query: { redirect: current.fullPath } });
    }
  },
});

app.mount('#app');
