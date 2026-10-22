import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { configureAuthHandlers } from '@/shared/api';
import { registerServices } from '@/app/providers/services';
import { router } from '@/app/providers/router';
import { useAuthStore } from '@/entities/session/model/auth.store';
import '@/app/styles/main.scss';
import App from './App.vue';

registerServices();

const app = createApp(App);
app.use(createPinia());
app.use(router);

// HTTP-клієнт не знає про Pinia — підключаємо йому обробники авторизації
const auth = useAuthStore();
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
