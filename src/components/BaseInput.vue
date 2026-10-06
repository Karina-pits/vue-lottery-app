<script setup lang="ts">
/**
 * Багаторазовий компонент поля вводу з підписом, повідомленням про
 * помилку та індикацією валідного стану (зелена рамка + галочка) —
 * без використання alert для показу помилок.
 */
withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    type?: 'text' | 'email' | 'tel' | 'date';
    placeholder?: string;
    error?: string;
    valid?: boolean;
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: undefined,
    valid: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function onBlur(): void {
  emit('blur');
}
</script>

<template>
  <div class="form-field">
    <label class="form-field__label">{{ label }}</label>
    <div class="position-relative">
      <input
        class="form-control"
        :class="{ 'is-invalid': error, 'is-valid': valid && !error }"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        @blur="onBlur"
      />
    </div>
    <p v-if="error" class="form-field__error">{{ error }}</p>
  </div>
</template>
