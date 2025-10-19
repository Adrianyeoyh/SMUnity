// #client/api/client.ts
export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `GET ${url} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `POST ${url} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`PATCH ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}
