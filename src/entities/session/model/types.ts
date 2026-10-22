export interface LoginRequest {
  username: string;
  password: string;
  /** Час життя accessToken у хвилинах (за замовчуванням на сервері — 60) */
  expiresInMins?: number;
}

/** Дані поточного користувача, які ми зберігаємо в сесії. */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
