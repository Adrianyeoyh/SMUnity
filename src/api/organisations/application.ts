export async function decideApplication(applicationId: number, action: "accept" | "reject") {
  const res = await fetch("/api/organisations/applications/decision", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId, action }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update application");
  return data;
}