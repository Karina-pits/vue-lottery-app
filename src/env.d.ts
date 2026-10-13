/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базова адреса REST API (DummyJSON), наприклад https://dummyjson.com */
  readonly VITE_API_URL: string;
  /** Базовий шлях застосунку (для GitHub Pages, наприклад /vue-lottery-app/) */
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
