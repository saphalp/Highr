import ApplicantCard, { ApplicantRow } from "@/components/ApplicantCard";

export type ApplicantCardData = ApplicantRow & {
  job_posting_id: string;
  applied_for?: string;
};

import JobPostingCard, { JobPostingRow } from "@/components/JobPostingCard";
import MatchPopup from "@/components/MatchPopup";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get('window');
import Swiper from "react-native-deck-swiper";
import { Text } from "react-native-paper";

const SWIPE_OVERLAYS = {
  pass:  { color: '#FF6B6B',      icon: 'close-circle'  as const, iconColor: '#FF6B6B', iconBg: '#000000',   label: 'PASS' },
  like:  { color: Colors.primary, icon: 'heart-circle'  as const, iconColor: Colors.primary, iconBg: '#ffffff', label: 'LIKE' },
  super: { color: '#00C9FF',      icon: 'star'          as const, iconColor: '#00C9FF', iconBg: 'transparent', label: 'SUPER LIKE' },
} as const;

type UserRole = "applicant" | "employer" | "unknown";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Remote",
];

// ── Demo cards shown when no real data is available ──────────────────────────
const DEMO_JOB_POSTINGS: JobPostingRow[] = [
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

const DEMO_APPLICANTS: ApplicantCardData[] = [
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

const OVERLAY_LABELS = {
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

async function ensureConversationExists(
  applicantId: string,
  employerId: string,
  jobPostingId: string | null,
) {
  console.log("[ensureConversation] start", {
    applicantId,
    employerId,
    jobPostingId,
  });

  let matchQuery = supabase
    .from("matches")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("employer_id", employerId);

  if (jobPostingId) matchQuery = matchQuery.eq("job_posting_id", jobPostingId);
  else matchQuery = matchQuery.is("job_posting_id", null);

  const { data: existingMatch, error: selectError } =
    await matchQuery.maybeSingle();

  if (selectError) {
    console.error("[ensureConversation] match select error:", selectError);
  }

  let match = existingMatch;

  if (!match) {
    const { data: created, error: insertError } = await supabase
      .from("matches")
      .insert({
        applicant_id: applicantId,
        employer_id: employerId,
        job_posting_id: jobPostingId,
        status: "active",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[ensureConversation] match insert error:", insertError);
    }

    match = created;
  }

  console.log("[ensureConversation] match:", match);
  if (!match) return;

  const { data: existing, error: convSelectError } = await supabase
    .from("conversations")
    .select("id")
    .eq("match_id", match.id)
    .maybeSingle();

  if (convSelectError) {
    console.error("[ensureConversation] conv select error:", convSelectError);
  }

  if (!existing) {
    const { error: convInsertError } = await supabase
      .from("conversations")
      .insert({ match_id: match.id });

    if (convInsertError) {
      console.error("[ensureConversation] conv insert error:", convInsertError);
    } else {
      console.log(
        "[ensureConversation] conversation created for match",
        match.id,
      );
    }
  } else {
    console.log("[ensureConversation] conversation already exists:", existing.id);
  }
}

export default function Discover() {
  const [role, setRole] = useState<UserRole>("unknown");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPostingRow[]>([]);
  const [applicants, setApplicants] = useState<ApplicantCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchName, setMatchName] = useState("");
  const [matchDetail, setMatchDetail] = useState("");
  const [allSwiped, setAllSwiped] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minPay, setMinPay] = useState("");

  const jobSwiperRef = useRef<Swiper<JobPostingRow>>(null);
  const applicantSwiperRef = useRef<Swiper<ApplicantCardData>>(null);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayScale   = useRef(new Animated.Value(0.5)).current;
  const [overlayType, setOverlayType] = useState<keyof typeof SWIPE_OVERLAYS | null>(null);
  const buttonSwipePending = useRef(false);

  const flashSwipeOverlay = (type: keyof typeof SWIPE_OVERLAYS) => {
    if (buttonSwipePending.current) { buttonSwipePending.current = false; return; }
    setOverlayType(type);
    overlayOpacity.setValue(0);
    overlayScale.setValue(0.8);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(overlayScale,   { toValue: 1, friction: 6, tension: 200, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]),
      Animated.delay(300),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setOverlayType(null));
  };

  const triggerSwipe = (type: keyof typeof SWIPE_OVERLAYS, doSwipe: () => void) => {
    buttonSwipePending.current = true;
    setOverlayType(type);
    overlayOpacity.setValue(0);
    overlayScale.setValue(0.5);
    Animated.parallel([
      Animated.spring(overlayScale,   { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      doSwipe();
      Animated.timing(overlayOpacity, { toValue: 0, duration: 350, useNativeDriver: true })
        .start(() => setOverlayType(null));
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setAllSwiped(false);
      setJobPostings([]);
      setApplicants([]);
      setRefreshKey((k) => k + 1);

      async function loadData() {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setCurrentUserId(user.id);

        const userRole: UserRole = user.user_metadata?.role ?? "unknown";
        setRole(userRole);

        if (userRole === "applicant") {
          const { data: swipedRows } = await supabase
            .from("swipes")
            .select("job_posting_id")
            .eq("applicant_id", user.id);

          const swipedIds = (swipedRows ?? [])
            .map((r) => r.job_posting_id)
            .filter(Boolean) as string[];

          let query = supabase.from("job_postings").select("*");

          if (swipedIds.length > 0) {
            query = query.not("id", "in", `(${swipedIds.join(",")})`);
          }

          const { data } = await query;

          setJobPostings((data as JobPostingRow[]) ?? []);
        } else if (userRole === "employer") {
          const { data: pendingSwipes, error: swipesError } = await supabase
            .from("swipes")
            .select("applicant_id, job_posting_id")
            .eq("employer_id", user.id)
            .eq("applicant_dir", "right")
            .is("employer_dir", null);

          console.log(
            "[Discover] employer pending swipes:",
            JSON.stringify(pendingSwipes),
            "error:",
            swipesError?.message,
          );

          if (!pendingSwipes?.length) {
            setLoading(false);
            return;
          }

          const applicantIds = [
            ...new Set(pendingSwipes.map((s) => s.applicant_id)),
          ];

          const jobPostingIds = [
            ...new Set(
              pendingSwipes
                .map((s) => s.job_posting_id)
                .filter(Boolean) as string[],
            ),
          ];

          const [{ data: profiles }, { data: jobNames }] = await Promise.all([
            supabase.from("Applicant").select("*").in("id", applicantIds),
            supabase
              .from("job_postings")
              .select("id, job_name")
              .in("id", jobPostingIds),
          ]);

          const cards: ApplicantCardData[] = pendingSwipes.map((swipe) => {
            const profile = (profiles ?? []).find(
              (a) => a.id === swipe.applicant_id,
            );

            const job = (jobNames ?? []).find(
              (j) => j.id === swipe.job_posting_id,
            );

            return {
              id: swipe.applicant_id,
              f_name: profile?.f_name ?? "Applicant",
              l_name: profile?.l_name ?? "",
              address: profile?.address,
              bio: profile?.bio,
              skills: profile?.skills,
              experience: profile?.experience,
              education: profile?.education,
              profile_pic: profile?.profile_pic,
              job_posting_id: swipe.job_posting_id,
              applied_for: job?.job_name,
            } as ApplicantCardData;
          });

          setApplicants(cards);
        }

        setLoading(false);
      }

      loadData();
    }, []),
  );

  const handleJobSwipeRight = async (index: number) => {
    const posting = jobPostings[index];

    if (!currentUserId || !posting) return;

    console.log(
      "[SwipeRight] applicant:",
      currentUserId,
      "→ job:",
      posting.id,
      "employer:",
      posting.employer_id,
    );

    const { error } = await supabase.from("swipes").upsert(
      {
        applicant_id: currentUserId,
        employer_id: posting.employer_id,
        applicant_dir: "right",
        job_posting_id: posting.id,
      },
      { onConflict: "applicant_id,employer_id,job_posting_id" },
    );

    console.log("[SwipeRight] write error:", error?.message ?? "none");

    if (error && error.code !== "23505") {
      console.error("Swipe upsert failed:", error.message);
      return;
    }

    const { data } = await supabase
      .from("swipes")
      .select("employer_dir")
      .eq("applicant_id", currentUserId)
      .eq("employer_id", posting.employer_id)
      .eq("job_posting_id", posting.id)
      .single();

    if (data?.employer_dir === "right") {
      ensureConversationExists(currentUserId, posting.employer_id, posting.id);
      setMatchName(posting.job_name);
      setMatchDetail(posting.company_name);
      setMatchVisible(true);
    }
  };

  const handleJobSwipeLeft = (index: number) => {
    if (!currentUserId) return;

    const posting = jobPostings[index];

    if (!posting) return;

    supabase
      .from("swipes")
      .upsert(
        {
          applicant_id: currentUserId,
          employer_id: posting.employer_id,
          applicant_dir: "left",
          job_posting_id: posting.id,
        },
        { onConflict: "applicant_id,employer_id,job_posting_id" },
      )
      .then(({ error }) => {
        if (error) console.error("Swipe upsert failed:", error.message);
      });
  };

  const handleApplicantSwipeRight = async (index: number) => {
    if (!currentUserId) return;

    const applicant = applicants[index];

    if (!applicant) return;

    const { error } = await supabase.from("swipes").upsert(
      {
        applicant_id: applicant.id,
        employer_id: currentUserId,
        employer_dir: "right",
        job_posting_id: applicant.job_posting_id,
      },
      { onConflict: "applicant_id,employer_id,job_posting_id" },
    );

    if (error && error.code !== "23505") {
      console.error("Swipe upsert failed:", error.message);
      return;
    }

    ensureConversationExists(
      applicant.id,
      currentUserId,
      applicant.job_posting_id,
    );

    const name = `${applicant.f_name ?? ""} ${applicant.l_name ?? ""}`.trim();

    setMatchName(name || "this applicant");
    setMatchDetail(
      applicant.applied_for ?? applicant.experience?.[0]?.title ?? "",
    );
    setMatchVisible(true);
  };

  const handleApplicantSwipeLeft = (index: number) => {
    if (!currentUserId) return;

    const applicant = applicants[index];

    if (!applicant) return;

    supabase
      .from("swipes")
      .upsert(
        {
          applicant_id: applicant.id,
          employer_id: currentUserId,
          employer_dir: "left",
          job_posting_id: applicant.job_posting_id,
        },
        { onConflict: "applicant_id,employer_id,job_posting_id" },
      )
      .then(({ error }) => {
        if (error) console.error("Swipe upsert failed:", error.message);
      });
  };

  const swipeLeft = () => {
    if (role === "applicant") jobSwiperRef.current?.swipeLeft();
    else applicantSwiperRef.current?.swipeLeft();
  };

  const swipeTop = () => {
    if (role === "applicant") jobSwiperRef.current?.swipeTop();
    else applicantSwiperRef.current?.swipeTop();
  };

  const swipeRight = () => {
    if (role === "applicant") jobSwiperRef.current?.swipeRight();
    else applicantSwiperRef.current?.swipeRight();
  };

  const toggleValue = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const resetFilterUI = () => {
    setSearchText("");
    setFilterLocation("");
    setSelectedSkills([]);
    setMinPay("");
    setAllSwiped(false);
    setRefreshKey((k) => k + 1);
  };

  const applyFilterUI = () => {
    setAllSwiped(false);
    setRefreshKey((k) => k + 1);
    setFilterVisible(false);
  };

  const renderFilterChips = (
    options: string[],
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    return (
      <View style={styles.filterChipWrap}>
        {options.map((option) => {
          const selected = selectedValues.includes(option);

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterChip,
                selected && styles.filterChipSelected,
              ]}
              onPress={() =>
                toggleValue(option, selectedValues, setSelectedValues)
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  selected && styles.filterChipTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const getNumberFromSalary = (
    salary: string | number | undefined | null,
  ) => {
    if (!salary) return 0;

    if (typeof salary === "number") return salary;

    const salaryText = salary.toLowerCase();
    const numbers = salaryText.match(/\d+/g);

    if (!numbers) return 0;

    const firstNumber = Number(numbers[0]);

    if (salaryText.includes("k")) {
      return firstNumber * 1000;
    }

    return firstNumber;
  };

  const jobMatchesFilters = (job: JobPostingRow) => {
    const search = searchText.toLowerCase().trim();
    const selectedLocation = filterLocation.toLowerCase().trim();

    const jobName = job.job_name?.toLowerCase() ?? "";
    const companyName = job.company_name?.toLowerCase() ?? "";
    const location = job.location?.toLowerCase() ?? "";
    const description = job.description?.toLowerCase() ?? "";

    const matchesSearch =
      search === "" ||
      jobName.includes(search) ||
      companyName.includes(search) ||
      location.includes(search) ||
      description.includes(search);

    const matchesLocation =
      selectedLocation === "" || location.includes(selectedLocation);

    const jobSkills = Array.isArray(job.skills)
      ? job.skills.map((skill) => String(skill).toLowerCase())
      : [];

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => {
        const selectedSkill = skill.toLowerCase();

        return jobSkills.some(
          (jobSkill) =>
            jobSkill.includes(selectedSkill) ||
            selectedSkill.includes(jobSkill),
        );
      });

    const minPayNumber = Number(minPay);
    const jobPayNumber = getNumberFromSalary(job.salary);

    const matchesPay =
      minPay.trim() === "" ||
      (!Number.isNaN(minPayNumber) && jobPayNumber >= minPayNumber);

    return matchesSearch && matchesLocation && matchesSkills && matchesPay;
  };

  const locationSuggestions =
    filterLocation.trim().length === 0
      ? []
      : US_STATES.filter((state) =>
          state.toLowerCase().startsWith(filterLocation.toLowerCase()),
        ).slice(0, 6);

  const welcomeText =
    role === "applicant"
      ? "Find your next opportunity"
      : role === "employer"
        ? "Discover top talent"
        : "Discover";

  const displayJobs = [...DEMO_JOB_POSTINGS, ...jobPostings];
  const filteredDisplayJobs = displayJobs.filter(jobMatchesFilters);

  const displayApplicants = [...DEMO_APPLICANTS, ...applicants];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Highr</Text>
          <Text style={styles.welcome}>{welcomeText}</Text>
        </View>

        <View style={styles.headerActions}>
          {role === "applicant" && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterVisible(true)}
            >
              <Ionicons name="options-outline" size={19} color={Colors.text} />
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.notifButton}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.swiperContainer}>
        <View style={styles.demoBanner}>
          <Ionicons name="flask-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.demoText}>  First 3 cards are samples</Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : allSwiped ? (
          <View style={styles.centered}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={Colors.primary}
            />
            <Text style={styles.emptyText}>You're all caught up!</Text>
            <Text style={styles.emptySubtext}>Check back later for more</Text>
          </View>
        ) : role === "applicant" ? (
          filteredDisplayJobs.length === 0 ? (
            <View style={styles.centered}>
              <Ionicons
                name="search-outline"
                size={64}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyText}>No jobs match your filters</Text>
              <Text style={styles.emptySubtext}>
                Try resetting or changing your filters
              </Text>
            </View>
          ) : (
            <Swiper
              key={`job-swiper-${refreshKey}`}
              ref={jobSwiperRef}
              cards={filteredDisplayJobs}
              renderCard={(posting) => <JobPostingCard posting={posting} />}
              onSwipedRight={(i) => {
                const swipedJob = filteredDisplayJobs[i];

                if (!swipedJob || String(swipedJob.id).startsWith("demo-job")) {
                  return;
                }

                const realJobIndex = jobPostings.findIndex(
                  (job) => job.id === swipedJob.id,
                );

                if (realJobIndex !== -1) {
                  handleJobSwipeRight(realJobIndex);
                }
              }}
              onSwipedLeft={(i) => {
                const swipedJob = filteredDisplayJobs[i];

                if (!swipedJob || String(swipedJob.id).startsWith("demo-job")) {
                  return;
                }

                const realJobIndex = jobPostings.findIndex(
                  (job) => job.id === swipedJob.id,
                );

                if (realJobIndex !== -1) {
                  handleJobSwipeLeft(realJobIndex);
                }
              }}
              onSwipedAll={() => setAllSwiped(true)}
              backgroundColor="transparent"
              stackSize={3}
              cardIndex={0}
              cardVerticalMargin={0}
              overlayLabels={OVERLAY_LABELS}
            />
          )
        ) : role === "employer" ? (
          <Swiper
            key={`applicant-swiper-${refreshKey}`}
            ref={applicantSwiperRef}
            cards={displayApplicants}
            renderCard={(applicant) => (
              <ApplicantCard
                applicant={applicant}
                appliedFor={applicant.applied_for}
              />
            )}
            onSwipedRight={(i) => {
              if (i >= DEMO_APPLICANTS.length) {
                handleApplicantSwipeRight(i - DEMO_APPLICANTS.length);
              }
            }}
            onSwipedLeft={(i) => {
              if (i >= DEMO_APPLICANTS.length) {
                handleApplicantSwipeLeft(i - DEMO_APPLICANTS.length);
              }
            }}
            onSwipedTop={(i) => {
              flashSwipeOverlay('super');
              if (i >= DEMO_APPLICANTS.length) handleApplicantSwipeRight(i - DEMO_APPLICANTS.length);
            }}
            onSwipedAll={() => setAllSwiped(true)}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            cardVerticalMargin={0}
            cardStyle={{ height: height * 0.62 }}
            overlayLabels={OVERLAY_LABELS}
          />
        ) : (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      </View>

      {overlayType && (
        <Animated.View
          pointerEvents="none"
          style={[styles.swipeOverlay, { opacity: overlayOpacity, transform: [{ scale: overlayScale }] }]}
        >
          <View style={[styles.swipeOverlayBadge, { borderColor: SWIPE_OVERLAYS[overlayType].color }]}>
            <View style={styles.swipeIconWrapper}>
              <View style={[styles.swipeIconBg, { backgroundColor: SWIPE_OVERLAYS[overlayType].iconBg }]} />
              <Ionicons name={SWIPE_OVERLAYS[overlayType].icon} size={56} color={SWIPE_OVERLAYS[overlayType].iconColor} />
            </View>
            <Text style={[styles.swipeOverlayText, { color: SWIPE_OVERLAYS[overlayType].color }]}>
              {SWIPE_OVERLAYS[overlayType].label}
            </Text>
          </View>
        </Animated.View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.passButton} onPress={() => triggerSwipe('pass', swipeLeft)}>
          <Ionicons name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.superLikeButton} onPress={swipeTop}>
          <Ionicons name="star" size={24} color="#00C9FF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeButton} onPress={swipeRight}>
          <Ionicons name="heart" size={32} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.filterOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHandle} />

            <View style={styles.filterHeader}>
              <View>
                <Text style={styles.filterTitle}>Filter Jobs</Text>
                <Text style={styles.filterSubtitle}>
                  Search by keyword, location, skills, or pay
                </Text>
              </View>

              <TouchableOpacity
                style={styles.filterCloseButton}
                onPress={() => setFilterVisible(false)}
              >
                <Ionicons name="close" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Search</Text>
                <TextInput
                  placeholder="Search title, company, or keyword"
                  placeholderTextColor={Colors.textMuted}
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.filterInput}
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>

                <TextInput
                  placeholder="Start typing a state or Remote"
                  placeholderTextColor={Colors.textMuted}
                  value={filterLocation}
                  onChangeText={setFilterLocation}
                  style={styles.filterInput}
                />

                {locationSuggestions.length > 0 && (
                  <View style={styles.locationSuggestionBox}>
                    {locationSuggestions.map((state) => (
                      <TouchableOpacity
                        key={state}
                        style={styles.locationSuggestionItem}
                        onPress={() => setFilterLocation(state)}
                      >
                        <Text style={styles.locationSuggestionText}>
                          {state}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Skills</Text>
                {renderFilterChips(
                  [
                    "React",
                    "React Native",
                    "TypeScript",
                    "JavaScript",
                    "Python",
                    "SQL",
                    "Node.js",
                    "Cybersecurity",
                    "Cloud",
                    "Figma",
                  ],
                  selectedSkills,
                  setSelectedSkills,
                )}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Minimum Pay</Text>
                <TextInput
                  placeholder="Example: 15 or 40000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={minPay}
                  onChangeText={setMinPay}
                  style={styles.filterInput}
                />
              </View>
            </ScrollView>

            <View style={styles.filterFooter}>
              <TouchableOpacity
                style={styles.filterResetButton}
                onPress={resetFilterUI}
              >
                <Text style={styles.filterResetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterApplyButton}
                onPress={applyFilterUI}
              >
                <Text style={styles.filterApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <MatchPopup
        visible={matchVisible}
        name={matchName}
        detail={matchDetail}
        onKeepSwiping={() => setMatchVisible(false)}
        onSendMessage={() => setMatchVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  welcome: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filterButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  filterButtonText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  swiperContainer: {
    height: height * 0.62 + 36,
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  demoText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingBottom: 36,
    paddingTop: 16,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00C9FF",
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  filterSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: "88%",
  },
  filterHandle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.outline,
    alignSelf: "center",
    marginBottom: 18,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  filterTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  filterSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  filterCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  locationSuggestionBox: {
    marginTop: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 14,
    overflow: "hidden",
  },
  locationSuggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  locationSuggestionText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipTextSelected: {
    color: Colors.text,
  },
  filterFooter: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  filterResetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  filterResetText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  filterApplyButton: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  filterApplyText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
});
