import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark';

const DARK_CLASS = 'app-dark';

function getPreferredTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Налаштування застосунку (тема). Збереження в localStorage виконує
 * pinia-plugin-persistedstate — достатньо опції `persist` у defineStore.
 */
export const useSettingsStore = defineStore(
  'settings',
  () => {
    const theme = ref<Theme>(getPreferredTheme());
    const isDark = computed(() => theme.value === 'dark');

    function setTheme(value: Theme): void {
      theme.value = value;
    }

    function toggleTheme(): void {
      theme.value = isDark.value ? 'light' : 'dark';
    }

    // Клас на <html> вмикає темну тему PrimeVue (darkModeSelector: '.app-dark').
    watch(
      theme,
      (value) => {
        document.documentElement.classList.toggle(DARK_CLASS, value === 'dark');
      },
      { immediate: true },
    );

    return { theme, isDark, setTheme, toggleTheme };
  },
  { persist: { key: 'vue-lottery-settings', pick: ['theme'] } },
);
