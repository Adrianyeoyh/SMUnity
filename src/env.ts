import { Env } from "../server/env";

export const env: Env = {
  VITE_APP_URL: window.__env?.VITE_APP_URL ?? import.meta.env.VITE_APP_URL,
  VITE_GOOGLE_MAPS_API_KEY:
    window.__env?.VITE_GOOGLE_MAPS_API_KEY ??
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};
