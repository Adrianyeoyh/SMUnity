// src/client/api/admin/viewOrgs.ts
// import { env } from "#client/env";

export type OrganisationRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  suspended: boolean;
  status: "active" | "suspended";
  projects: number;
};

/** ✅ Fetch all organisations */
export async function fetchAdminOrganisations(): Promise<OrganisationRecord[]> {
  const res = await fetch(`/api/admin/viewOrgs`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch organisations");
  const json = await res.json();
  return json.data;
}

/** ✅ Suspend an organisation */
export async function suspendOrganisation(id: string): Promise<void> {
  const res = await fetch(`/api/admin/viewOrgs/${id}/suspend`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to suspend organisation");
}

/** ✅ Reactivate an organisation */
export async function reactivateOrganisation(id: string): Promise<void> {
  const res = await fetch(`/api/admin/viewOrgs/${id}/reactivate`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to reactivate organisation");
}
