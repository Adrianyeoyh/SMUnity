import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "#server/env.ts";
import { auth } from "#server/lib/auth.ts";

import { apiRouter } from '#server/api'
import { authMiddleware } from "./middlewares/auth";

const app = new Hono()
  .get("/health", (c) => {
    return c.json({
      status: "ok",
    });
  })
  .use(
    "/*",
    serveStatic({
      root: "dist/static",
      index: "index.html",
      onNotFound: (path) => {
        console.log(path);
      },
    }),
  );

// app.use(
//   "*",
//   cors({
//     origin: "http://localhost:4000",
//     allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use(authMiddleware).route("/api", apiRouter);


app
  .basePath("/api")
  .get("/runtime.js", (c) => {
    return c.text(
      `
      window.__env = ${JSON.stringify(Object.fromEntries(Object.entries(env).filter(([key]) => key.startsWith("VITE_"))), null, 2)}
      `.trim(),
      200,
      { "Content-Type": "application/javascript" },
    );
  })
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

serve({
  port: 4001,
  fetch: app.fetch,
});

console.log(`App is running on port 4001`);

export default app;