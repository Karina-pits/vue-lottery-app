<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header';
</script>

<template>
  <div class="layout-default">
    <AppHeader />
    <main class="layout-default__main">
      <slot />
    </main>
    <footer class="layout-default__footer">Vue Lottery App · Лабораторна робота №5</footer>
  </div>
</template>
