<script setup lang="ts">
import type { User } from '@/types/user';
import BaseButton from './BaseButton.vue';
import WinnerBadge from './WinnerBadge.vue';

defineProps<{
  winners: User[];
  canPickWinner: boolean;
}>();

const emit = defineEmits<{
  'pick-winner': [];
  'remove-winner': [id: number];
}>();
</script>

<template>
  <div class="winners-bar">
    <div class="winners-bar__input">
      <WinnerBadge
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="(id) => emit('remove-winner', id)"
      />
      <span v-if="winners.length === 0" class="winners-bar__placeholder">Winners</span>
    </div>
    <BaseButton :disabled="!canPickWinner" @click="emit('pick-winner')">New winner</BaseButton>
  </div>
</template>
