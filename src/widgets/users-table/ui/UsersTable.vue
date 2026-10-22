<script setup lang="ts">
import type { User } from '@/entities/user/model/types';
import BaseButton from '@/shared/ui/BaseButton.vue';

defineProps<{
  users: User[];
  /** Номер першого рядка на сторінці (для колонки #) */
  startIndex: number;
}>();

const emit = defineEmits<{
  'delete-user': [user: User];
}>();
</script>

<template>
  <div class="table-responsive">
    <table class="users-table">
      <thead>
        <tr>
          <th class="col-index">#</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Age</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td class="col-index">{{ startIndex + index + 1 }}</td>
          <td>
            <RouterLink :to="{ name: 'user-details', params: { id: user.id } }">
              {{ user.firstName }} {{ user.lastName }}
            </RouterLink>
          </td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.age }}</td>
          <td>
            <div class="table-actions">
              <RouterLink
                class="btn btn-secondary"
                :to="{ name: 'user-edit', params: { id: user.id } }"
              >
                Редагувати
              </RouterLink>
              <BaseButton variant="danger" @click="emit('delete-user', user)">Видалити</BaseButton>
            </div>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="7" class="text-center text-muted py-3">Користувачів не знайдено.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
