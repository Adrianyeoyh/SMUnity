// server/api/auth/index.ts
import { Hono } from "hono";
import { authRoutes } from './routes';

const router = new Hono();

router.route("/", authRoutes);

export default router;
