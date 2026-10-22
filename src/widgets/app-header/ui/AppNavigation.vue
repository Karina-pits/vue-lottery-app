<script setup lang="ts">
import { useSessionStore } from '@/entities/session';
import { LogoutButton } from '@/features/auth';

const session = useSessionStore();
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
    <LogoutButton v-if="session.isAuthenticated" />
    <RouterLink v-else class="app-nav__link" active-class="is-active" :to="{ name: 'login' }">
      Login
    </RouterLink>
  </nav>
</template>
