<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppButton } from '@/shared/ui';

const router = useRouter();
</script>

<template>
  <section class="card-block text-center">
    <h1 class="page-title">404</h1>
    <p>Сторінку не знайдено. Можливо, адреса введена неправильно.</p>
    <AppButton label="На головну" @click="router.push({ name: 'home' })" />
  </section>
</template>
