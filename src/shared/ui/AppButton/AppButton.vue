<script setup lang="ts">
import Button from 'primevue/button';

withDefaults(
  defineProps<{
    label: string;
    type?: 'button' | 'submit';
    severity?: 'secondary' | 'danger' | 'success' | 'contrast';
    size?: 'small' | 'large';
    loading?: boolean;
    disabled?: boolean;
    text?: boolean;
  }>(),
  {
    type: 'button',
    severity: undefined,
    size: undefined,
    loading: false,
    disabled: false,
    text: false,
  },
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <Button
    :label="label"
    :type="type"
    :severity="severity"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :text="text"
    @click="$emit('click', $event)"
  />
</template>
