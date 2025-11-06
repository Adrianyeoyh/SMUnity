import { hashPassword } from "better-auth/crypto";
import { db } from '../server/drizzle/db';
import { user } from "../server/drizzle/schema";
import { account } from "../server/drizzle/schema/auth";

await db.transaction(async (tx) => {
    // Admin user
    await tx
      .insert(user)
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

process.exit(0)