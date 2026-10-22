<script setup lang="ts">
import { Logo } from '@/widgets/app-header';
</script>

<template>
  <div class="layout-auth">
    <Logo />
    <div class="layout-auth__card">
      <slot />
    </div>
  </div>
</template>
