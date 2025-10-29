// src/api/organisations/listing/new.ts
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
    location_text: data.location_text,
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
