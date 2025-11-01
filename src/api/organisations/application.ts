export async function decideApplication(applicationId: number, action: "accept" | "reject") {
  const res = await fetch("/api/organisations/application/decision", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId, action }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update application");
  return data;
}


export async function fetchApplicantDetails(projectId: string, applicantId: string) {
  try {
    const res = await fetch(
      `/api/organisations/application/viewApplicant/${projectId}/${applicantId}`,
      {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch applicant details: ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ fetchApplicantDetails failed:", err);
    throw err;
  }
}