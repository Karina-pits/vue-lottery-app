<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
</script>

<template>
  <div class="app-spinner" role="status" aria-live="polite">
    <ProgressSpinner style="width: 2.5rem; height: 2.5rem" :stroke-width="5" />
    <p class="app-spinner__text"><slot>Завантаження…</slot></p>
  </div>
</template>
