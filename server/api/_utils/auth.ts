// =============================================
// server/api/_utils/auth.ts
// =============================================
import { auth } from "#server/lib/auth";

export type AccountType = "student" | "organisation" | "admin";

export type UserSession = {
  id: string;
  email: string;
  accountType: AccountType;
};

export async function requireSession(c: any): Promise<UserSession> {
  const res = await auth.handler(
    new Request(c.req.url, { method: "GET", headers: c.req.raw.headers }),
  );
  const data = await res.clone().json().catch(() => ({} as any));
  const u = (data as any).user ?? (data as any).data?.user;
  if (!u?.id || !u?.email || !u?.accountType) {
    c.status(401);
    throw new Error("Not authenticated");
  }
  return { id: u.id, email: String(u.email).toLowerCase(), accountType: u.accountType as AccountType };
}

export function assertRole(user: UserSession, allowed: AccountType[]) {
  if (!allowed.includes(user.accountType)) {
    const err: Error & { status?: number } = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

export function assertSelfOrAdmin(user: UserSession, ownerId: string) {
  if (user.id !== ownerId && user.accountType !== "admin") {
    const err: Error & { status?: number } = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

// Small helpers
export function ok<T>(c: any, payload: T) { return c.json<T>(payload); }
export function created<T>(c: any, payload: T) { return c.json<T>(payload, 201); }
export function badReq<T extends object>(c: any, msg: string, extra?: T) { return c.json({ error: msg, ...(extra ?? {}) }, 400); }
export function forbidden(c: any, msg = "Forbidden") { return c.json({ error: msg }, 403); }
export function notFound(c: any, msg = "Not found") { return c.json({ error: msg }, 404); }
