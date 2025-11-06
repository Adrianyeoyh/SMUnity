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

export function extractCoordsFromGoogleMaps(url: string): { lat: number | null; lng: number | null } {
  if (!url) return { lat: null, lng: null };

  // Try @lat,lng first
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return {
      lat: parseFloat(atMatch[1]),
      lng: parseFloat(atMatch[2]),
    };
  }

  // Try !3dlat!4dlng pattern
  const exMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (exMatch) {
    return {
      lat: parseFloat(exMatch[1]),
      lng: parseFloat(exMatch[2]),
    };
  }

  // If both fail, return nulls
  return { lat: null, lng: null };
}