
export async function fetchOngoingProjects() {
  const res = await fetch("/api/student/dashboard/ongoing-projects", {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch ongoing projects: ${err}`);
  }

  return res.json();
}

export async function fetchPendingApplications() {
  const res = await fetch("/api/student/dashboard/pending-applications", {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch pending applications: ${err}`);
  }

  return res.json();
}

export async function fetchCompletedProjects() {
  const res = await fetch("/api/student/dashboard/completed-projects", {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch completed projects: ${err}`);
  }

  return res.json();
}

export async function fetchAllApplications() {
  const res = await fetch("/api/student/dashboard/applications", {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch user applications: ${err}`);
  }

  return res.json();
}

export async function fetchUpcomingSessions() {
  const res = await fetch("/api/student/dashboard/upcoming-sessions", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch upcoming sessions: ${errText}`);
  }

  return res.json();
}

// client/api/student/applications.ts

export async function confirmApplication(applicationId: number) {
  const res = await fetch("/api/student/applications/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ applicationId }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function withdrawApplication(applicationId: number) {
  const res = await fetch("/api/student/applications/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ applicationId }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchMyApplications() {
  const res = await fetch("/api/student/applications/list", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchSaveProject(projectId: string) {
  const res = await fetch("/api/student/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchUnsaveProject(projectId: string) {
  const res = await fetch("/api/student/save", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchSavedProjects() {
  const res = await fetch("/api/student/save/list", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchCompletedProjectsProfile() {
  const res = await fetch("/api/student/profile/completed", {
    credentials: "include", // keep auth cookies/session
  });

  if (!res.ok) {
    throw new Error("Failed to fetch completed projects");
  }

  return res.json();
}