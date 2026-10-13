import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ServiceProvider } from '@/services/service-provider';
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user';
import { useWinnersStore } from './winners';

export const PAGE_SIZE = 10;
// У DummyJSON 208 користувачів — нові локальні id починаємо після них.
const SERVER_USERS_COUNT = 208;

/**
 * DummyJSON лише імітує POST/PUT/DELETE: сервер повертає коректну відповідь,
 * але дані не змінюються. Тому після успішної відповіді ми самі оновлюємо
 * локальний стан і запам'ятовуємо зміни, щоб вони не губились при переході
 * між сторінками.
 */
export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const currentUser = ref<User | null>(null);
  const isUserLoading = ref(false);
  const userError = ref<string | null>(null);

  // Локальні зміни поверх даних сервера
  const createdUsers = ref<User[]>([]);
  const editedUsers = ref<Record<number, User>>({});
  const removedIds = ref<number[]>([]);

  function applyLocalChanges(items: User[]): User[] {
    return items
      .filter((u) => !removedIds.value.includes(u.id))
      .map((u) => editedUsers.value[u.id] ?? u);
  }

  async function fetchUsers(page: number, query: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const params = { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE };
      const result = query
        ? await ServiceProvider.users.search(query, params)
        : await ServiceProvider.users.getAll(params);

      let items = applyLocalChanges(result.items);
      let totalCount = result.total;

      // Створені локально користувачі показуються на першій сторінці загального списку
      if (!query) {
        if (page === 1) {
          items = [...createdUsers.value, ...items];
        }
        totalCount += createdUsers.value.length;
      }
      users.value = items;
      total.value = totalCount;
    } catch (e) {
      error.value = (e as Error).message;
      users.value = [];
      total.value = 0;
    } finally {
      isLoading.value = false;
    }
  }

  function findLocalUser(id: number): User | undefined {
    return (
      editedUsers.value[id] ??
      createdUsers.value.find((u) => u.id === id) ??
      users.value.find((u) => u.id === id)
    );
  }

  async function loadUser(id: number): Promise<void> {
    userError.value = null;
    const local = findLocalUser(id);
    if (local) {
      currentUser.value = local;
      return;
    }
    isUserLoading.value = true;
    currentUser.value = null;
    try {
      currentUser.value = await ServiceProvider.users.getById(id);
    } catch (e) {
      userError.value = (e as Error).message;
    } finally {
      isUserLoading.value = false;
    }
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const created = await ServiceProvider.users.create(data);
    // Сервер завжди повертає той самий id — видаємо унікальний локальний id.
    const maxId = Math.max(SERVER_USERS_COUNT, ...createdUsers.value.map((u) => u.id));
    const user: User = { ...created, id: maxId + 1 };
    createdUsers.value.unshift(user);
    users.value.unshift(user);
    total.value += 1;
    return user;
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const base = findLocalUser(id) ?? currentUser.value;
    const updated = await ServiceProvider.users.update(id, data);
    const merged: User = { ...(base ?? updated), ...updated, id };

    if (createdUsers.value.some((u) => u.id === id)) {
      createdUsers.value = createdUsers.value.map((u) => (u.id === id ? merged : u));
    }
    editedUsers.value[id] = merged;
    users.value = users.value.map((u) => (u.id === id ? merged : u));
    if (currentUser.value?.id === id) {
      currentUser.value = merged;
    }
    return merged;
  }

  async function deleteUser(id: number): Promise<void> {
    await ServiceProvider.users.delete(id);
    createdUsers.value = createdUsers.value.filter((u) => u.id !== id);
    if (!removedIds.value.includes(id)) {
      removedIds.value.push(id);
    }
    delete editedUsers.value[id];
    useWinnersStore().removeWinner(id); // видалений користувач зникає і з блоку переможців
    users.value = users.value.filter((u) => u.id !== id);
    total.value = Math.max(0, total.value - 1);
    if (currentUser.value?.id === id) {
      currentUser.value = null;
    }
  }

  return {
    users,
    total,
    isLoading,
    error,
    currentUser,
    isUserLoading,
    userError,
    fetchUsers,
    loadUser,
    createUser,
    updateUser,
    deleteUser,
  };
});
