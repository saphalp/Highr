export type WorkType = "Remote" | "Hybrid" | "On-site";

export type CompanySize =
  | "1–10"
  | "11–50"
  | "51–200"
  | "201–1,000"
  | "1,000+";

export type EmployerProfile = {
  // Basic Info
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  companyName: string;
  // Company Details
  industry: string;
  companySize: CompanySize;
  foundedYear: string;
  website: string;
  about: string;
  // Location & Work Style
  city: string;
  country: string;
  workTypes: WorkType[];
  // Additional Info
  linkedin: string;
  twitter: string;
  culture: string;
};

export const EMPTY_EMPLOYER_PROFILE: EmployerProfile = {
  contactName: "",
  contactTitle: "",
  contactPhone: "",
  companyName: "",
  industry: "",
  companySize: "11–50",
  foundedYear: "",
  website: "",
  about: "",
  city: "",
  country: "",
  workTypes: [],
  linkedin: "",
  twitter: "",
  culture: "",
};
