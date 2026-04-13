export type EducationEntry = {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  current: boolean;
};

export type ExperienceEntry = {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type SkillEntry = {
  name: string;
  level: SkillLevel;
};

export type ApplicantProfile = {
  profileImageUri: string;
  fName: string;
  lName: string;
  phone: string;
  address: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillEntry[];
  bio: string;
  linkedin: string;
  portfolio: string;
  github: string;
};

export const EMPTY_PROFILE: ApplicantProfile = {
  profileImageUri: "",
  fName: "",
  lName: "",
  phone: "",
  address: "",
  education: [],
  experience: [],
  skills: [],
  bio: "",
  linkedin: "",
  portfolio: "",
  github: "",
};
