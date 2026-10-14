<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ modelValue?: string }>(), { modelValue: '' });

const emit = defineEmits<{
  'update:modelValue': [query: string];
}>();

const query = ref(props.modelValue);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

// Значення з URL змінилось ззовні (кнопка "назад", скидання) — синхронізуємо поле.
watch(
  () => props.modelValue,
  (value) => {
    query.value = value;
  },
);

// Подія надсилається з затримкою (debounce) 300 мс, щоб не робити запит на кожну літеру.
watch(query, (value) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const trimmed = value.trim();
    if (trimmed !== props.modelValue) {
      emit('update:modelValue', trimmed);
    }
  }, 300);
});

onBeforeUnmount(() => clearTimeout(debounceTimer));
</script>

<template>
  <input
    v-model="query"
    type="search"
    class="form-control"
    placeholder="Search by name…"
    aria-label="Пошук користувачів за іменем"
  />
</template>
