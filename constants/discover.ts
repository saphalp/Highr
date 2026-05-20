import { ApplicantRow } from "@/components/ApplicantCard";
import { JobPostingRow } from "@/components/JobPostingCard";
import { Colors } from "@/constants/theme";

export type ApplicantCardData = ApplicantRow & {
  job_posting_id: string;
  applied_for?: string;
};

export const SWIPE_OVERLAYS = {
  pass: {
    color: "#FF6B6B",
    icon: "close-circle" as const,
    iconColor: "#FF6B6B",
    iconBg: "#000000",
    label: "PASS",
  },
  like: {
    color: Colors.primary,
    icon: "heart-circle" as const,
    iconColor: Colors.primary,
    iconBg: "#ffffff",
    label: "LIKE",
  },
  super: {
    color: "#00C9FF",
    icon: "star" as const,
    iconColor: "#00C9FF",
    iconBg: "transparent",
    label: "SUPER LIKE",
  },
} as const;

export const OVERLAY_LABELS = {
  left: {
    title: "PASS",
    style: {
      label: {
        backgroundColor: "#FF6B6B",
        color: "white",
        fontSize: 24,
        borderRadius: 8,
        padding: 8,
      },
      wrapper: {
        flexDirection: "column" as const,
        alignItems: "flex-end" as const,
        justifyContent: "flex-start" as const,
        marginTop: 20,
        marginLeft: -20,
      },
    },
  },
  right: {
    title: "LIKE",
    style: {
      label: {
        backgroundColor: Colors.primary,
        color: "white",
        fontSize: 24,
        borderRadius: 8,
        padding: 8,
      },
      wrapper: {
        flexDirection: "column" as const,
        alignItems: "flex-start" as const,
        justifyContent: "flex-start" as const,
        marginTop: 20,
        marginLeft: 20,
      },
    },
  },
  top: {
    title: "SUPER LIKE",
    style: {
      label: {
        backgroundColor: "#00C9FF",
        color: "white",
        fontSize: 24,
        borderRadius: 8,
        padding: 8,
      },
      wrapper: {
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "flex-start" as const,
        marginTop: 20,
      },
    },
  },
};

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming", "Remote",
];

export const DEMO_JOB_POSTINGS: JobPostingRow[] = [
  {
    id: "demo-job-1",
    employer_id: "demo-employer-1",
    job_name: "Frontend Engineer",
    company_name: "Stripe",
    location: "San Francisco, CA",
    salary: "$140k – $180k",
    skills: ["React Native", "TypeScript", "GraphQL"],
    description:
      "Join our payments UI team building the interfaces that millions of developers depend on every day.",
  },
  {
    id: "demo-job-2",
    employer_id: "demo-employer-2",
    job_name: "Product Designer",
    company_name: "Figma",
    location: "Remote",
    salary: "$120k – $160k",
    skills: ["Figma", "Prototyping", "User Research"],
    description:
      "Shape the future of collaborative design tools used by over 4 million teams worldwide.",
  },
  {
    id: "demo-job-3",
    employer_id: "demo-employer-3",
    job_name: "Backend Engineer",
    company_name: "Notion",
    location: "New York, NY",
    salary: "$130k – $170k",
    skills: ["Node.js", "PostgreSQL", "Redis"],
    description:
      "Help us scale the infrastructure powering the all-in-one workspace for notes, docs, and projects.",
  },
];

export const DEMO_APPLICANTS: ApplicantCardData[] = [
  {
    id: "demo-app-1",
    f_name: "Alex",
    l_name: "Rivera",
    address: "Austin, TX",
    bio: "Full-stack developer with 4 years of experience building scalable web apps and mobile products.",
    skills: [
      { name: "React", level: "Expert" },
      { name: "Node.js", level: "Advanced" },
      { name: "Python", level: "Intermediate" },
    ],
    experience: [
      {
        company: "Shopify",
        title: "Software Engineer",
        location: "Remote",
        startDate: "2021-06",
        endDate: "",
        current: true,
        description: "",
      },
    ],
    education: [
      {
        institution: "UT Austin",
        degree: "B.S.",
        field: "Computer Science",
        startYear: "2017",
        endYear: "2021",
        current: false,
      },
    ],
    job_posting_id: "demo-job-1",
    applied_for: "Frontend Engineer",
  },
  {
    id: "demo-app-2",
    f_name: "Jamie",
    l_name: "Chen",
    address: "Seattle, WA",
    bio: "UX-focused mobile engineer who loves turning complex problems into delightful user experiences.",
    skills: [
      { name: "Swift", level: "Expert" },
      { name: "Kotlin", level: "Advanced" },
      { name: "Figma", level: "Intermediate" },
    ],
    experience: [
      {
        company: "Amazon",
        title: "Mobile Engineer",
        location: "Seattle",
        startDate: "2020-03",
        endDate: "",
        current: true,
        description: "",
      },
    ],
    education: [
      {
        institution: "University of Washington",
        degree: "B.S.",
        field: "Informatics",
        startYear: "2016",
        endYear: "2020",
        current: false,
      },
    ],
    job_posting_id: "demo-job-2",
    applied_for: "Product Designer",
  },
  {
    id: "demo-app-3",
    f_name: "Morgan",
    l_name: "Patel",
    address: "Chicago, IL",
    bio: "Data engineer passionate about pipelines, analytics, and making data accessible to everyone.",
    skills: [
      { name: "Python", level: "Expert" },
      { name: "SQL", level: "Expert" },
      { name: "Spark", level: "Advanced" },
    ],
    experience: [
      {
        company: "Grubhub",
        title: "Data Engineer",
        location: "Chicago",
        startDate: "2019-07",
        endDate: "",
        current: true,
        description: "",
      },
    ],
    education: [
      {
        institution: "Northwestern",
        degree: "M.S.",
        field: "Data Science",
        startYear: "2017",
        endYear: "2019",
        current: false,
      },
    ],
    job_posting_id: "demo-job-3",
    applied_for: "Backend Engineer",
  },
];
