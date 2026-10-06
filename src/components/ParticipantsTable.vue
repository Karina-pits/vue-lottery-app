<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Participant, SortDirection, SortField } from '../types/participant';
import SearchBar from './SearchBar.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  participants: Participant[];
}>();

const emit = defineEmits<{
  'edit-participant': [id: string];
  'delete-participant': [id: string];
}>();

const searchQuery = ref('');
const sortField = ref<SortField | null>(null);
const sortDirection = ref<SortDirection>('asc');

function handleFilterByName(query: string): void {
  searchQuery.value = query;
}

function toggleSort(field: SortField): void {
  if (sortField.value !== field) {
    sortField.value = field;
    sortDirection.value = 'asc';
    return;
  }
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
}

// Спочатку фільтруємо, потім сортуємо; вихідний масив participants не змінюється —
// обчислювана властивість завжди будує новий (відсортований/відфільтрований) масив.
const visibleParticipants = computed<Participant[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const filtered = query
    ? props.participants.filter((p) => p.name.toLowerCase().includes(query))
    : props.participants.slice();

  if (!sortField.value) {
    return filtered;
  }

  const field = sortField.value;
  const direction = sortDirection.value === 'asc' ? 1 : -1;

  return filtered.sort((a, b) => {
    if (field === 'name') {
      return a.name.localeCompare(b.name) * direction;
    }
    // dateOfBirth у форматі yyyy-mm-dd — рядкове порівняння еквівалентне хронологічному
    return a.dateOfBirth.localeCompare(b.dateOfBirth) * direction;
  });
});

function sortIconClass(field: SortField): string {
  if (sortField.value !== field) {
    return field === 'name' ? 'bi-sort-alpha-down' : 'bi-sort-down';
  }
  if (sortDirection.value === 'asc') {
    return field === 'name' ? 'bi-sort-alpha-down' : 'bi-sort-down';
  }
  return field === 'name' ? 'bi-sort-alpha-up' : 'bi-sort-up';
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}
</script>

<template>
  <div class="card-block">
    <div class="table-block__toolbar">
      <SearchBar @filter-by-name="handleFilterByName" />
    </div>

    <table class="participants-table">
      <thead>
        <tr>
          <th class="col-index">#</th>
          <th>
            Name
            <button
              type="button"
              class="sort-toggle"
              :class="{ 'is-active': sortField === 'name' }"
              aria-label="Сортувати за іменем"
              @click="toggleSort('name')"
            >
              <i class="bi" :class="sortIconClass('name')"></i>
            </button>
          </th>
          <th>
            Date of Birth
            <button
              type="button"
              class="sort-toggle"
              :class="{ 'is-active': sortField === 'dateOfBirth' }"
              aria-label="Сортувати за датою народження"
              @click="toggleSort('dateOfBirth')"
            >
              <i class="bi" :class="sortIconClass('dateOfBirth')"></i>
            </button>
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(participant, index) in visibleParticipants" :key="participant.id">
          <td class="col-index">{{ index + 1 }}</td>
          <td>{{ participant.name }}</td>
          <td>{{ formatDate(participant.dateOfBirth) }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>
            <div class="table-actions">
              <BaseButton variant="secondary" @click="emit('edit-participant', participant.id)">
                Редагувати дані
              </BaseButton>
              <BaseButton variant="danger" @click="emit('delete-participant', participant.id)">
                Видалити учасника
              </BaseButton>
            </div>
          </td>
        </tr>
        <tr v-if="visibleParticipants.length === 0">
          <td colspan="6" class="text-center text-muted py-3">Учасників не знайдено.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
