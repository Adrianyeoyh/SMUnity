// scripts/db-playground.ts
import { hashPassword } from "better-auth/crypto";
import { db } from "../server/drizzle/db";
import * as schema from "../server/drizzle/schema/domain";
import { user as authUser, account as authAccount } from "../server/drizzle/schema/auth";
import { eq, inArray } from "drizzle-orm";

/** Small helpers */
const now = () => new Date();
const pwd = async () => await hashPassword("password");

async function runSeed() {
  await db.transaction(async (tx) => {
    // 1) ADMIN
    await tx.insert(authUser).values({
      id: "admin",
      name: "Admin",
      email: "admin@test.com",
      accountType: "admin",
      emailVerified: true,
      createdAt: now(),
      updatedAt: now(),
      isActive: true,
      image: null,
    }).onConflictDoNothing();

    await tx.insert(authAccount).values({
      id: "admin",
      accountId: "admin",
      providerId: "credential",
      userId: "admin",
      password: await pwd(),
      createdAt: now(),
      updatedAt: now(),
    }).onConflictDoNothing();

    // 2) ORG REQUESTS (pending/approved/rejected)
    const orgRequests = [
      {
        requesterEmail: "hello@greensg.org",
        requesterName: "Mei Lin",
        orgName: "Green Singapore",
        orgDescription: "Environmental stewardship and coastal cleanups.",
        website: "https://greensg.org",
        phone: "61234567",
        status: "approved" as const,
        decidedBy: "admin",
        decidedAt: now(),
        comments: "Looks good.",
      },
      {
        requesterEmail: "contact@youthconnect.sg",
        requesterName: "Daniel Tan",
        orgName: "Youth Connect",
        orgDescription: "Mentoring youth and building life skills.",
        website: "https://youthconnect.sg",
        phone: "69876543",
        status: "pending" as const,
        decidedBy: null,
        decidedAt: null,
        comments: null,
      },
      {
        requesterEmail: "team@pawssg.org",
        requesterName: "Nur Aisyah",
        orgName: "Paws SG",
        orgDescription: "Animal rescue and adoption support.",
        website: "https://pawssg.org",
        phone: "63987654",
        status: "rejected" as const,
        decidedBy: "admin",
        decidedAt: now(),
        comments: "Insufficient documentation; please reapply.",
      },
    ];

    for (const r of orgRequests) {
      await tx.insert(schema.organisationRequests).values({
        id: undefined, // defaultRandom()
        requesterEmail: r.requesterEmail,
        requesterName: r.requesterName,
        orgName: r.orgName,
        orgDescription: r.orgDescription,
        website: r.website,
        phone: r.phone,
        status: r.status,
        decidedBy: r.decidedBy as any,
        decidedAt: r.decidedAt as any,
        createdAt: now(),
        comments: r.comments as any,
      }).onConflictDoNothing();
    }

    // 3) ORGANISATIONS (approved ones become real orgs/users). All with password "password".
    const orgs = [
      { id: "org1", name: "Green Singapore", slug: "green-singapore", website: "https://greensg.org", phone: "61234567" },
      { id: "org2", name: "Youth Connect", slug: "youth-connect", website: "https://youthconnect.sg", phone: "69876543" },
      { id: "org3", name: "Paws SG", slug: "paws-sg", website: "https://pawssg.org", phone: "63987654" },
    ];

    for (const org of orgs) {
      await tx.insert(authUser).values({
        id: org.id,
        name: org.name,
        email: `${org.slug}@test.com`,
        accountType: "organisation",
        emailVerified: true,
        createdAt: now(),
        updatedAt: now(),
        isActive: true,
        image: null,
      }).onConflictDoNothing();

      await tx.insert(authAccount).values({
        id: org.id,
        accountId: org.id,
        providerId: "credential",
        userId: org.id,
        password: await pwd(),
        createdAt: now(),
        updatedAt: now(),
      }).onConflictDoNothing();

      await tx.insert(schema.organisations).values({
        userId: org.id,
        slug: org.slug,
        description: `${org.name} — community partner.`,
        website: org.website,
        phone: org.phone,
        createdBy: "admin",
        createdAt: now(),
        updatedAt: now(),
        deletedAt: null,
      }).onConflictDoNothing();
    }

    // 4) PROJECTS (multiple listings per org) — random photos via Unsplash
    const projectSeeds = [
      // org1 (3 listings)
      {
        orgId: "org1",
        title: "Beach Cleanup Drive",
        summary: "Help clean up East Coast Park beach area.",
        category: "Environment",
        type: "local",
        description: "Join us in cleaning up the beach and preserving marine life.",
        aboutProvide: "Gloves, bags, supervision",
        aboutDo: "Pick plastic, sort recyclables, engage with community",
        requirements: "Must be > 18",
        skillTags: ["Empathy", "Teamwork"],
        district: "East Coast Park",
        isRemote: false,
        repeatInterval: 1,
        repeatUnit: "week",
        daysOfWeek: ["Saturday"],
        timeStart: "09:00:00",
        timeEnd: "13:00:00",
        startDate: new Date("2025-11-08T09:00:00+08:00"),
        endDate: new Date("2026-01-31T13:00:00+08:00"),
        applyBy: new Date("2025-11-05T23:59:59+08:00"),
        slotsTotal: 50,
        requiredHours: 4,
        imageUrl: "https://images.unsplash.com/photo-1581574200745-77f49a9f4f25",
        projectTags: ["Beach", "Cleanup"],
      },
      {
        orgId: "org1",
        title: "Mangrove Restoration",
        summary: "Plant and restore mangroves in Pasir Ris.",
        category: "Environment",
        type: "local",
        description: "Field restoration, seedling planting, and monitoring.",
        aboutProvide: "Boots, tools, training",
        aboutDo: "Planting, tagging, data collection",
        requirements: "Comfortable in muddy terrain",
        skillTags: ["Patience", "Carefulness"],
        district: "Pasir Ris",
        isRemote: false,
        repeatInterval: 2,
        repeatUnit: "week",
        daysOfWeek: ["Sunday"],
        timeStart: "08:00:00",
        timeEnd: "12:00:00",
        startDate: new Date("2025-11-09T08:00:00+08:00"),
        endDate: new Date("2026-03-29T12:00:00+08:00"),
        applyBy: new Date("2025-11-06T23:59:59+08:00"),
        slotsTotal: 25,
        requiredHours: 4,
        imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda",
        projectTags: ["Nature", "Forest"],
      },
      {
        orgId: "org1",
        title: "Recycling Education Booth",
        summary: "Educate the public on recycling best practices.",
        category: "Community",
        type: "local",
        description: "Run booths at malls to engage shoppers.",
        aboutProvide: "Booth materials, scripts",
        aboutDo: "Engage, explain, demonstrate sorting",
        requirements: "Confident speaking to public",
        skillTags: ["Communication"],
        district: "Tampines",
        isRemote: false,
        repeatInterval: 1,
        repeatUnit: "week",
        daysOfWeek: ["Saturday", "Sunday"],
        timeStart: "12:00:00",
        timeEnd: "16:00:00",
        startDate: new Date("2025-11-15T12:00:00+08:00"),
        endDate: new Date("2026-02-28T16:00:00+08:00"),
        applyBy: new Date("2025-11-12T23:59:59+08:00"),
        slotsTotal: 40,
        requiredHours: 4,
        imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
        projectTags: ["Education", "Recycling"],
      },
      // org2 (2 listings)
      {
        orgId: "org2",
        title: "Virtual Mentoring Program",
        summary: "Mentor youth online in life skills.",
        category: "Mentoring",
        type: "local",
        description: "Guide youth virtually on communication and skills.",
        aboutProvide: "Weekly online sessions",
        aboutDo: "Facilitate small groups, 1:1 check-ins",
        requirements: "Stable internet, headset",
        skillTags: ["Communication", "Leadership"],
        district: "Remote",
        isRemote: true,
        repeatInterval: 1,
        repeatUnit: "week",
        daysOfWeek: ["Wednesday"],
        timeStart: "18:00:00",
        timeEnd: "20:00:00",
        startDate: new Date("2025-11-05T18:00:00+08:00"),
        endDate: new Date("2026-02-05T20:00:00+08:00"),
        applyBy: new Date("2025-11-04T23:59:59+08:00"),
        slotsTotal: 30,
        requiredHours: 20,
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        projectTags: ["Mentoring", "Youth"],
      },
      {
        orgId: "org2",
        title: "Career Readiness Workshops",
        summary: "Teach resume writing & interview skills.",
        category: "Community",
        type: "local",
        description: "Online/onsite hybrid workshops for older youths.",
        aboutProvide: "Materials & templates",
        aboutDo: "Run activities, review resumes",
        requirements: "Comfortable presenting",
        skillTags: ["Coaching", "Facilitation"],
        district: "Queenstown",
        isRemote: false,
        repeatInterval: 2,
        repeatUnit: "week",
        daysOfWeek: ["Saturday"],
        timeStart: "10:00:00",
        timeEnd: "13:00:00",
        startDate: new Date("2025-11-22T10:00:00+08:00"),
        endDate: new Date("2026-03-14T13:00:00+08:00"),
        applyBy: new Date("2025-11-20T23:59:59+08:00"),
        slotsTotal: 20,
        requiredHours: 3,
        imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d",
        projectTags: ["Workshops"],
      },
      // org3 (2 listings)
      {
        orgId: "org3",
        title: "Animal Shelter Volunteering",
        summary: "Support dog shelter: walking/feeding/upkeep.",
        category: "Animal Welfare",
        type: "local",
        description: "Onsite shifts with supervision.",
        aboutProvide: "Training, safety brief",
        aboutDo: "Clean, feed, walk dogs",
        requirements: "Must love animals",
        skillTags: ["Patience", "Empathy"],
        district: "Pasir Ris",
        isRemote: false,
        repeatInterval: 1,
        repeatUnit: "week",
        daysOfWeek: ["Sunday"],
        timeStart: "10:00:00",
        timeEnd: "14:00:00",
        startDate: new Date("2025-11-09T10:00:00+08:00"),
        endDate: new Date("2026-01-11T14:00:00+08:00"),
        applyBy: new Date("2025-11-07T23:59:59+08:00"),
        slotsTotal: 20,
        requiredHours: 10,
        imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
        projectTags: ["Animals", "Shelter"],
      },
      {
        orgId: "org3",
        title: "Community Pet Adoption Day",
        summary: "Help run adoption drives and speak to public.",
        category: "Arts & Culture",
        type: "local",
        description: "Booths, forms, and match-making for adopters.",
        aboutProvide: "Booths, paperwork",
        aboutDo: "Engage visitors, brief care requirements",
        requirements: "People-friendly",
        skillTags: ["Communication"],
        district: "Toa Payoh",
        isRemote: false,
        repeatInterval: 1,
        repeatUnit: "month",
        daysOfWeek: ["Saturday"],
        timeStart: "11:00:00",
        timeEnd: "16:00:00",
        startDate: new Date("2025-11-29T11:00:00+08:00"),
        endDate: new Date("2026-04-26T16:00:00+08:00"),
        applyBy: new Date("2025-11-25T23:59:59+08:00"),
        slotsTotal: 25,
        requiredHours: 5,
        imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
        projectTags: ["Adoption", "Events"],
      },
    ];

    await tx.insert(schema.projects).values(
      projectSeeds.map(p => ({
        id: undefined,
        orgId: p.orgId,
        title: p.title,
        summary: p.summary,
        category: p.category,
        type: p.type,
        description: p.description,
        aboutProvide: p.aboutProvide,
        aboutDo: p.aboutDo,
        requirements: p.requirements,
        skillTags: p.skillTags,
        district: p.district,
        googleMaps: "",
        latitude: null,
        longitude: null,
        isRemote: p.isRemote,
        repeatInterval: p.repeatInterval,
        repeatUnit: p.repeatUnit,
        daysOfWeek: p.daysOfWeek,
        timeStart: p.timeStart as any,
        timeEnd: p.timeEnd as any,
        startDate: p.startDate as any,
        endDate: p.endDate as any,
        applyBy: p.applyBy as any,
        slotsTotal: p.slotsTotal,
        requiredHours: p.requiredHours,
        imageUrl: p.imageUrl,
        projectTags: p.projectTags,
        createdAt: now(),
      }))
    ).onConflictDoNothing();

    // Map titles -> project IDs
    const titles = projectSeeds.map(p => p.title);
    const inserted = await tx
      .select({ id: schema.projects.id, title: schema.projects.title })
      .from(schema.projects)
      .where(inArray(schema.projects.title, titles));

    const projectIdByTitle = new Map(inserted.map(r => [r.title, r.id]));

    // 5) STUDENTS + PROFILES (password: "password")
    const students = [
      { id: "stud1", name: "Alice Tan", email: "alice.2025@smu.edu.sg", entryYear: 2022, school: "SCIS", skills: ["Communication", "Creativity"], interests: ["Kids", "Environment"] },
      { id: "stud2", name: "Ben Lim",   email: "ben.2024@smu.edu.sg",   entryYear: 2021, school: "LKCSB", skills: ["Teaching", "Empathy"],       interests: ["Education", "Children"] },
      { id: "stud3", name: "Carmen Ong",email: "carmen.2026@smu.edu.sg",entryYear: 2023, school: "SOSS", skills: ["Program Design", "Patience"], interests: ["Animals", "Community"] },
      { id: "stud4", name: "David Koh", email: "david.2025@smu.edu.sg", entryYear: 2022, school: "SIS",  skills: ["Coding"],                      interests: ["Environment", "Workshops"] },
    ];

    for (const stu of students) {
      await tx.insert(authUser).values({
        id: stu.id,
        name: stu.name,
        email: stu.email,
        accountType: "student",
        emailVerified: true,
        createdAt: now(),
        updatedAt: now(),
        isActive: true,
        image: null,
      }).onConflictDoNothing();

      await tx.insert(authAccount).values({
        id: stu.id,
        accountId: stu.id,
        providerId: "credential",
        userId: stu.id,
        password: await pwd(),
        createdAt: now(),
        updatedAt: now(),
      }).onConflictDoNothing();

      await tx.insert(schema.profiles).values({
        userId: stu.id,
        phone: `8${Math.floor(10000000 + Math.random() * 90000000)}`,
        studentId: `S${Math.floor(1000000 + Math.random()*9000000)}`,
        entryYear: stu.entryYear,
        school: stu.school,
        skills: stu.skills as any,
        interests: stu.interests as any,
      }).onConflictDoNothing();
    }

    // 6) APPLICATIONS across statuses (pending, accepted, rejected, confirmed, withdrawn)
    // No "cancelled"
    type AppSeed = {
      studentId: string;
      projectTitle: string;
      status: "pending" | "accepted" | "rejected" | "confirmed" | "withdrawn";
    };

    const apps: AppSeed[] = [
      { studentId: "stud1", projectTitle: "Beach Cleanup Drive",       status: "pending"   },
      { studentId: "stud1", projectTitle: "Virtual Mentoring Program", status: "accepted"  },
      { studentId: "stud2", projectTitle: "Mangrove Restoration",      status: "rejected"  },
      { studentId: "stud3", projectTitle: "Animal Shelter Volunteering", status: "confirmed" },
      { studentId: "stud2", projectTitle: "Recycling Education Booth", status: "withdrawn" },
      { studentId: "stud4", projectTitle: "Career Readiness Workshops", status: "accepted"  },
      { studentId: "stud3", projectTitle: "Community Pet Adoption Day", status: "pending"   },
    ];

    for (const app of apps) {
      const projId = projectIdByTitle.get(app.projectTitle);
      if (!projId) continue;

      await tx.insert(schema.applications).values({
        projectId: projId,
        userId: app.studentId,
        status: app.status,
        motivation: "I’m excited to contribute and learn.",
        experience: ["none", "some", "extensive"][Math.floor(Math.random()*3)],
        skills: "Teamwork, Communication",
        comments: Math.random() > 0.5 ? "Looking forward to it!" : null,
        acknowledgeSchedule: true,
        agree: true,
        submittedAt: now(),
        decidedAt: app.status === "pending" ? null : now(),
      }).onConflictDoNothing();

      // If confirmed -> create membership
      if (app.status === "confirmed") {
        await tx.insert(schema.projMemberships).values({
          projId,
          userId: app.studentId,
          acceptedAt: now(),
        }).onConflictDoNothing();
      }
    }
  });

  console.log("✅ Seed complete.");
}

runSeed()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
