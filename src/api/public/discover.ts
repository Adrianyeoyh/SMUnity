export async function fetchDiscoverProjects() {
  const res = await fetch("/api/discover", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch open projects");
  // console.log(res.json)
  return res.json(); // { projects: [...] }
}

export async function fetchCspById(id: string) {
  const res = await fetch(`/api/discover/${id}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load project details");
  // console.log(res.json)
  return res.json();
}
