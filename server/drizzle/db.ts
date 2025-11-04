import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "#server/drizzle/schema";
import { env } from "#server/env";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema,
});
