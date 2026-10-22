import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { HttpError, ServiceProvider } from '@/shared/api';
import type { AuthService } from '../api/auth.service';
import type { AuthUser, LoginRequest } from './types';

const STORAGE_KEY = 'vue-lottery-session';

interface SessionPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function loadSession(): SessionPayload | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Сесія користувача: токени та дані поточного користувача.
 * Збереження в localStorage реалізоване вручну (setSession / clearSession),
 * на відміну від settings-стору, який використовує pinia-plugin-persistedstate.
 */
export const useSessionStore = defineStore('session', () => {
  const authService = () => ServiceProvider.get<AuthService>('auth');
  const stored = loadSession();

  const user = ref<AuthUser | null>(stored?.user ?? null);
  const accessToken = ref<string | null>(stored?.accessToken ?? null);
  const refreshToken = ref<string | null>(stored?.refreshToken ?? null);

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isSessionChecked = ref(false);

  const isAuthenticated = computed(() => accessToken.value !== null && user.value !== null);
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  );

  function persist(): void {
    if (user.value && accessToken.value && refreshToken.value) {
      const payload: SessionPayload = {
        user: user.value,
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }

  function setSession(payload: SessionPayload): void {
    user.value = payload.user;
    accessToken.value = payload.accessToken;
    refreshToken.value = payload.refreshToken;
    persist();
  }

  function clearSession(): void {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await authService().login(credentials);
      setSession({ user: profile, accessToken: access, refreshToken: refresh });
    } catch (e) {
      error.value = (e as Error).message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    clearSession();
    error.value = null;
  }

  // Якщо одночасно кілька запитів отримали 401 — оновлюємо токен лише один раз.
  let refreshPromise: Promise<string | null> | null = null;

  function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) {
      return Promise.resolve(null);
    }
    refreshPromise ??= authService()
      .refresh(refreshToken.value)
      .then((tokens) => {
        accessToken.value = tokens.accessToken;
        refreshToken.value = tokens.refreshToken;
        persist();
        return tokens.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
    return refreshPromise;
  }

  /** Перевіряє збережену сесію (GET /auth/me) один раз при старті застосунку. */
  async function initSession(): Promise<void> {
    if (isSessionChecked.value) {
      return;
    }
    isSessionChecked.value = true;
    if (!accessToken.value) {
      return;
    }
    try {
      await authService().me();
    } catch (e) {
      // 401 після невдалого refresh — сесія недійсна; мережеві збої сесію не скидають.
      if (e instanceof HttpError && e.status === 401) {
        logout();
      }
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    fullName,
    setSession,
    clearSession,
    login,
    logout,
    refreshAccessToken,
    initSession,
  };
});
