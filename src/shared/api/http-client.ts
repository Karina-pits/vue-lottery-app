/**
 * Єдине місце, де відомо про fetch, базову адресу API та обробку помилок.
 * Репозиторії (сервіси) не містять хардкоду URL.
 */
const BASE_URL = import.meta.env.VITE_API_URL;

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Обробники авторизації, які реєструє застосунок (щоб клієнт не залежав від стору). */
export interface AuthHandlers {
  getAccessToken: () => string | null;
  /** Оновлює accessToken і повертає новий токен (або null, якщо оновити не вдалося). */
  refreshAccessToken: () => Promise<string | null>;
  /** Викликається, коли сесію неможливо відновити (розлогінити користувача). */
  onAuthFailure: () => void;
}

let authHandlers: AuthHandlers | null = null;

export function configureAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = handlers;
}

export interface HttpOptions extends Omit<RequestInit, 'body'> {
  /** Додати заголовок Authorization: Bearer <accessToken> (захищені ендпоїнти). */
  auth?: boolean;
  /** Query-параметри; undefined-значення пропускаються. */
  query?: Record<string, string | number | undefined>;
  /** Тіло запиту (об'єкт буде перетворено в JSON). */
  body?: unknown;
}

function buildUrl(path: string, query?: HttpOptions['query']): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    if (data.message) {
      return data.message;
    }
  } catch {
    // тіло відповіді не є JSON — використовуємо statusText
  }
  return `HTTP ${response.status}: ${response.statusText}`;
}

async function send(path: string, options: HttpOptions): Promise<Response> {
  const { auth, query, body, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = authHandlers?.getAccessToken();
    if (token) {
      finalHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(buildUrl(path, query), {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const tokenUsed = options.auth ? (authHandlers?.getAccessToken() ?? null) : null;
  let response = await send(path, options);

  // Interceptor: accessToken протух (401) — оновлюємо його і повторюємо запит один раз.
  if (response.status === 401 && options.auth && authHandlers) {
    const currentToken = authHandlers.getAccessToken();
    // Якщо токен уже оновив інший запит — просто повторюємо запит з новим токеном.
    const token =
      currentToken && currentToken !== tokenUsed
        ? currentToken
        : await authHandlers.refreshAccessToken();

    if (token) {
      response = await send(path, options);
    } else {
      authHandlers.onAuthFailure();
    }
  }

  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response));
  }

  return (await response.json()) as T;
}
