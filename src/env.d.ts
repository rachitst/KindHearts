/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_REQUESTS_URL: string;
  readonly VITE_API_INSTITUTES_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
