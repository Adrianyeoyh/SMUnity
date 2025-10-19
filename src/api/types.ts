// #client/api/types.ts
export type AccountType = "student" | "organisation" | "admin";

export type MeRes = {
  userId: string;
  email: string;
  displayName: string | null;
  accountType: AccountType;
  totalHours: number;
  completedProjects: number;
  requiredHours: number;
};

export type ProjectCard = {
  id: number;
  title: string;
  summary: string | null;
  organisation: { id: number; name: string };
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  slotsTotal: number;
  slotsFilled: number;
  status: "draft" | "pending" | "approved" | "closed" | "archived";
  createdAt: string; // ISO
};

export type ProjectDetail = {
  id: number;
  title: string;
  description: string;
  organisation: { id: number; name: string };
  address: {
    location: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  capacity: { slotsTotal: number; slotsFilled: number };
  status: "draft" | "pending" | "approved" | "closed" | "archived";
};

export type ProjectSessionRow = {
  id: number;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  capacity: number | null;
  locationNote: string | null;
};

export type MyAppRow = {
  id: number; // application id
  projectId: number;
  title: string;
  organisation: string;
  status: "pending" | "accepted" | "rejected" | "waitlisted" | "withdrawn" | "cancelled";
  appliedDate: string; // ISO
};

export type FavCard = {
  projectId: number;
  title: string;
  organisation: string;
  savedAt: string; // ISO
};

export type UpcomingRow = {
  id: number;
  title: string;
  date: string; // ISO startsAt
  time: string; // ISO endsAt
  location: string | null;
};
