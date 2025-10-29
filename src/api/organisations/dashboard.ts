export type OrgDashboardStats = {
  listings: number;
  totalApplications: number;
  pending: number;
  confirmed: number;
};

export async function fetchOrgDashboard(): Promise<OrgDashboardStats> {
  const res = await fetch('/api/organisations/dashboard', {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch organisation dashboard data");
  return res.json();
}