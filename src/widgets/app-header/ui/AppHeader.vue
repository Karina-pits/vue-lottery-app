<script setup lang="ts">
import { useSessionStore } from '@/entities/session';
import AppNavigation from './AppNavigation.vue';
import Logo from './Logo.vue';

const auth = useSessionStore();
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <Logo />
      <span v-if="auth.isAuthenticated" class="app-header__user">{{ auth.fullName }}</span>
      <AppNavigation />
    </div>
  </header>
</template>
