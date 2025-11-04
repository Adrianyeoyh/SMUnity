// src/api/admin/create.ts
export type CreateOrganiserPayload = {
  email: string;
  organiserName: string;
  organisationName: string;
  password: string;
};

export type CreateOrganiserResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Calls the backend /api/admin/organisations/create endpoint
 */
export async function createOrganiser(
  payload: CreateOrganiserPayload
): Promise<CreateOrganiserResponse> {
  const response = await fetch("/api/admin/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // important for session cookies
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create organisation");
  }

  return result as CreateOrganiserResponse;

}