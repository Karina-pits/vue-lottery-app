<script setup lang="ts">
import type { Participant } from '../types/participant';

defineProps<{
  winner: Participant;
}>();

const emit = defineEmits<{
  remove: [id: string];
}>();
</script>

<template>
  <span class="winner-badge">
    {{ winner.name }}
    <button
      type="button"
      class="winner-badge__remove"
      :aria-label="`Прибрати ${winner.name} зі списку переможців`"
      @click="emit('remove', winner.id)"
    >
      ✕
    </button>
  </span>
</template>
