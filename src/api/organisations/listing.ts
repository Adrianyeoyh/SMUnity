// src/api/organisations/listing.ts
import { FormInput } from "#client/helper";

/**
 * Create a new project listing for an organisation.
 * Calls the backend endpoint at /api/organisations/listing/new
 */
export async function createOrganisationProject(data: FormInput) {
  const payload = {
    title: data.title,
    summary: data.summary,
    category: data.category,
    project_type: data.project_type,
    description: data.description,
    about_provide: data.about_provide,
    about_do: data.about_do,
    requirements: data.requirements,
    skill_tags: data.skill_tags,
    district: data.district,
    google_maps: data.google_maps,
    remote: data.remote,
    repeat_interval: data.repeat_interval,
    repeat_unit: data.repeat_unit,
    days_of_week: data.days_of_week,
    time_start: data.time_start,
    time_end: data.time_end,
    start_date: data.start_date,
    end_date: data.end_date,
    application_deadline: data.application_deadline,
    commitable_hours: data.commitable_hours,
    slots: data.slots,
    image_url: data.image_url,
    project_tags: data.project_tags,
  };

  const res = await fetch("/api/organisations/listing/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create project: ${err}`);
  }

  return res.json();
}

// export async function fetchListingById({ queryKey }: any) {
//   const [_key, projectId] = queryKey;
//   const res = await fetch(`/organisations/listing/${projectId}`, {
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error("Failed to fetch project listing");
//   return res.json();
// }
export async function fetchListingById({ queryKey }: any) {
  const [_key, projectId] = queryKey;

  try {
    console.log("🔍 Fetching listing for projectId:", projectId);
    const res = await fetch(`/api/organisations/listing/${projectId}`, {
      credentials: "include",
    });

    console.log("📡 Response status:", res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch failed:", res.status, text);
      throw new Error(`Failed to fetch project listing: ${text}`);
    }

    const json = await res.json();
    console.log("✅ Parsed JSON response:", json);
    return json.data ?? json;
  } catch (err) {
    console.error("🚨 fetchListingById error:", err);
    throw err;
  }
}

