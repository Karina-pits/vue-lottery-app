import { http } from '@/shared/api';
import type { AuthUser, LoginRequest, LoginResponse, RefreshResponse } from '../model/types';

const TOKEN_LIFETIME_MINUTES = 30;

export class AuthService {
  login({
    username,
    password,
    expiresInMins = TOKEN_LIFETIME_MINUTES,
  }: LoginRequest): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { username, password, expiresInMins },
    });
  }

  /** Поточний користувач (захищений ендпоїнт — потрібен Bearer-токен). */
  me(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true });
  }

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES },
    });
  }
}
