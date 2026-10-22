<script setup lang="ts">
import type { User } from '@/entities/user';

defineProps<{
  winner: User;
}>();

const emit = defineEmits<{
  remove: [id: number];
}>();
</script>

<template>
  <span class="winner-badge">
    {{ winner.firstName }} {{ winner.lastName }}
    <button
      type="button"
      class="winner-badge__remove"
      :aria-label="`Прибрати ${winner.firstName} ${winner.lastName} зі списку переможців`"
      @click="emit('remove', winner.id)"
    >
      <i class="pi pi-times" aria-hidden="true"></i>
    </button>
  </span>
</template>
