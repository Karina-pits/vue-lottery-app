<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { User } from '@/entities/user';
import { AppButton, AppTable } from '@/shared/ui';
import type { AppTableColumn } from '@/shared/ui';

defineProps<{
  users: User[];
  /** Кількість користувачів перед поточною сторінкою (для колонки #) */
  startIndex: number;
}>();

const emit = defineEmits<{
  'delete-user': [user: User];
}>();

const router = useRouter();

const columns: AppTableColumn[] = [
  { field: 'firstName', header: 'Name' },
  { field: 'username', header: 'Username' },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Phone number' },
  { field: 'age', header: 'Age' },
];
</script>

<template>
  <AppTable
    :rows="users"
    :columns="columns"
    show-index
    :start-index="startIndex"
    empty-text="Користувачів не знайдено."
  >
    <template #cell-firstName="{ row }">
      <RouterLink :to="{ name: 'user-details', params: { id: row.id } }">
        {{ row.firstName }} {{ row.lastName }}
      </RouterLink>
    </template>

    <template #actions="{ row }">
      <div class="table-actions">
        <AppButton
          label="Редагувати"
          severity="secondary"
          size="small"
          @click="router.push({ name: 'user-edit', params: { id: row.id } })"
        />
        <AppButton
          label="Видалити"
          severity="danger"
          size="small"
          @click="emit('delete-user', row)"
        />
      </div>
    </template>
  </AppTable>
</template>
