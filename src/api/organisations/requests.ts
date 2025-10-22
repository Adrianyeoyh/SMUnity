export async function createOrganisationRequest(payload: {
  requesterEmail: string;
  requesterName: string;
  orgName: string;
  orgDescription?: string | null;
  website?: string | null;
}) {
  const res = await fetch("/api/organisations/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create organisation request");
  return res.json() as Promise<{ requestEmail: string }>;
}
