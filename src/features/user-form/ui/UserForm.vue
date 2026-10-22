<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type { CreateUserDto } from '@/entities/user';
import { AppButton, AppInput, AppMessage, AppSelect } from '@/shared/ui';

/** Значення полів форми (усі як рядки, як у <input>). */
export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  age: string;
  gender: string;
  phone: string;
}

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<UserFormValues>;
    submitLabel?: string;
    isSubmitting?: boolean;
    submitError?: string | null;
  }>(),
  {
    initialValues: () => ({}),
    submitLabel: 'Save',
    isSubmitting: false,
    submitError: null,
  },
);

const emit = defineEmits<{
  submit: [dto: CreateUserDto];
  cancel: [];
}>();

const schema = toTypedSchema(
  yup.object({
    firstName: yup.string().trim().required("Вкажіть ім'я"),
    lastName: yup.string().trim().required('Вкажіть прізвище'),
    email: yup.string().trim().required('Вкажіть email').email('Некоректний формат email'),
    username: yup
      .string()
      .trim()
      .required('Вкажіть username')
      .min(3, 'Username має містити мінімум 3 символи'),
    password: yup
      .string()
      .required('Вкажіть пароль')
      .min(6, 'Пароль має містити мінімум 6 символів'),
    age: yup
      .string()
      .required('Вкажіть вік')
      .matches(/^\d+$/, 'Вік має бути цілим числом')
      .test('age-range', 'Вік має бути від 1 до 120', (value) => {
        const age = Number(value);
        return age >= 1 && age <= 120;
      }),
    gender: yup.string().required('Оберіть стать').oneOf(['male', 'female'], 'Оберіть стать'),
    phone: yup
      .string()
      .trim()
      .required('Вкажіть телефон')
      .matches(/^\+?[\d\s\-()]{7,20}$/, 'Некоректний номер телефону'),
  }),
);

const { errors, defineField, handleSubmit, validateField } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues,
});

const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [email] = defineField('email');
const [username] = defineField('username');
const [password] = defineField('password');
const [age] = defineField('age');
const [gender] = defineField('gender');
const [phone] = defineField('phone');

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const onSubmit = handleSubmit((values) => {
  emit('submit', { ...values, age: Number(values.age) });
});
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="form-grid form-grid--2">
      <AppInput
        v-model="firstName"
        label="First name"
        placeholder="Enter first name"
        :error="errors.firstName"
        @blur="validateField('firstName')"
      />
      <AppInput
        v-model="lastName"
        label="Last name"
        placeholder="Enter last name"
        :error="errors.lastName"
        @blur="validateField('lastName')"
      />
    </div>

    <AppInput
      v-model="email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="errors.email"
      @blur="validateField('email')"
    />

    <div class="form-grid form-grid--2">
      <AppInput
        v-model="username"
        label="Username"
        placeholder="Enter username"
        :error="errors.username"
        @blur="validateField('username')"
      />
      <AppInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Enter password"
        autocomplete="new-password"
        :error="errors.password"
        @blur="validateField('password')"
      />
    </div>

    <div class="form-grid form-grid--3">
      <AppInput
        v-model="age"
        label="Age"
        type="number"
        placeholder="Enter age"
        :error="errors.age"
        @blur="validateField('age')"
      />
      <AppSelect
        v-model="gender"
        label="Gender"
        :options="genderOptions"
        :error="errors.gender"
        @blur="validateField('gender')"
      />
      <AppInput
        v-model="phone"
        label="Phone number"
        type="tel"
        placeholder="+1 234 567 8900"
        :error="errors.phone"
        @blur="validateField('phone')"
      />
    </div>

    <AppMessage v-if="submitError">{{ submitError }}</AppMessage>

    <div class="form-block__actions">
      <AppButton label="Cancel" severity="secondary" @click="emit('cancel')" />
      <AppButton type="submit" :loading="isSubmitting" :label="isSubmitting ? 'Saving…' : submitLabel" />
    </div>
  </form>
</template>
