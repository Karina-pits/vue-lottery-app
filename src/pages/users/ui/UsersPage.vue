<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseAlert from '@/shared/ui/BaseAlert.vue';
import BaseButton from '@/shared/ui/BaseButton.vue';
import BasePagination from '@/shared/ui/BasePagination.vue';
import BaseSpinner from '@/shared/ui/BaseSpinner.vue';
import DeleteConfirmModal from '@/features/delete-user/ui/DeleteConfirmModal.vue';
import Modal from '@/shared/ui/Modal.vue';
import SearchBar from '@/features/search-users/ui/SearchBar.vue';
import UserForm from '@/features/user-form/ui/UserForm.vue';
import UsersTable from '@/widgets/users-table/ui/UsersTable.vue';
import WinnersBlock from '@/features/pick-winner/ui/WinnersBlock.vue';
import { PAGE_SIZE, useUsersStore } from '@/entities/user/model/users.store';
import { useWinnersStore } from '@/features/pick-winner/model/winners.store';
import type { CreateUserDto, User } from '@/entities/user/model/types';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const winnersStore = useWinnersStore();
const { users, total, isLoading, error } = storeToRefs(usersStore);
const { winners } = storeToRefs(winnersStore);

// Поточна сторінка та пошуковий запит зберігаються в query-параметрах URL
const page = computed(() => Math.max(1, Number(route.query.page) || 1));
const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''));
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)));
const startIndex = computed(() => (page.value - 1) * PAGE_SIZE);

watch(
  [page, searchQuery],
  () => {
    void usersStore.fetchUsers(page.value, searchQuery.value);
  },
  { immediate: true },
);

function changeQuery(changes: { page?: number; q?: string }): void {
  const query = { ...route.query, ...changes };
  const nextQuery = {
    ...query,
    page: query.page && Number(query.page) > 1 ? String(query.page) : undefined,
    q: query.q || undefined,
  };
  void router.push({ query: nextQuery });
}

function handleSearch(query: string): void {
  changeQuery({ q: query, page: 1 });
}

// --- Переможці ---
const canPickWinner = computed(() => !isLoading.value && winnersStore.canPickWinner(users.value));

// --- Створення користувача ---
const isCreateOpen = ref(false);
const isCreating = ref(false);
const createError = ref<string | null>(null);

function openCreate(): void {
  createError.value = null;
  isCreateOpen.value = true;
}

async function handleCreate(dto: CreateUserDto): Promise<void> {
  isCreating.value = true;
  createError.value = null;
  try {
    await usersStore.createUser(dto);
    isCreateOpen.value = false;
  } catch (e) {
    createError.value = (e as Error).message;
  } finally {
    isCreating.value = false;
  }
}

// --- Видалення користувача ---
const userToDelete = ref<User | null>(null);
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);

function askDelete(user: User): void {
  deleteError.value = null;
  userToDelete.value = user;
}

async function confirmDelete(id: number): Promise<void> {
  isDeleting.value = true;
  deleteError.value = null;
  try {
    await usersStore.removeUser(id);
    winnersStore.removeWinner(id); // видалений користувач зникає і з блоку переможців
    userToDelete.value = null;
  } catch (e) {
    deleteError.value = (e as Error).message;
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="page-stack">
    <WinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="winnersStore.pickRandomWinner(users)"
      @remove-winner="winnersStore.removeWinner"
    />

    <section class="card-block">
      <div class="table-block__toolbar">
        <SearchBar :model-value="searchQuery" @update:model-value="handleSearch" />
        <BaseButton @click="openCreate">Add user</BaseButton>
      </div>

      <BaseAlert v-if="error">{{ error }}</BaseAlert>
      <BaseSpinner v-if="isLoading" />
      <UsersTable v-else :users="users" :start-index="startIndex" @delete-user="askDelete" />

      <BasePagination
        :page="page"
        :total-pages="totalPages"
        @update:page="(value) => changeQuery({ page: value })"
      />
    </section>

    <Modal v-if="isCreateOpen" title="Додати користувача" @close="isCreateOpen = false">
      <UserForm
        submit-label="Create"
        :is-submitting="isCreating"
        :submit-error="createError"
        @submit="handleCreate"
        @cancel="isCreateOpen = false"
      />
    </Modal>

    <DeleteConfirmModal
      v-if="userToDelete"
      :user="userToDelete"
      :is-deleting="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
      @close="userToDelete = null"
    />
  </div>
</template>
