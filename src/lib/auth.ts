import { createAuthClient } from "better-auth/client";

import { env } from "#client/env.ts";

export const auth = createAuthClient({
  baseURL: env.VITE_APP_URL + "/api/auth",
  fetchOptions: {
    credentials: "include", // ensures cookie travels both ways
  },
});
