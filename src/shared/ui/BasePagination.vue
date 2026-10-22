<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  'update:page': [page: number];
}>();

// Показуємо до 5 сторінок навколо поточної
const visiblePages = computed<number[]>(() => {
  const start = Math.max(1, Math.min(props.page - 2, props.totalPages - 4));
  const end = Math.min(props.totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

function go(page: number): void {
  if (page >= 1 && page <= props.totalPages && page !== props.page) {
    emit('update:page', page);
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Пагінація">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <button type="button" class="page-link" @click="go(page - 1)">‹</button>
      </li>
      <li
        v-for="item in visiblePages"
        :key="item"
        class="page-item"
        :class="{ active: item === page }"
      >
        <button type="button" class="page-link" @click="go(item)">{{ item }}</button>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <button type="button" class="page-link" @click="go(page + 1)">›</button>
      </li>
    </ul>
  </nav>
</template>
