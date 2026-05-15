import ApplicantCard, { ApplicantRow } from "@/components/ApplicantCard";

export type ApplicantCardData = ApplicantRow & {
  job_posting_id: string;
  applied_for?: string;
};
import JobPostingCard, { JobPostingRow } from "@/components/JobPostingCard";
import MatchPopup from "@/components/MatchPopup";
import SummaryModal from "@/components/SummaryModal";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { Text } from "react-native-paper";

type UserRole = "applicant" | "employer" | "unknown";

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
      { company: "Shopify", title: "Software Engineer", location: "Remote", startDate: "2021-06", endDate: "", current: true, description: "" },
    ],
    education: [
      { institution: "UT Austin", degree: "B.S.", field: "Computer Science", startYear: "2017", endYear: "2021", current: false },
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
      { company: "Amazon", title: "Mobile Engineer", location: "Seattle", startDate: "2020-03", endDate: "", current: true, description: "" },
    ],
    education: [
      { institution: "University of Washington", degree: "B.S.", field: "Informatics", startYear: "2016", endYear: "2020", current: false },
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
      { company: "Grubhub", title: "Data Engineer", location: "Chicago", startDate: "2019-07", endDate: "", current: true, description: "" },
    ],
    education: [
      { institution: "Northwestern", degree: "M.S.", field: "Data Science", startYear: "2017", endYear: "2019", current: false },
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
};

async function ensureConversationExists(
  applicantId: string,
  employerId: string,
  jobPostingId: string | null,
) {
  console.log("[ensureConversation] start", { applicantId, employerId, jobPostingId });

  let matchQuery = supabase
    .from("matches")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("employer_id", employerId);
  if (jobPostingId) matchQuery = matchQuery.eq("job_posting_id", jobPostingId);
  else matchQuery = matchQuery.is("job_posting_id", null);

  const { data: existingMatch, error: selectError } = await matchQuery.maybeSingle();
  if (selectError) console.error("[ensureConversation] match select error:", selectError);

  let match = existingMatch;

  if (!match) {
    const { data: created, error: insertError } = await supabase
      .from("matches")
      .insert({ applicant_id: applicantId, employer_id: employerId, job_posting_id: jobPostingId, status: "active" })
      .select("id")
      .single();
    if (insertError) console.error("[ensureConversation] match insert error:", insertError);
    match = created;
  }

  console.log("[ensureConversation] match:", match);
  if (!match) return;

  const { data: existing, error: convSelectError } = await supabase
    .from("conversations")
    .select("id")
    .eq("match_id", match.id)
    .maybeSingle();
  if (convSelectError) console.error("[ensureConversation] conv select error:", convSelectError);

  if (!existing) {
    const { error: convInsertError } = await supabase
      .from("conversations")
      .insert({ match_id: match.id });
    if (convInsertError) console.error("[ensureConversation] conv insert error:", convInsertError);
    else console.log("[ensureConversation] conversation created for match", match.id);
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
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState<"loading" | "success" | "error">("loading");
  const [summaryMessage, setSummaryMessage] = useState("");
  const [allSwiped, setAllSwiped] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);

  const jobSwiperRef = useRef<Swiper<JobPostingRow>>(null);
  const applicantSwiperRef = useRef<Swiper<ApplicantCardData>>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setAllSwiped(false);
      setJobPostings([]);
      setApplicants([]);
      setRefreshKey((k) => k + 1);

      async function loadData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        setCurrentUserId(user.id);
        const userRole: UserRole = user.user_metadata?.role ?? "unknown";
        setRole(userRole);

        if (userRole === "applicant") {
          const { data: profile } = await supabase
            .from("Applicant")
            .select("*")
            .eq("id", user.id)
            .single();
          setUserProfile(profile ?? null);

          // fetch jobs this applicant hasn't swiped on yet
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
          // fetch applicants who swiped right on employer's jobs but employer hasn't responded
          const { data: pendingSwipes, error: swipesError } = await supabase
            .from("swipes")
            .select("applicant_id, job_posting_id")
            .eq("employer_id", user.id)
            .eq("applicant_dir", "right")
            .is("employer_dir", null);

          console.log("[Discover] employer pending swipes:", JSON.stringify(pendingSwipes), "error:", swipesError?.message);

          if (!pendingSwipes?.length) { setLoading(false); return; }

          const applicantIds = [...new Set(pendingSwipes.map((s) => s.applicant_id))];
          const jobPostingIds = [...new Set(pendingSwipes.map((s) => s.job_posting_id).filter(Boolean) as string[])];

          const [{ data: profiles }, { data: jobNames }] = await Promise.all([
            supabase.from("Applicant").select("*").in("id", applicantIds),
            supabase.from("job_postings").select("id, job_name").in("id", jobPostingIds),
          ]);

          const cards: ApplicantCardData[] = pendingSwipes.map((swipe) => {
            const profile = (profiles ?? []).find((a) => a.id === swipe.applicant_id);
            const job = (jobNames ?? []).find((j) => j.id === swipe.job_posting_id);
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
    if (!currentUserId) return;

    console.log("[SwipeRight] applicant:", currentUserId, "→ job:", posting.id, "employer:", posting.employer_id);

    const { error } = await supabase
      .from("swipes")
      .upsert(
        {
          applicant_id: currentUserId,
          employer_id: posting.employer_id,
          applicant_dir: "right",
          job_posting_id: posting.id,
        },
        { onConflict: "applicant_id,employer_id,job_posting_id" },
      );

    console.log("[SwipeRight] write error:", error?.message ?? "none");

    // 23505 = unique_violation: swipe already exists, which is fine — proceed
    if (error && error.code !== "23505") {
      console.error("Swipe upsert failed:", error.message);
      return;
    }

    // Only show match popup if employer already swiped right on this applicant
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

  // Employers only see applicants who already swiped right, so a right swipe is always a match
  const handleApplicantSwipeRight = async (index: number) => {
    if (!currentUserId) return;
    const applicant = applicants[index];

    const { error } = await supabase
      .from("swipes")
      .upsert(
        {
          applicant_id: applicant.id,
          employer_id: currentUserId,
          employer_dir: "right",
          job_posting_id: applicant.job_posting_id,
        },
        { onConflict: "applicant_id,employer_id,job_posting_id" },
      );

    // 23505 = unique_violation: swipe already exists, which is fine — proceed
    if (error && error.code !== "23505") {
      console.error("Swipe upsert failed:", error.message);
      return;
    }

    ensureConversationExists(applicant.id, currentUserId, applicant.job_posting_id);

    const name = `${applicant.f_name ?? ""} ${applicant.l_name ?? ""}`.trim();
    setMatchName(name || "this applicant");
    setMatchDetail(applicant.applied_for ?? applicant.experience?.[0]?.title ?? "");
    setMatchVisible(true);
  };

  const handleApplicantSwipeLeft = (index: number) => {
    if (!currentUserId) return;
    const applicant = applicants[index];
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

  const handleAiPress = async (cardData: JobPostingRow | ApplicantCardData) => {
    setSummaryVisible(true);
    setSummaryStatus("loading");
    setSummaryMessage("");
    try {
      const res = await fetch(
        "https://n8n.saphalpant.com/webhook-test/f5060ba2-628d-4438-87ed-b8cd3ea956b2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicantProfile: userProfile,
            jobListing: cardData,
          }),
        },
      );
      if (!res.ok) {
        setSummaryStatus("error");
        setSummaryMessage(`Server error (${res.status}). Please try again.`);
        return;
      }
      const data = await res.json().catch(() => null);
      setSummaryStatus("success");
      setSummaryMessage(data?.message ?? JSON.stringify(data) ?? "Done.");
    } catch (err) {
      setSummaryStatus("error");
      setSummaryMessage("Network error. Check your connection and try again.");
    }
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

  const welcomeText =
    role === "applicant"
      ? "Find your next opportunity"
      : role === "employer"
        ? "Discover top talent"
        : "Discover";

  const displayJobs = [...DEMO_JOB_POSTINGS, ...jobPostings];
  const displayApplicants = [...DEMO_APPLICANTS, ...applicants];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Highr</Text>
          <Text style={styles.welcome}>{welcomeText}</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={Colors.text}
          />
        </TouchableOpacity>
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
            <Ionicons name="checkmark-circle-outline" size={64} color={Colors.primary} />
            <Text style={styles.emptyText}>You're all caught up!</Text>
            <Text style={styles.emptySubtext}>Check back later for more</Text>
          </View>
        ) : role === "applicant" ? (
          <Swiper
            key={`job-swiper-${refreshKey}`}
            ref={jobSwiperRef}
            cards={displayJobs}
            renderCard={(posting) => (
              <JobPostingCard posting={posting} onAiPress={() => handleAiPress(posting)} />
            )}
            onSwipedRight={(i) => {
              if (i >= DEMO_JOB_POSTINGS.length) handleJobSwipeRight(i - DEMO_JOB_POSTINGS.length);
            }}
            onSwipedLeft={(i) => {
              if (i >= DEMO_JOB_POSTINGS.length) handleJobSwipeLeft(i - DEMO_JOB_POSTINGS.length);
            }}
            onSwipedAll={() => setAllSwiped(true)}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            cardVerticalMargin={0}
            overlayLabels={OVERLAY_LABELS}
          />
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
              if (i >= DEMO_APPLICANTS.length) handleApplicantSwipeRight(i - DEMO_APPLICANTS.length);
            }}
            onSwipedLeft={(i) => {
              if (i >= DEMO_APPLICANTS.length) handleApplicantSwipeLeft(i - DEMO_APPLICANTS.length);
            }}
            onSwipedAll={() => setAllSwiped(true)}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            cardVerticalMargin={0}
            overlayLabels={OVERLAY_LABELS}
          />
        ) : (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.passButton} onPress={swipeLeft}>
          <Ionicons name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.superLikeButton} onPress={swipeTop}>
          <Ionicons name="star" size={24} color="#00C9FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={swipeRight}>
          <Ionicons name="heart" size={32} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <MatchPopup
        visible={matchVisible}
        name={matchName}
        detail={matchDetail}
        onKeepSwiping={() => setMatchVisible(false)}
        onSendMessage={() => setMatchVisible(false)}
      />

      <SummaryModal
        visible={summaryVisible}
        status={summaryStatus}
        message={summaryMessage}
        onClose={() => {
          setSummaryVisible(false);
          setSummaryStatus("loading");
          setSummaryMessage("");
        }}
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
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  swiperContainer: {
    flex: 1,
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
});
