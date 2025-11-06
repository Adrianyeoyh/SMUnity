// src/api/admin/queue.ts
export async function fetchApprovalQueue() {
  const res = await fetch("/api/admin/queue", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch approval queue");
  const data = await res.json();
  return data.data;
}

export async function approveRequest(id: string) {
  const res = await fetch(`/api/admin/queue/${id}/approve`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to approve request");
  return await res.json();
}

export async function rejectRequest(id: string, comments: string) {
  const res = await fetch(`/api/admin/queue/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comments }),
  });
  if (!res.ok) throw new Error("Failed to reject request");
  return await res.json();
}
