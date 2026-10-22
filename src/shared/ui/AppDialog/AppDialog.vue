<script setup lang="ts">
import Dialog from 'primevue/dialog';

withDefaults(
  defineProps<{
    visible: boolean;
    title: string;
    width?: string;
  }>(),
  { width: '32rem' },
);

const emit = defineEmits<{ 'update:visible': [value: boolean] }>();
</script>

<template>
  <Dialog
    :visible="visible"
    :header="title"
    :style="{ width }"
    modal
    @update:visible="(value) => emit('update:visible', value)"
  >
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>
