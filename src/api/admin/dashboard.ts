// src/api/admin/dashboard.ts
import { AdminDashboardResponse } from "server/api/admin/dashboard";

export async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  const res = await fetch("/api/admin/dashboard", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin dashboard data: ${res.statusText}`);
  }

  return res.json() as Promise<AdminDashboardResponse>;
}
