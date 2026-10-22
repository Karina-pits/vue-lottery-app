import { http } from '@/shared/api/http-client';
import type { LoginRequest, LoginResponse, RefreshResponse } from '@/entities/session/model/types';
import type { User } from '@/entities/user/model/types';

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
  me(): Promise<User> {
    return http<User>('/auth/me', { auth: true });
  }

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES },
    });
  }
}
