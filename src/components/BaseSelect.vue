<script setup lang="ts">
export interface SelectOption {
  value: string;
  label: string;
}

withDefaults(
  defineProps<{
    modelValue?: string;
    label: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
  }>(),
  { modelValue: '', placeholder: 'Оберіть значення', error: undefined },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <div class="form-field">
    <label class="form-field__label">{{ label }}</label>
    <select
      class="form-select"
      :class="{ 'is-invalid': error }"
      :value="modelValue"
      @change="onChange"
      @blur="emit('blur')"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="form-field__error">{{ error }}</p>
  </div>
</template>
