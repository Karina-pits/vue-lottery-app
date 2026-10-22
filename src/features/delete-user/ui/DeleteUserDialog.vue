<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '@/entities/user';
import { AppConfirmDialog } from '@/shared/ui';

const props = defineProps<{
  /** Користувач, якого збираються видалити (null — діалог закритий) */
  user: User | null;
  isDeleting?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  confirm: [id: number];
  cancel: [];
}>();

const message = computed(() =>
  props.user
    ? `Ви дійсно бажаєте видалити користувача «${props.user.firstName} ${props.user.lastName}», «${props.user.email}»?`
    : '',
);
</script>

<template>
  <AppConfirmDialog
    :visible="user !== null"
    title="Видалити користувача"
    :message="message"
    :loading="isDeleting"
    :error="error"
    @confirm="user && emit('confirm', user.id)"
    @cancel="emit('cancel')"
  />
</template>
