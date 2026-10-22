<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PAGE_SIZE, useUsersStore } from '@/entities/user';
import type { CreateUserDto, User } from '@/entities/user';
import { DeleteUserDialog } from '@/features/delete-user';
import { useWinnersStore, WinnersBlock } from '@/features/pick-winner';
import { SearchBar } from '@/features/search-users';
import { UserForm } from '@/features/user-form';
import {
  AppButton,
  AppDialog,
  AppMessage,
  AppPagination,
  AppSpinner,
  useAppToast,
} from '@/shared/ui';
import { UsersTable } from '@/widgets/users-table';

const route = useRoute();
const router = useRouter();
const toast = useAppToast();
const usersStore = useUsersStore();
const winnersStore = useWinnersStore();
const { users, total, isLoading, error } = storeToRefs(usersStore);
const { winners } = storeToRefs(winnersStore);
const { fetchUsers, createUser, removeUser } = usersStore;

// Поточна сторінка та пошуковий запит зберігаються в query-параметрах URL
const page = computed(() => Math.max(1, Number(route.query.page) || 1));
const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''));
const startIndex = computed(() => (page.value - 1) * PAGE_SIZE);

watch(
  [page, searchQuery],
  () => {
    void fetchUsers(page.value, searchQuery.value);
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
    const created = await createUser(dto);
    isCreateOpen.value = false;
    toast.success('Користувача створено', `${created.firstName} ${created.lastName}`);
  } catch (e) {
    createError.value = (e as Error).message;
    toast.error('Не вдалося створити користувача', createError.value);
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
    await removeUser(id);
    winnersStore.removeWinner(id); // видалений користувач зникає і з блоку переможців
    userToDelete.value = null;
    toast.success('Користувача видалено');
  } catch (e) {
    deleteError.value = (e as Error).message;
    toast.error('Не вдалося видалити користувача', deleteError.value);
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
        <AppButton label="Add user" @click="openCreate" />
      </div>

      <AppMessage v-if="error">{{ error }}</AppMessage>
      <AppSpinner v-if="isLoading" />
      <UsersTable v-else :users="users" :start-index="startIndex" @delete-user="askDelete" />

      <AppPagination
        :page="page"
        :total="total"
        :page-size="PAGE_SIZE"
        @update:page="(value) => changeQuery({ page: value })"
      />
    </section>

    <AppDialog v-model:visible="isCreateOpen" title="Додати користувача" width="40rem">
      <UserForm
        submit-label="Create"
        :is-submitting="isCreating"
        :submit-error="createError"
        @submit="handleCreate"
        @cancel="isCreateOpen = false"
      />
    </AppDialog>

    <DeleteUserDialog
      :user="userToDelete"
      :is-deleting="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
      @cancel="userToDelete = null"
    />
  </div>
</template>
