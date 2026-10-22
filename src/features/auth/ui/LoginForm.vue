<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useSessionStore } from '@/entities/session';
import { AppButton, AppInput, AppMessage, useAppToast } from '@/shared/ui';

const emit = defineEmits<{ success: [] }>();

const session = useSessionStore();
const toast = useAppToast();

const schema = toTypedSchema(
  yup.object({
    username: yup.string().trim().required('Вкажіть username'),
    password: yup
      .string()
      .required('Вкажіть пароль')
      .min(6, 'Пароль має містити мінімум 6 символів'),
  }),
);

const { errors, defineField, handleSubmit, validateField } = useForm({ validationSchema: schema });
const [username] = defineField('username');
const [password] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  try {
    await session.login(values);
    emit('success');
  } catch {
    // повідомлення залишається у формі (session.error) і дублюється сповіщенням
    toast.error('Помилка авторизації', session.error ?? undefined);
  }
});
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <h1 class="form-block__title">LOGIN</h1>
    <p class="form-block__subtitle">Тестовий акаунт: emilys / emilyspass</p>

    <AppInput
      v-model="username"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
      @blur="validateField('username')"
    />
    <AppInput
      v-model="password"
      label="Password"
      type="password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
      @blur="validateField('password')"
    />

    <AppMessage v-if="session.error">{{ session.error }}</AppMessage>

    <div class="form-block__actions">
      <AppButton
        type="submit"
        :loading="session.isLoading"
        :label="session.isLoading ? 'Logging in…' : 'Login'"
      />
    </div>
  </form>
</template>
