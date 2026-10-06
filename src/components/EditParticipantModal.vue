<script setup lang="ts">
import { reactive, watch } from 'vue';
import Modal from './Modal.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import {
  validateParticipantForm,
  isFormValid,
  type ParticipantFormErrors,
} from '../utils/validators';
import type { Participant, ParticipantFormData } from '../types/participant';

const props = defineProps<{
  participant: Participant;
  duplicateEmailError?: string | null;
}>();

const emit = defineEmits<{
  update: [id: string, data: ParticipantFormData];
  close: [];
}>();

const values = reactive<ParticipantFormData>({
  name: props.participant.name,
  dateOfBirth: props.participant.dateOfBirth,
  email: props.participant.email,
  phone: props.participant.phone,
});
const errors = reactive<ParticipantFormErrors>({});

function runValidation(): boolean {
  const result = validateParticipantForm(values);
  (Object.keys(errors) as (keyof ParticipantFormErrors)[]).forEach((key) => delete errors[key]);
  Object.assign(errors, result);
  return isFormValid(result);
}

function handleUpdate(): void {
  if (!runValidation()) {
    return;
  }
  emit('update', props.participant.id, { ...values });
}

watch(
  () => props.duplicateEmailError,
  (message) => {
    if (message) {
      errors.email = message;
    }
  },
);
</script>

<template>
  <Modal title="Редагувати дані учасника" @close="emit('close')">
    <BaseInput
      v-model="values.name"
      label="Name"
      placeholder="Enter user name"
      :error="errors.name"
      :valid="!errors.name && values.name.length > 0"
    />
    <BaseInput
      v-model="values.dateOfBirth"
      label="Date of Birth"
      type="date"
      :error="errors.dateOfBirth"
      :valid="!errors.dateOfBirth && values.dateOfBirth.length > 0"
    />
    <BaseInput
      v-model="values.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="errors.email"
      :valid="!errors.email && values.email.length > 0"
    />
    <BaseInput
      v-model="values.phone"
      label="Phone number"
      type="tel"
      placeholder="Enter Phone number"
      :error="errors.phone"
      :valid="!errors.phone && values.phone.length > 0"
    />

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Скасувати</BaseButton>
      <BaseButton @click="handleUpdate">Оновити дані</BaseButton>
    </template>
  </Modal>
</template>
