import { useToast } from 'primevue/usetoast';

const TOAST_LIFETIME_MS = 3500;

/** Прості сповіщення про результат операцій (замість прямого використання PrimeVue). */
export function useAppToast() {
  const toast = useToast();

  return {
    success: (summary: string, detail?: string) =>
      toast.add({ severity: 'success', summary, detail, life: TOAST_LIFETIME_MS }),
    error: (summary: string, detail?: string) =>
      toast.add({ severity: 'error', summary, detail, life: TOAST_LIFETIME_MS }),
    info: (summary: string, detail?: string) =>
      toast.add({ severity: 'info', summary, detail, life: TOAST_LIFETIME_MS }),
  };
}
