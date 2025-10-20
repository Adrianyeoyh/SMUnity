// server/api/_utils/auth.ts
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
  if (!u?.id || !u?.email) {
    c.status(401);
    throw new Error("Not authenticated");
  }
  return { id: u.id, email: String(u.email).toLowerCase(), accountType: (u.accountType ?? "student") as AccountType };
}

export function assertRole(user: UserSession, allowed: AccountType[]) {
  if (!allowed.includes(user.accountType)) {
    const err: Error & { status?: number } = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }
}
