<script setup lang="ts">
/**
 * Багаторазовий компонент кнопки. Обгортає <button> і прокидає подію
 * click далі, якщо кнопка не вимкнена.
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'link';
    type?: 'button' | 'submit';
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function onClick(event: MouseEvent): void {
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant}`]"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>
