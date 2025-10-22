import { hashPassword } from "better-auth/crypto";
import { db } from '#server/drizzle/db';
import { users } from "#server/drizzle/schema/domain.ts";
import { account } from "#server/drizzle/schema/auth.ts";

await db.transaction(async (tx) => {
    // Admin user
    await tx
      .insert(users)
      .values({
        id: "admin",
        name: "Admin",
        email: "admin@test.com",
        accountType: "admin", 
        emailVerified: true,
      })
      .onConflictDoNothing();
    await tx
      .insert(account)
      .values({
        id: "admin",
        accountId: "admin",
        userId: "admin",
        providerId: "credential",
        password: await hashPassword("password"),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
})