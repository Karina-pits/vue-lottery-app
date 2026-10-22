<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/entities/user';
import type { CreateUserDto, User } from '@/entities/user';
import { UserForm } from '@/features/user-form';
import type { UserFormValues } from '@/features/user-form';
import { useAppToast } from '@/shared/ui';

// id — з параметра маршруту (props: true), user передає батьківська сторінка
const props = defineProps<{ id: string; user: User }>();

const router = useRouter();
const toast = useAppToast();
const { updateUser } = useUsersStore();

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
    await updateUser(props.user.id, dto);
    toast.success('Користувача оновлено');
    goToDetails();
  } catch (e) {
    saveError.value = (e as Error).message;
    toast.error('Не вдалося оновити користувача', saveError.value);
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
