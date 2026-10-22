import type { App } from 'vue';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';

/**
 * Тема застосунку: пресет Aura з основним кольором sky (близько до
 * синього #38a7e0, який використовується в дизайні).
 */
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
});

/** Підключення UI-бібліотеки: тема, темний режим (клас .app-dark на <html>) та сервіс сповіщень. */
export function installUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: AppPreset,
      options: { darkModeSelector: '.app-dark', cssLayer: false },
    },
  });
  app.use(ToastService);
}
