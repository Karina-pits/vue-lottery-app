<script setup lang="ts">
import Message from 'primevue/message';

withDefaults(defineProps<{ severity?: 'error' | 'success' | 'info' | 'warn' }>(), {
  severity: 'error',
});
</script>

<template>
  <Message :severity="severity" size="small">
    <slot />
  </Message>
</template>
