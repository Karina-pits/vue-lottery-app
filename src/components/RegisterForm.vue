<script setup lang="ts">
import { reactive, watch } from 'vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import {
  validateParticipantForm,
  isFormValid,
  type ParticipantFormErrors,
} from '../utils/validators';
import type { ParticipantFormData } from '../types/participant';

const props = defineProps<{
  /** Повідомлення від батьківського компонента, якщо email уже зайнятий (унікальність перевіряється вище по дереву). */
  duplicateEmailError?: string | null;
  /** Батько інкрементує це значення після успішного збереження — сигнал очистити форму без валідації. */
  resetTrigger: number;
}>();

const emit = defineEmits<{
  register: [data: ParticipantFormData];
}>();

const emptyValues = (): ParticipantFormData => ({
  name: '',
  dateOfBirth: '',
  email: '',
  phone: '',
});

const values = reactive<ParticipantFormData>(emptyValues());
const errors = reactive<ParticipantFormErrors>({});
const touched = reactive<Record<keyof ParticipantFormData, boolean>>({
  name: false,
  dateOfBirth: false,
  email: false,
  phone: false,
});

function runValidation(): boolean {
  const result = validateParticipantForm(values);
  (Object.keys(errors) as (keyof ParticipantFormErrors)[]).forEach((key) => delete errors[key]);
  Object.assign(errors, result);
  return isFormValid(result);
}

function markTouched(field: keyof ParticipantFormData): void {
  touched[field] = true;
}

function resetForm(): void {
  Object.assign(values, emptyValues());
  (Object.keys(errors) as (keyof ParticipantFormErrors)[]).forEach((key) => delete errors[key]);
  (Object.keys(touched) as (keyof ParticipantFormData)[]).forEach((key) => {
    touched[key] = false;
  });
}

function handleSubmit(): void {
  (Object.keys(touched) as (keyof ParticipantFormData)[]).forEach((key) => {
    touched[key] = true;
  });
  if (!runValidation()) {
    return;
  }
  emit('register', { ...values });
}

// Батько просить очистити форму (учасника успішно збережено) — без валідації.
watch(
  () => props.resetTrigger,
  () => resetForm(),
);

// Батько повідомив про дублікат email — показуємо помилку саме під полем email.
watch(
  () => props.duplicateEmailError,
  (message) => {
    if (message) {
      errors.email = message;
      touched.email = true;
    }
  },
);
</script>

<template>
  <div class="card-block" @keyup.enter="handleSubmit">
    <p class="form-block__title">REGISTER FORM</p>
    <p class="form-block__subtitle">Please fill in all the fields.</p>

    <BaseInput
      v-model="values.name"
      label="Name"
      placeholder="Enter user name"
      :error="touched.name ? errors.name : undefined"
      :valid="touched.name && !errors.name && values.name.length > 0"
      @blur="markTouched('name')"
    />

    <BaseInput
      v-model="values.dateOfBirth"
      label="Date of Birth"
      type="date"
      :error="touched.dateOfBirth ? errors.dateOfBirth : undefined"
      :valid="touched.dateOfBirth && !errors.dateOfBirth && values.dateOfBirth.length > 0"
      @blur="markTouched('dateOfBirth')"
    />

    <BaseInput
      v-model="values.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="touched.email ? errors.email : undefined"
      :valid="touched.email && !errors.email && values.email.length > 0"
      @blur="markTouched('email')"
    />

    <BaseInput
      v-model="values.phone"
      label="Phone number"
      type="tel"
      placeholder="Enter Phone number"
      :error="touched.phone ? errors.phone : undefined"
      :valid="touched.phone && !errors.phone && values.phone.length > 0"
      @blur="markTouched('phone')"
    />

    <div class="form-block__actions">
      <BaseButton type="button" @click="handleSubmit">Save</BaseButton>
    </div>
  </div>
</template>
