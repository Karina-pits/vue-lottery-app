import type { User } from '@/entities/user/model/types';

export interface LoginRequest {
  username: string;
  password: string;
  /** Час життя accessToken у хвилинах (за замовчуванням на сервері — 60) */
  expiresInMins?: number;
}

/** Дані користувача, які ми зберігаємо після логіну. */
export type AuthUser = Pick<
  User,
  'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'gender' | 'image'
>;

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
