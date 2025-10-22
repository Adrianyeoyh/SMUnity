export async function createOrganisationRequest(payload: {
  requesterEmail: string;
  requesterName: string;
  orgName: string;
  orgDescription?: string | null;
  website?: string | null;
}) {
  const res = await fetch(`${process.env.VITE_SERVER_URL}/api/organisations/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create organisation request");
  return res.json() as Promise<{ requesterEmail: string }>;
}
