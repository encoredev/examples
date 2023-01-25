/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERCEL_GIT_PULL_REQUEST_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
