// server/drizzle/seed.ts
import { db } from "../db";
import * as schema from "../schema/domain";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding SMUnity database...");

  // 1️⃣ Clear tables (safe reset for dev only)
  await db.delete(schema.projectSessions);
  await db.delete(schema.projects);
  await db.delete(schema.organisations);
  await db.delete(schema.profiles);
  await db.delete(schema.users);

  // 2️⃣ Create admin
  const adminHash = await bcrypt.hash("admin", 10);
  const [admin] = await db.insert(schema.users).values({
    email: "admin@smunity.sg",
    passwordHash: adminHash,
    accountType: "admin",
  }).returning();

  // 3️⃣ Create students (OAuth users)
  const studentEmails = [
    "adrian.yeo.2024@smu.edu.sg",
    "kara.huang.2024@smu.edu.sg",
    "calynn.ong.2024@smu.edu.sg",
    "xy.tan.2024@computing.smu.edu.sg",
  ];

  const studentUsers = await Promise.all(
    studentEmails.map(async (email) => {
      const [user] = await db.insert(schema.users).values({
        email,
        passwordHash: null, // OAuth only
        accountType: "student",
      }).returning({ id: schema.users.id, email: schema.users.email });

      await db.insert(schema.profiles).values({
        userId: user.id,
        displayName: email.split("@")[0].replace(/\./g, " "),
        graduationYear: 2024,
        school: email.includes("computing") ? "SCIS" : "LKCSB",
      });

      return user;
    })
  );

  // 4️⃣ Create organisations (with login accounts)
  const orgs = [
    { name: "SMU Rotaract", slug: "smu-rotaract" },
    { name: "Project Kidleidoscope", slug: "project-kidleidoscope" },
    { name: "Silver Care Association", slug: "silver-care" },
  ];

  const orgUsers = await Promise.all(
    orgs.map(async (org) => {
      const hash = await bcrypt.hash("organisation", 10);
      const [user] = await db.insert(schema.users).values({
        email: `${org.slug}@csp.sg`,
        passwordHash: hash,
        accountType: "organisation",
      }).returning({ id: schema.users.id });

      const [o] = await db.insert(schema.organisations).values({
        userId: user.id,
        name: org.name,
        slug: org.slug,
        description: `${org.name} official community service organisation.`,
        email: `${org.slug}@csp.sg`,
        website: `https://${org.slug}.sg`,
        createdBy: admin.id,
      }).returning();

      return o;
    })
  );

  // 5️⃣ Create projects for each organisation
  const projectsData = [
    {
      org: orgUsers[1],
      title: "Project Kidleidoscope",
      categoryId: null,
      description: "Empowering children through creative learning.",
      location: "SMU, Bras Basah",
      slotsTotal: 40,
    },
    {
      org: orgUsers[0],
      title: "Project Candela",
      categoryId: null,
      description: "Mentorship program for primary school students.",
      location: "Kranji",
      slotsTotal: 50,
    },
    {
      org: orgUsers[2],
      title: "Elderly Home Visitation",
      categoryId: null,
      description: "Providing companionship to elderly residents.",
      location: "Bishan",
      slotsTotal: 25,
    },
  ];

  const projectRows = await Promise.all(
    projectsData.map(async (p) => {
      const [proj] = await db.insert(schema.projects).values({
        orgId: p.org.id,
        title: p.title,
        description: p.description,
        location: p.location,
        slotsTotal: p.slotsTotal,
        slotsFilled: Math.floor(p.slotsTotal / 3),
        status: "approved",
        createdBy: p.org.userId,
        approvedBy: admin.id,
        approvedAt: new Date(),
      }).returning();

      // Sessions
      const today = new Date();
      for (let i = 0; i < 3; i++) {
        const start = new Date(today);
        start.setDate(today.getDate() + i * 7);
        start.setHours(14, 0, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + 2);

        await db.insert(schema.projectSessions).values({
          projectId: proj.id,
          startsAt: start,
          endsAt: end,
          capacity: 20,
        });
      }

      return proj;
    })
  );

  console.log("✅ Seed complete!");
  console.table({
    admin: admin.email,
    students: studentUsers.length,
    organisations: orgUsers.length,
    projects: projectRows.length,
  });
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error", err);
  process.exit(1);
});
