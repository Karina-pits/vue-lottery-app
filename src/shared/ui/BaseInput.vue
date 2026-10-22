<script setup lang="ts">
/**
 * Багаторазовий компонент поля вводу з підписом, повідомленням про
 * помилку та індикацією валідного стану. Підтримує v-model.
 */
withDefaults(
  defineProps<{
    modelValue?: string;
    label: string;
    type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'number';
    placeholder?: string;
    autocomplete?: string;
    error?: string;
    valid?: boolean;
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    autocomplete: 'off',
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
</script>

<template>
  <div class="form-field">
    <label class="form-field__label">{{ label }}</label>
    <input
      class="form-control"
      :class="{ 'is-invalid': error, 'is-valid': valid && !error }"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="modelValue"
      @input="onInput"
      @blur="emit('blur')"
    />
    <p v-if="error" class="form-field__error">{{ error }}</p>
  </div>
</template>
