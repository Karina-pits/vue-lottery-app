<script setup lang="ts" generic="T extends object">
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

export interface AppTableColumn {
  field: string;
  header: string;
}

withDefaults(
  defineProps<{
    rows: T[];
    columns: AppTableColumn[];
    rowKey?: string;
    loading?: boolean;
    /** Показувати колонку з порядковим номером (#) */
    showIndex?: boolean;
    startIndex?: number;
    emptyText?: string;
  }>(),
  {
    rowKey: 'id',
    loading: false,
    showIndex: false,
    startIndex: 0,
    emptyText: 'Немає даних.',
  },
);

defineSlots<{
  /** Власний вміст комірки колонки: слот `cell-<field>` */
  [key: `cell-${string}`]: (props: { row: T }) => unknown;
  /** Остання колонка з діями над рядком */
  actions?: (props: { row: T }) => unknown;
}>();

function cellValue(row: T, field: string): unknown {
  return (row as Record<string, unknown>)[field];
}
</script>

<template>
  <DataTable :value="rows" :data-key="rowKey" :loading="loading" size="small" striped-rows>
    <Column v-if="showIndex" header="#" class="app-table__index">
      <template #body="{ index }">{{ startIndex + index + 1 }}</template>
    </Column>
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
    >
      <template #body="{ data }">
        <slot :name="`cell-${column.field}`" :row="data as T">
          {{ cellValue(data as T, column.field) }}
        </slot>
      </template>
    </Column>
    <Column v-if="$slots.actions" header="">
      <template #body="{ data }">
        <slot name="actions" :row="data as T" />
      </template>
    </Column>
    <template #empty>{{ emptyText }}</template>
  </DataTable>
</template>
