// src/api/admin/organisations.ts

export type OrganisationRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  projects: number;
  status: "active" | "pending" | "suspended";
  createdAt: string; // ISO date
  description?: string;
};

// Temporary stub returning mock data until backend endpoint exists
export async function fetchAdminOrganisations(): Promise<OrganisationRecord[]> {
  // In the future, replace with:
  // const res = await fetch("/api/admin/organisations", { credentials: "include" });
  // if (!res.ok) throw new Error("Failed to load organisations");
  // const json = await res.json();
  // return json.data ?? json;

  await new Promise((r) => setTimeout(r, 250));

  return [
    {
      id: "org_001",
      name: "Helping Hands Foundation",
      email: "contact@helpinghands.org",
      phone: "+65 6123 4567",
      website: "https://helpinghands.org",
      projects: 12,
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      description: "Providing assistance to underprivileged communities through a network of volunteers and partners.",
    },
    {
      id: "org_002",
      name: "Green Earth Collective",
      email: "hello@greenearth.sg",
      phone: "+65 6987 1234",
      website: "https://greenearth.sg",
      projects: 5,
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      description: "Grassroots movement focused on environmental conservation, tree planting, and sustainability education.",
    },
    {
      id: "org_003",
      name: "Community Care Network",
      email: "admin@ccn.org",
      phone: "+65 6555 8877",
      website: "https://ccn.org",
      projects: 0,
      status: "suspended",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
      description: "Coordinating community outreach, elder care, and support services for vulnerable groups.",
    },
  ];
}


