<script setup lang="ts">
import type { User } from '@/types/user';
import BaseAlert from './BaseAlert.vue';
import BaseButton from './BaseButton.vue';
import Modal from './Modal.vue';

defineProps<{
  user: User;
  isDeleting?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  confirm: [id: number];
  close: [];
}>();
</script>

<template>
  <Modal title="Видалити користувача" @close="emit('close')">
    <p>
      Ви дійсно бажаєте видалити користувача «{{ user.firstName }} {{ user.lastName }}», «{{
        user.email
      }}»?
    </p>
    <BaseAlert v-if="error">{{ error }}</BaseAlert>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Ні</BaseButton>
      <BaseButton variant="danger" :disabled="isDeleting" @click="emit('confirm', user.id)">
        {{ isDeleting ? 'Видалення…' : 'Так' }}
      </BaseButton>
    </template>
  </Modal>
</template>
