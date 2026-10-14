<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import BaseAlert from '@/components/BaseAlert.vue';
import BaseSpinner from '@/components/BaseSpinner.vue';
import { useUsersStore } from '@/stores/users';

// id приходить як prop завдяки `props: true` у конфігурації маршруту
const props = defineProps<{ id: string }>();

const route = useRoute();
const usersStore = useUsersStore();
const { currentUser, isUserLoading, userError } = storeToRefs(usersStore);

const userId = computed(() => Number(props.id));

watch(
  userId,
  () => {
    void usersStore.loadUser(userId.value);
  },
  { immediate: true },
);
</script>

<template>
  <div class="page-stack">
    <BaseSpinner v-if="isUserLoading" />
    <template v-else>
      <BaseAlert v-if="userError">{{ userError }}</BaseAlert>

      <section v-if="currentUser" class="card-block">
        <h1 class="page-title">{{ currentUser.firstName }} {{ currentUser.lastName }}</h1>

        <dl class="details-list">
          <dt>Username</dt>
          <dd>{{ currentUser.username }}</dd>
          <dt>Email</dt>
          <dd>{{ currentUser.email }}</dd>
          <dt>Phone</dt>
          <dd>{{ currentUser.phone }}</dd>
          <dt>Age</dt>
          <dd>{{ currentUser.age }}</dd>
          <dt>Gender</dt>
          <dd>{{ currentUser.gender }}</dd>
          <dt>Birth date</dt>
          <dd>{{ currentUser.birthDate ?? '—' }}</dd>
          <dt>Role</dt>
          <dd>{{ currentUser.role ?? '—' }}</dd>
          <dt>Address</dt>
          <dd>
            {{
              currentUser.address
                ? `${currentUser.address.address}, ${currentUser.address.city}, ${currentUser.address.country}`
                : '—'
            }}
          </dd>
          <dt>Company</dt>
          <dd>
            {{
              currentUser.company
                ? `${currentUser.company.name} — ${currentUser.company.title}`
                : '—'
            }}
          </dd>
        </dl>

        <div class="form-block__actions">
          <RouterLink class="btn btn-secondary" :to="{ name: 'users' }">Back to users</RouterLink>
          <RouterLink
            v-if="route.name !== 'user-edit'"
            class="btn btn-primary"
            :to="{ name: 'user-edit', params: { id } }"
          >
            Edit
          </RouterLink>
        </div>
      </section>

      <!-- Вкладений маршрут /users/:id/edit відображається тут -->
      <RouterView v-if="currentUser" :user="currentUser" />
    </template>
  </div>
</template>
