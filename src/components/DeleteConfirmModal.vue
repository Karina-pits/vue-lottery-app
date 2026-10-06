<script setup lang="ts">
import Modal from './Modal.vue';
import BaseButton from './BaseButton.vue';
import type { Participant } from '../types/participant';

defineProps<{
  participant: Participant;
}>();

const emit = defineEmits<{
  confirm: [id: string];
  close: [];
}>();
</script>

<template>
  <Modal title="Видалити учасника" @close="emit('close')">
    <p>
      Ви дійсно бажаєте видалити учасника «{{ participant.name }}», «{{ participant.email }}»?
    </p>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Ні</BaseButton>
      <BaseButton variant="danger" @click="emit('confirm', participant.id)">Так</BaseButton>
    </template>
  </Modal>
</template>
