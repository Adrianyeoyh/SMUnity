export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ok = <T>(c: any, payload: T) => c.json<T>(payload);
export const created = <T>(c: any, payload: T) => c.json<T>(payload, 201);
export const badReq = (c: any, msg = "Bad Request", extra?: Record<string, unknown>) =>
  c.json({ error: msg, ...(extra ?? {}) }, 400);
export const forbidden = (c: any, msg = "Forbidden") => c.json({ error: msg }, 403);
export const notFound = (c: any, msg = "Not found") => c.json({ error: msg }, 404);