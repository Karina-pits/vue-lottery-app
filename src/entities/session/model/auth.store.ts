import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { HttpError } from '@/shared/api/http-client';
import { ServiceProvider } from '@/shared/api/service-provider';
import type { AuthUser, LoginRequest } from './types';

const STORAGE_KEY = 'vue-lottery-auth';

interface StoredAuth {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function loadStoredAuth(): StoredAuth | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadStoredAuth();

  const user = ref<AuthUser | null>(stored?.user ?? null);
  const accessToken = ref<string | null>(stored?.accessToken ?? null);
  const refreshToken = ref<string | null>(stored?.refreshToken ?? null);

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isSessionChecked = ref(false);

  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value));
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  );

  // Токени та дані користувача зберігаються в localStorage при кожній зміні.
  watch(
    [user, accessToken, refreshToken],
    () => {
      if (user.value && accessToken.value && refreshToken.value) {
        const payload: StoredAuth = {
          user: user.value,
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
    { deep: true },
  );

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await ServiceProvider.auth.login(credentials);
      user.value = profile;
      accessToken.value = access;
      refreshToken.value = refresh;
    } catch (e) {
      error.value = (e as Error).message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    error.value = null;
  }

  // Якщо одночасно кілька запитів отримали 401 — оновлюємо токен лише один раз.
  let refreshPromise: Promise<string | null> | null = null;

  function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) {
      return Promise.resolve(null);
    }
    refreshPromise ??= ServiceProvider.auth
      .refresh(refreshToken.value)
      .then((tokens) => {
        accessToken.value = tokens.accessToken;
        refreshToken.value = tokens.refreshToken;
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
      await ServiceProvider.auth.me();
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
    login,
    logout,
    refreshAccessToken,
    initSession,
  };
});
