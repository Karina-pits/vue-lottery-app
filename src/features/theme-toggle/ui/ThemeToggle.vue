<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/entities/settings';
import { AppButton } from '@/shared/ui';

const settings = useSettingsStore();
const { isDark } = storeToRefs(settings);
</script>

<template>
  <AppButton
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    :aria-label="isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'"
    severity="secondary"
    text
    @click="settings.toggleTheme()"
  />
</template>
