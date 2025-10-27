
// import { auth } from "#server/lib/auth";

// export type AccountType = "student" | "organisation" | "admin";

// export type UserSession = {
//   id: string;
//   email: string;
//   accountType: AccountType;
// };

// export class ApiError extends Error {
//   status: number;
//   constructor(status: number, message: string) {
//     super(message);
//     this.status = status;
//   }
// }

// export async function requireSession(c: any): Promise<UserSession> {
//   const session = await auth.api.getSession({ headers: c.req.raw.headers });
//   const u = session?.user
//   console.log(u)
//   if (!u?.id || !u?.email || !u?.accountType) {
//     throw new ApiError(401, "Not authenticated");
//   }
//   return { id: u.id, email: String(u.email).toLowerCase(), accountType: u.accountType as AccountType };
// }

// export function assertRole(user: UserSession, allowed: AccountType[]) {
//   if (!allowed.includes(user.accountType)) {
//     throw new ApiError(403, "Forbidden");
//   }
// }

// export function assertSelfOrAdmin(user: UserSession, ownerId: string) {
//   if (user.id !== ownerId && user.accountType !== "admin") {
//     throw new ApiError(403, "Forbidden");
//   }
// }

// Small helpers (typed, consistent)
// export const ok = <T>(c: any, payload: T) => c.json<T>(payload);
// export const created = <T>(c: any, payload: T) => c.json<T>(payload, 201);
// export const badReq = (c: any, msg = "Bad Request", extra?: Record<string, unknown>) =>
//   c.json({ error: msg, ...(extra ?? {}) }, 400);
// export const forbidden = (c: any, msg = "Forbidden") => c.json({ error: msg }, 403);
// export const notFound = (c: any, msg = "Not found") => c.json({ error: msg }, 404);
