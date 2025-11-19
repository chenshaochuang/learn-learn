/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly VITE_APP_VERSION?: string
  readonly VITE_BUILD_TIME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

