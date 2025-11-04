// #client/api/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./client";
import type { OrganisationProfileData, OrganisationFormData } from "./types";


import type {
  MeRes,
  UpdateProfilePayload,
  ProfileFormData,
  ProjectCard,
  ProjectDetail,
  ProjectSessionRow,
  MyAppRow,
  FavCard,
  UpcomingRow,
} from "./types";

// -------- users --------
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiGet<MeRes>("/api/users/me"),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => apiPatch<MeRes>("/api/users/me", payload),
    onSuccess: (data) => {
      qc.setQueryData<MeRes>(["me"], data);
    },
  });
}

export function useProfileSettings() {
  return useQuery({
    queryKey: ["profileForm"],
    queryFn: () => apiGet<ProfileFormData>("/api/profile"),
  });
}

export function useSaveProfileSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileFormData) => apiPut<{ ok: true }>("/api/profile", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profileForm"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

// -------- projects (public) --------
export function useProjectCards(params?: {
  q?: string; categoryId?: number; tagId?: number[]; status?: "approved" | "pending" | "draft" | "closed" | "archived";
}) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.categoryId) qs.set("categoryId", String(params.categoryId));
  if (params?.status) qs.set("status", params.status);
  if (params?.tagId?.length) params.tagId.forEach(t => qs.append("tagId", String(t)));
  const url = `/api/projects${qs.toString() ? `?${qs.toString()}` : ""}`;

  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => apiGet<ProjectCard[]>(url),
  });
}

export function useProjectDetail(id: number | undefined) {
  return useQuery({
    queryKey: ["project", id],
    enabled: !!id,
    queryFn: () => apiGet<ProjectDetail>(`/api/projects/${id}`),
  });
}

export function useProjectSessions(id: number | undefined) {
  return useQuery({
    queryKey: ["project", id, "sessions"],
    enabled: !!id,
    queryFn: () => apiGet<ProjectSessionRow[]>(`/api/projects/${id}/sessions`),
  });
}

// -------- student applications --------
export function useMyApplications(status?: MyAppRow["status"]) {
  const qs = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["myApplications", status ?? "all"],
    queryFn: () => apiGet<MyAppRow[]>(`/api/projects/applications${qs}`),
  });
}

export function useApplyToProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { projectId: number; sessionId?: number | null; motivation?: string | null }) =>
      apiPost<{ id: number }>("/api/projects/applications", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      apiPost<{ ok: true }>(`/api/projects/applications/${applicationId}/withdraw`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}

// -------- favourites --------
export function usefavourites() {
  return useQuery({
    queryKey: ["favourites"],
    queryFn: () => apiGet<FavCard[]>(`/api/projects/favourites`),
  });
}

export function useSavefavourite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) => apiPost<{ ok: true }>("/api/projects/favourites", { projectId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favourites"] }),
  });
}

export function useUnsavefavourite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) => apiDelete<{ ok: true }>(`/api/projects/favourites?projectId=${projectId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favourites"] }),
  });
}

// -------- upcoming sessions (student) --------
export function useUpcomingSessions() {
  return useQuery({
    queryKey: ["upcomingSessions"],
    queryFn: () => apiGet<UpcomingRow[]>(`/api/projects/sessions/upcoming`),
  });
}

import { fetchCompletedProjectsProfile } from "./student";
import type { CompletedCspRow } from "./types";

export function useCompletedCSPs() {
  return useQuery<CompletedCspRow[]>({
    queryKey: ["completedCSPs"],
    queryFn: fetchCompletedProjectsProfile,
  });
}

// -------- organisations --------

// Fetch organisation data (profile)
export function useOrganisation() {
  return useQuery({
    queryKey: ["organisation"],
    queryFn: () => apiGet<OrganisationProfileData>("/api/organisations/profile"),
  });
}

// Update organisation profile (e.g. name, contact, description)
export function useUpdateOrganisation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrganisationFormData) =>
      apiPatch<OrganisationProfileData>("/api/organisations/profile", payload),
    onSuccess: (data) => {
      // Update cache so Profile page instantly reflects changes
      qc.setQueryData(["organisation"], data);
      qc.invalidateQueries({ queryKey: ["organisationSettings"] });
    },
  });
} 
