<script setup lang="ts">
import { useSessionStore } from '@/entities/session';
import { ThemeToggle } from '@/features/theme-toggle';
import AppNavigation from './AppNavigation.vue';
import Logo from './Logo.vue';

const session = useSessionStore();
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <Logo />
      <AppNavigation />
      <span v-if="session.isAuthenticated" class="app-header__user">{{ session.fullName }}</span>
      <ThemeToggle />
    </div>
  </header>
</template>
