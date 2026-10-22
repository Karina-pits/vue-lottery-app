<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { LoginForm } from '@/features/auth';

const route = useRoute();
const router = useRouter();

/** Повертає внутрішній шлях для редіректу (захист від переходу на зовнішні адреси). */
function getRedirectPath(): string {
  const redirect = route.query.redirect;
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/users';
}
</script>

<template>
  <LoginForm @success="router.push(getRedirectPath())" />
</template>
