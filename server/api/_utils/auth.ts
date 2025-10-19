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
  return { id: u.id, email: u.email, accountType: u.accountType };
}

export function assertRole(user: UserSession, allowed: AccountType[]) {
  if (!allowed.includes(user.accountType)) {
    const err: Error & { status?: number } = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}