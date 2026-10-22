<script setup lang="ts">
import Dialog from 'primevue/dialog';
import AppButton from '../AppButton/AppButton.vue';
import AppMessage from '../AppMessage/AppMessage.vue';

withDefaults(
  defineProps<{
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    error?: string | null;
  }>(),
  { confirmLabel: 'Так', cancelLabel: 'Ні', loading: false, error: null },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Dialog
    :visible="visible"
    :header="title"
    :style="{ width: '28rem' }"
    :closable="!loading"
    modal
    @update:visible="(value) => !value && emit('cancel')"
  >
    <p class="app-confirm__message">{{ message }}</p>
    <AppMessage v-if="error">{{ error }}</AppMessage>

    <template #footer>
      <AppButton :label="cancelLabel" severity="secondary" :disabled="loading" @click="emit('cancel')" />
      <AppButton :label="confirmLabel" severity="danger" :loading="loading" @click="emit('confirm')" />
    </template>
  </Dialog>
</template>
