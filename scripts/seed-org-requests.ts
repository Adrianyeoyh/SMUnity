import { db } from "../server/drizzle/db";
import { organisationRequests } from "../server/drizzle/schema/domain";

await db.delete(organisationRequests);
console.log("🗑️ Cleared organisation_requests table");

await db.insert(organisationRequests).values([
  {
    requesterEmail: "sarah@heartfullkitchen.org",
    requesterName: "Sarah Chen",
    orgName: "Heartfull Kitchen",
    orgDescription:
      "Community service initiative by Heartfull Kitchen led by Sarah Chen.",
    website: "https://heartfullkitchen.org",
    phone: "+65 9334 1122",
    status: "pending",
    createdAt: new Date("2025-03-02"),
  },
  {
    requesterEmail: "michael@repairforward.org",
    requesterName: "Michael Tan",
    orgName: "Repair Forward",
    orgDescription:
      "Community service initiative by Repair Forward led by Michael Tan.",
    website: "https://repairforward.org",
    phone: "+65 9456 7788",
    status: "pending",
    createdAt: new Date("2025-03-01"),
  },
  {
    requesterEmail: "jennifer@caresmu.com",
    requesterName: "Jennifer Lim",
    orgName: "CareSMU",
    orgDescription:
      "Community service initiative by CareSMU led by Jennifer Lim.",
    website: "https://caresmu.org",
    phone: "+65 8123 5678",
    status: "pending",
    createdAt: new Date("2025-02-28"),
  },
  {
    requesterEmail: "david@brightminds.sg",
    requesterName: "David Wong",
    orgName: "Bright Minds SG",
    orgDescription:
      "Community service initiative by Bright Minds SG led by David Wong.",
    website: "https://brightmindssg.org",
    phone: "+65 8765 4432",
    status: "rejected",
    createdAt: new Date("2025-02-25"),
    decidedAt: new Date("2025-02-26"),
    decidedBy: "admin",
  },
  {
    requesterEmail: "emily@greenearth.sg",
    requesterName: "Emily Rodriguez",
    orgName: "Green Earth Initiative",
    orgDescription:
      "Community service initiative by Green Earth Initiative led by Emily Rodriguez.",
    website: "https://greenearthinitiative.org",
    phone: "+65 9234 5678",
    status: "pending",
    createdAt: new Date("2025-02-24"),
  },
  {
    requesterEmail: "james@techforgood.org",
    requesterName: "James Kumar",
    orgName: "Tech for Good",
    orgDescription:
      "Community service initiative by Tech for Good led by James Kumar.",
    website: "https://techforgood.org",
    phone: "+65 9345 6789",
    status: "pending",
    createdAt: new Date("2025-02-23"),
  },
  {
    requesterEmail: "lisa@youthempowerment.sg",
    requesterName: "Lisa Park",
    orgName: "Youth Empowerment Hub",
    orgDescription:
      "Community service initiative by Youth Empowerment Hub led by Lisa Park.",
    website: "https://youthempowermenthub.org",
    phone: "+65 9456 7890",
    status: "pending",
    createdAt: new Date("2025-02-22"),
  },
  {
    requesterEmail: "robert@communitycare.org",
    requesterName: "Robert Singh",
    orgName: "Community Care Network",
    orgDescription:
      "Community service initiative by Community Care Network led by Robert Singh.",
    website: "https://communitycarenetwork.org",
    phone: "+65 9567 8901",
    status: "rejected",
    createdAt: new Date("2025-02-21"),
    decidedAt: new Date("2025-02-22"),
    decidedBy: "admin",
  },
  {
    requesterEmail: "amanda@elderlysupport.sg",
    requesterName: "Amanda Lee",
    orgName: "Elderly Support Foundation",
    orgDescription:
      "Community service initiative by Elderly Support Foundation led by Amanda Lee.",
    website: "https://elderlysupportfoundation.org",
    phone: "+65 9678 9012",
    status: "pending",
    createdAt: new Date("2025-02-20"),
  },
  {
    requesterEmail: "thomas@digitalliteracy.org",
    requesterName: "Thomas Ng",
    orgName: "Digital Literacy Project",
    orgDescription:
      "Community service initiative by Digital Literacy Project led by Thomas Ng.",
    website: "https://digitalliteracyproject.org",
    phone: "+65 9789 0123",
    status: "pending",
    createdAt: new Date("2025-02-19"),
  },
  {
    requesterEmail: "maria@childrenshope.sg",
    requesterName: "Maria Garcia",
    orgName: "Children's Hope Center",
    orgDescription:
      "Community service initiative by Children's Hope Center led by Maria Garcia.",
    website: "https://childrenshopecenter.org",
    phone: "+65 9890 1234",
    status: "pending",
    createdAt: new Date("2025-02-18"),
  },
  {
    requesterEmail: "kevin@envaction.org",
    requesterName: "Kevin Lim",
    orgName: "Environmental Action Group",
    orgDescription:
      "Community service initiative by Environmental Action Group led by Kevin Lim.",
    website: "https://environmentalactiongroup.org",
    phone: "+65 9901 2345",
    status: "pending",
    createdAt: new Date("2025-02-17"),
  },
  {
    requesterEmail: "rachel@mentalhealth.sg",
    requesterName: "Rachel Tan",
    orgName: "Mental Health Advocates",
    orgDescription:
      "Community service initiative by Mental Health Advocates led by Rachel Tan.",
    website: "https://mentalhealthadvocates.org",
    phone: "+65 9012 3456",
    status: "pending",
    createdAt: new Date("2025-02-16"),
  },
  {
    requesterEmail: "alex@homelesssupport.org",
    requesterName: "Alex Chen",
    orgName: "Homeless Support Services",
    orgDescription:
      "Community service initiative by Homeless Support Services led by Alex Chen.",
    website: "https://homelesssupportservices.org",
    phone: "+65 9123 4567",
    status: "rejected",
    createdAt: new Date("2025-02-15"),
    decidedAt: new Date("2025-02-16"),
    decidedBy: "admin",
  },
  {
    requesterEmail: "sophie@animalrescue.sg",
    requesterName: "Sophie Williams",
    orgName: "Animal Rescue Foundation",
    orgDescription:
      "Community service initiative by Animal Rescue Foundation led by Sophie Williams.",
    website: "https://animalrescuefoundation.org",
    phone: "+65 9234 5678",
    status: "pending",
    createdAt: new Date("2025-02-14"),
  },
  {
    requesterEmail: "daniel@educationaccess.org",
    requesterName: "Daniel Kim",
    orgName: "Education Access Initiative",
    orgDescription:
      "Community service initiative by Education Access Initiative led by Daniel Kim.",
    website: "https://educationaccessinitiative.org",
    phone: "+65 9345 6789",
    status: "pending",
    createdAt: new Date("2025-02-13"),
  },
  {
    requesterEmail: "grace@womenempowerment.sg",
    requesterName: "Grace Wong",
    orgName: "Women's Empowerment Network",
    orgDescription:
      "Community service initiative by Women's Empowerment Network led by Grace Wong.",
    website: "https://womensempowermentnetwork.org",
    phone: "+65 9456 7890",
    status: "pending",
    createdAt: new Date("2025-02-12"),
  },
  {
    requesterEmail: "marcus@disabilitysupport.org",
    requesterName: "Marcus Johnson",
    orgName: "Disability Support Alliance",
    orgDescription:
      "Community service initiative by Disability Support Alliance led by Marcus Johnson.",
    website: "https://disabilitysupportalliance.org",
    phone: "+65 9567 8901",
    status: "pending",
    createdAt: new Date("2025-02-11"),
  },
  {
    requesterEmail: "catherine@foodsecurity.sg",
    requesterName: "Catherine Liu",
    orgName: "Food Security Coalition",
    orgDescription:
      "Community service initiative by Food Security Coalition led by Catherine Liu.",
    website: "https://foodsecuritycoalition.org",
    phone: "+65 9678 9012",
    status: "pending",
    createdAt: new Date("2025-02-10"),
  },
  {
    requesterEmail: "benjamin@sportsfordev.org",
    requesterName: "Benjamin Ong",
    orgName: "Sports for Development",
    orgDescription:
      "Community service initiative by Sports for Development led by Benjamin Ong.",
    website: "https://sportsfordev.org",
    phone: "+65 9789 0123",
    status: "rejected",
    createdAt: new Date("2025-02-09"),
    decidedAt: new Date("2025-02-10"),
    decidedBy: "admin",
  },
  {
    requesterEmail: "isabella@artsculture.sg",
    requesterName: "Isabella Martinez",
    orgName: "Arts and Culture Society",
    orgDescription:
      "Community service initiative by Arts and Culture Society led by Isabella Martinez.",
    website: "https://artsandculturesociety.org",
    phone: "+65 9890 1234",
    status: "pending",
    createdAt: new Date("2025-02-08"),
  },
  {
    requesterEmail: "oliver@communitygarden.org",
    requesterName: "Oliver Thompson",
    orgName: "Community Garden Project",
    orgDescription:
      "Community service initiative by Community Garden Project led by Oliver Thompson.",
    website: "https://communitygardenproject.org",
    phone: "+65 9901 2345",
    status: "pending",
    createdAt: new Date("2025-02-07"),
  },
  {
    requesterEmail: "zoe@seniorcitizens.sg",
    requesterName: "Zoe Zhang",
    orgName: "Senior Citizens Club",
    orgDescription:
      "Community service initiative by Senior Citizens Club led by Zoe Zhang.",
    website: "https://seniorcitizensclub.org",
    phone: "+65 9012 3456",
    status: "pending",
    createdAt: new Date("2025-02-06"),
  },
  {
    requesterEmail: "nathan@youthmentorship.org",
    requesterName: "Nathan Davis",
    orgName: "Youth Mentorship Program",
    orgDescription:
      "Community service initiative by Youth Mentorship Program led by Nathan Davis.",
    website: "https://youthmentorshipprogram.org",
    phone: "+65 9123 4567",
    status: "pending",
    createdAt: new Date("2025-02-05"),
  },
  {
    requesterEmail: "chloe@healthcareaccess.sg",
    requesterName: "Chloe Anderson",
    orgName: "Healthcare Access Initiative",
    orgDescription:
      "Community service initiative by Healthcare Access Initiative led by Chloe Anderson.",
    website: "https://healthcareaccessinitiative.org",
    phone: "+65 9234 5678",
    status: "pending",
    createdAt: new Date("2025-02-04"),
  },
  {
    requesterEmail: "ethan@digitalinclusion.org",
    requesterName: "Ethan Brown",
    orgName: "Digital Inclusion Project",
    orgDescription:
      "Community service initiative by Digital Inclusion Project led by Ethan Brown.",
    website: "https://digitalinclusionproject.org",
    phone: "+65 9345 6789",
    status: "rejected",
    createdAt: new Date("2025-02-03"),
    decidedAt: new Date("2025-02-04"),
    decidedBy: "admin",
  },
  {
    requesterEmail: "maya@culturalexchange.sg",
    requesterName: "Maya Patel",
    orgName: "Cultural Exchange Society",
    orgDescription:
      "Community service initiative by Cultural Exchange Society led by Maya Patel.",
    website: "https://culturalexchangesociety.org",
    phone: "+65 9456 7890",
    status: "pending",
    createdAt: new Date("2025-02-02"),
  },
]);

console.log("✅ Seeded organisation_requests table successfully");
process.exit(0);
