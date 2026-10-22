<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import BaseAlert from '@/shared/ui/BaseAlert.vue';
import BaseButton from '@/shared/ui/BaseButton.vue';
import BaseInput from '@/shared/ui/BaseInput.vue';
import { useSessionStore } from '@/entities/session';

const auth = useSessionStore();
const route = useRoute();
const router = useRouter();

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

/** Повертає внутрішній шлях для редіректу (захист від переходу на зовнішні адреси). */
function getRedirectPath(): string {
  const redirect = route.query.redirect;
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/users';
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.login(values);
    await router.push(getRedirectPath());
  } catch {
    // повідомлення про помилку вже збережено в auth.error і показується у формі
  }
});
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <h1 class="form-block__title">LOGIN</h1>
    <p class="form-block__subtitle">Тестовий акаунт: emilys / emilyspass</p>

    <BaseInput
      v-model="username"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
      @blur="validateField('username')"
    />
    <BaseInput
      v-model="password"
      label="Password"
      type="password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
      @blur="validateField('password')"
    />

    <BaseAlert v-if="auth.error">{{ auth.error }}</BaseAlert>

    <div class="form-block__actions">
      <BaseButton type="submit" :disabled="auth.isLoading">
        {{ auth.isLoading ? 'Logging in…' : 'Login' }}
      </BaseButton>
    </div>
  </form>
</template>
