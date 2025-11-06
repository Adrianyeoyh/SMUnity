import { Hono } from "hono";
import { AuthVariables } from "./middlewares/auth";

export function createApp() {
    return new Hono<{ Variables: AuthVariables }>();
}