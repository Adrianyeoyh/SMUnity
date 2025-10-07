import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "#server/drizzle/schema/index.ts";
import { env } from "#server/env.ts";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema,
});
