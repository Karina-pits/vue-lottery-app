<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();

const layouts = { default: DefaultLayout, auth: AuthLayout } as const;

// Layout вибирається через meta.layout у конфігурації маршруту
const layout = computed(() => layouts[route.meta.layout ?? 'default']);
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
