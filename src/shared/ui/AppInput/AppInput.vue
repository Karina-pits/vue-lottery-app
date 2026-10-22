<script setup lang="ts">
import { useId } from 'vue';
import InputText from 'primevue/inputtext';

withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    ariaLabel?: string;
    type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'number' | 'search';
    placeholder?: string;
    autocomplete?: string;
    /** Текст помилки валідації (показується під полем) */
    error?: string;
  }>(),
  {
    modelValue: '',
    label: undefined,
    ariaLabel: undefined,
    type: 'text',
    placeholder: '',
    autocomplete: 'off',
    error: undefined,
  },
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
    <InputText
      :id="inputId"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel"
      :invalid="Boolean(error)"
      fluid
      @update:model-value="(value) => emit('update:modelValue', value ?? '')"
      @blur="emit('blur')"
    />
    <small v-if="error" class="app-field__error">{{ error }}</small>
  </div>
</template>
