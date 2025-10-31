export type FormInput = {
  title: string;
  summary: string;
  category: string;
  project_type: "local" | "overseas";

  description: string;
  about_provide: string;
  about_do: string;
  requirements: string;
  skill_tags: string[];

  district: string;
  google_maps: string;
  remote: boolean;

  repeat_interval: number;
  repeat_unit: "day" | "week" | "month" | "year";
  days_of_week: string[];
  time_start: string;
  time_end: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  application_deadline?: Date;

  commitable_hours: number;
  slots: number;

  image_url: string;
  project_tags: [];
};


export const CATEGORY_OPTIONS = [
   "Community",
    "Mentoring",
    "Environment",
    "Elderly",
    "Arts & Culture",
    "Animal Welfare",
    "Sports & Leisure",
    "Coding"
];

export const DISTRICTS = [
  "Admiralty","Aljunied","Amber","Alexandra","Ang Mo Kio","Balestier","Bedok",
  "Bishan","Boon Lay","Bukit Batok","Bukit Merah","Bukit Timah","Buona Vista","Bugis",
  "Clementi","Choa Chu Kang","City Hall","Eunos","Farrer Park","Geylang","Harbourfront",
  "Holland","Hougang","Jurong East","Jurong West","Katong","Kovan","MacPherson","Mandai",
  "Marine Parade","Novena","Orchard","Pasir Ris","Pasir Panjang","Punggol","Queenstown",
  "Sembawang","Sengkang","Serangoon","Siglap","Tampines","Tiong Bahru","Toa Payoh",
  "Woodlands","Yishun",
];

export const DISTRICT_REGION_MAP: Record<string, string> = {
  // North
  "Woodlands": "North",
  "Sembawang": "North",
  "Yishun": "North",
  "Mandai": "North",
  "Admiralty": "North",

  // North-East
  "Ang Mo Kio": "North-East",
  "Hougang": "North-East",
  "Sengkang": "North-East",
  "Serangoon": "North-East",
  "Punggol": "North-East",
  "Kovan": "North-East",

  // East
  "Bedok": "East",
  "Tampines": "East",
  "Pasir Ris": "East",
  "Siglap": "East",
  "Eunos": "East",
  "Marine Parade": "East",

  // West
  "Jurong East": "West",
  "Jurong West": "West",
  "Clementi": "West",
  "Boon Lay": "West",
  "Bukit Batok": "West",
  "Choa Chu Kang": "West",

  // Central
  "Orchard": "Central",
  "Novena": "Central",
  "Toa Payoh": "Central",
  "City Hall": "Central",
  "Bugis": "Central",
  "Queenstown": "Central",
  "Bukit Timah": "Central",
  "Balestier": "Central",
  "Holland": "Central",
  "Alexandra": "Central",
  "Tiong Bahru": "Central",
  "MacPherson": "Central",
  "Farrer Park": "Central",
  "Katong": "Central",
  "Amber": "Central",
  "Harbourfront": "Central",
  "Pasir Panjang": "Central",
};


export const SKILL_CHOICES = [
  "Communication", "Patience", "Teaching", "Empathy", "Creativity", "Program Design",
];

export const TAG_CHOICES = [
  "Children", "Kids", "Less Privileged", "Art", "School", "Education",
];