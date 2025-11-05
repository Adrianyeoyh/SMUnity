/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

interface Window {
  __env?: {
    VITE_APP_URL?: string;
    VITE_GOOGLE_MAPS_API_KEY?: string
  };
}
