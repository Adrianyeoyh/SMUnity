// #client/api/types.ts
export type AccountType = "student" | "organisation" | "admin";

export type MeRes = {
  id: string;
  email: string;
  name: string;
  accountType: AccountType;
  image: string | null;
  profile: {
    phone: string | null;
    studentId: string | null;
    entryYear: number | null;
    school: string | null;
    skills: string[];
    interests: string[];
    csuCompletedAt: string | null;
  } | null;
  dashboard: {
    applications: number;
    verifiedHours: number;
  };
};

export type UpdateProfilePayload = {
  phone?: string | null;
  school?: string | null;
  studentId?: string | null;
  skills?: string[];
  interests?: string[];
};

export type ProfileFormData = {
  studentId?: string | null;
  phone: string;
  faculty: string;
  skills: string[];
  interests: string[];
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
export interface CompletedCspRow {
  id: string;
  title: string;
  organisation: string;
  completedDate: string;
  serviceHours: number;
  rating?: number;
}

export interface OrganisationProfileData {
  id: number;
  name: string;

  email: string;
  phone: string;
  website: string | null;
  description: string;
  slug: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type OrganisationFormData = Pick<
  OrganisationProfileData,
  "name" | "phone" | "website" | "description"
>;
