<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserForm, { type UserFormValues } from '@/components/UserForm.vue';
import { useUsersStore } from '@/stores/users';
import type { CreateUserDto, User } from '@/types/user';

// id — з параметра маршруту (props: true), user передає батьківський UserDetailsView
const props = defineProps<{ id: string; user: User }>();

const router = useRouter();
const usersStore = useUsersStore();

const isSaving = ref(false);
const saveError = ref<string | null>(null);

const initialValues: UserFormValues = {
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
  username: props.user.username,
  password: props.user.password,
  age: String(props.user.age),
  gender: props.user.gender,
  phone: props.user.phone,
};

function goToDetails(): void {
  void router.push({ name: 'user-details', params: { id: props.id } });
}

async function handleSubmit(dto: CreateUserDto): Promise<void> {
  isSaving.value = true;
  saveError.value = null;
  try {
    await usersStore.updateUser(props.user.id, dto);
    goToDetails();
  } catch (e) {
    saveError.value = (e as Error).message;
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <section class="card-block">
    <h2 class="section-title">Edit user</h2>
    <UserForm
      submit-label="Update"
      :initial-values="initialValues"
      :is-submitting="isSaving"
      :submit-error="saveError"
      @submit="handleSubmit"
      @cancel="goToDetails"
    />
  </section>
</template>
