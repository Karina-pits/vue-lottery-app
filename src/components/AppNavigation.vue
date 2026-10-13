<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function handleLogout(): Promise<void> {
  auth.logout();
  await router.push({ name: 'login' });
}
</script>

<template>
  <nav class="app-nav" aria-label="Головна навігація">
    <RouterLink class="app-nav__link" active-class="is-active" :to="{ name: 'home' }">
      Home
    </RouterLink>
    <RouterLink class="app-nav__link" active-class="is-active" :to="{ name: 'about' }">
      About author
    </RouterLink>
    <RouterLink class="app-nav__link" active-class="is-active" :to="{ name: 'users' }">
      Users
    </RouterLink>
    <button v-if="auth.isAuthenticated" type="button" class="app-nav__link" @click="handleLogout">
      Logout
    </button>
    <RouterLink v-else class="app-nav__link" active-class="is-active" :to="{ name: 'login' }">
      Login
    </RouterLink>
  </nav>
</template>
