<script setup lang="ts">
import { useId } from 'vue';
import Select from 'primevue/select';

export interface AppSelectOption {
  value: string;
  label: string;
}

withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    options: AppSelectOption[];
    placeholder?: string;
    error?: string;
  }>(),
  { modelValue: undefined, label: undefined, placeholder: 'Оберіть значення', error: undefined },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

const inputId = useId();
</script>

<template>
  <div class="app-field">
    <label v-if="label" :for="inputId" class="app-field__label">{{ label }}</label>
    <Select
      :input-id="inputId"
      :model-value="modelValue"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      fluid
      @update:model-value="(value: string) => emit('update:modelValue', value)"
      @blur="emit('blur')"
    />
    <small v-if="error" class="app-field__error">{{ error }}</small>
  </div>
</template>
