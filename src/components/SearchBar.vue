<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
  'filter-by-name': [query: string];
}>();

const query = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

// Передача події filter-by-name реалізована через watch із затримкою (debounce) 300 мс,
// щоб не фільтрувати список учасників на кожне натискання клавіші.
watch(query, (value) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim());
  }, 300);
});

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <input
    v-model="query"
    type="text"
    class="form-control form-control-sm"
    style="max-width: 220px"
    placeholder="Search by name…"
    aria-label="Пошук учасників за іменем"
  />
</template>
