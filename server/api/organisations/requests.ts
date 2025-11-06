// server/api/organisations/requests.ts
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
// import { requireSession, assertRole, ok, created, badReq, notFound } from "../_utils/auth";
import { badReq, created, notFound, ok } from "#server/helper";

export const organisationRequestsRoutes = new Hono();

const RequestCreate = z.object({
  requesterEmail: z.string().email(),
  requesterName: z.string().min(1).nullish(),
  orgName: z.string().min(2),
  orgDescription: z.string().nullish(),
  phone: z.string().min(8),
  website: z.string().url().or(z.literal("")).nullish(),
});

organisationRequestsRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = RequestCreate.safeParse(body);
  if (!parsed.success) return badReq(c, "Missing or invalid fields");
  try {
    const [ins] = await db
      .insert(schema.organisationRequests)
      .values({
        requesterEmail: parsed.data.requesterEmail.toLowerCase(),
        requesterName: parsed.data.requesterName ?? null,
        orgName: parsed.data.orgName,
        orgDescription: parsed.data.orgDescription ?? null,
        phone: parsed.data.phone ?? null,
        website: parsed.data.website ?? null,
      })
      .returning({
        requesterEmail: schema.organisationRequests.requesterEmail,
      });

    return created(c, { requesterEmail: ins.requesterEmail });
  } catch (err: any) {
    if (err.code === "23505") {
      return badReq(c, "A request for this email already exists.");
    }

    console.error("Error inserting organisation request:", err);
    return badReq(c, "Unexpected server error");
  }
});
