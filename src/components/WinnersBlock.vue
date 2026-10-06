<script setup lang="ts">
import type { Participant } from '../types/participant';
import WinnerBadge from './WinnerBadge.vue';
import BaseButton from './BaseButton.vue';

defineProps<{
  winners: Participant[];
  canPickWinner: boolean;
}>();

const emit = defineEmits<{
  'pick-winner': [];
  'remove-winner': [id: string];
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
