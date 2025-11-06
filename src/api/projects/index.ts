export type ApplicationPayload = {
  projectId: string;
  motivation: string;
  experience: "none" | "some" | "extensive";
  skills?: string;
  comments?: string;
  acknowledgeSchedule: boolean;
  agree: boolean;
};

export async function createApplication(payload: ApplicationPayload) {
  const res = await fetch("/api/projects/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to submit application");
  }

  return data;
}