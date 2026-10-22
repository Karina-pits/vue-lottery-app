<script setup lang="ts">
import Paginator from 'primevue/paginator';

const props = defineProps<{
  /** Поточна сторінка (нумерація з 1) */
  page: number;
  total: number;
  pageSize: number;
}>();

const emit = defineEmits<{ 'update:page': [page: number] }>();
</script>

<template>
  <Paginator
    v-if="total > pageSize"
    :first="(props.page - 1) * pageSize"
    :rows="pageSize"
    :total-records="total"
    template="PrevPageLink PageLinks NextPageLink"
    @page="(event) => emit('update:page', event.page + 1)"
  />
</template>
