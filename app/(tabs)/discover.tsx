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
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { Text } from "react-native-paper";

const { height } = Dimensions.get("window");

type UserRole = "applicant" | "employer" | "unknown";

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

export default function Discover() {
  const [role, setRole] = useState<UserRole>("unknown");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPostingRow[]>([]);
  const [applicants, setApplicants] = useState<ApplicantCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchName, setMatchName] = useState("");
  const [matchDetail, setMatchDetail] = useState("");

  const jobSwiperRef = useRef<Swiper<JobPostingRow>>(null);
  const applicantSwiperRef = useRef<Swiper<ApplicantCardData>>(null);

  useEffect(() => {
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

        console.log("[Discover] employer id:", user.id);
        console.log("[Discover] pending swipes:", pendingSwipes, "error:", swipesError);

        if (!pendingSwipes?.length) {
          setLoading(false);
          return;
        }

        const applicantIds = [...new Set(pendingSwipes.map((s) => s.applicant_id))];
        const jobPostingIds = [
          ...new Set(
            pendingSwipes.map((s) => s.job_posting_id).filter(Boolean) as string[],
          ),
        ];

        const [{ data: profiles }, { data: jobNames }] = await Promise.all([
          supabase.from("Applicant").select("*").in("id", applicantIds),
          supabase
            .from("job_postings")
            .select("id, job_name")
            .in("id", jobPostingIds),
        ]);

        const cards: ApplicantCardData[] = pendingSwipes
          .map((swipe) => {
            const profile = (profiles ?? []).find(
              (a) => a.id === swipe.applicant_id,
            );
            const job = (jobNames ?? []).find(
              (j) => j.id === swipe.job_posting_id,
            );
            if (!profile) return null;
            return {
              ...profile,
              job_posting_id: swipe.job_posting_id,
              applied_for: job?.job_name,
            } as ApplicantCardData;
          })
          .filter(Boolean) as ApplicantCardData[];

        setApplicants(cards);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  const handleJobSwipeRight = async (index: number) => {
    const posting = jobPostings[index];
    if (!currentUserId) return;

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

    if (error) {
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
  const handleApplicantSwipeRight = (index: number) => {
    if (!currentUserId) return;
    const applicant = applicants[index];
    supabase
      .from("swipes")
      .upsert(
        {
          applicant_id: applicant.id,
          employer_id: currentUserId,
          employer_dir: "right",
          job_posting_id: applicant.job_posting_id,
        },
        { onConflict: "applicant_id,employer_id,job_posting_id" },
      )
      .then(({ error }) => {
        if (error) console.error("Swipe upsert failed:", error.message);
      });

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

  const hasCards =
    role === "applicant" ? jobPostings.length > 0 : applicants.length > 0;

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
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : !hasCards ? (
          <View style={styles.centered}>
            <Ionicons
              name="search-outline"
              size={48}
              color={Colors.textMuted}
            />
            <Text style={styles.emptyText}>No profiles to show</Text>
            <Text style={styles.emptySubtext}>Check back later</Text>
          </View>
        ) : role === "applicant" ? (
          <Swiper
            key="job-swiper"
            ref={jobSwiperRef}
            cards={jobPostings}
            renderCard={(posting) => <JobPostingCard posting={posting} />}
            onSwipedRight={handleJobSwipeRight}
            onSwipedLeft={handleJobSwipeLeft}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            cardVerticalMargin={0}
            overlayLabels={OVERLAY_LABELS}
          />
        ) : (
          <Swiper
            key="applicant-swiper"
            ref={applicantSwiperRef}
            cards={applicants}
            renderCard={(applicant) => (
              <ApplicantCard applicant={applicant} appliedFor={applicant.applied_for} />
            )}
            onSwipedRight={handleApplicantSwipeRight}
            onSwipedLeft={handleApplicantSwipeLeft}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            cardVerticalMargin={0}
            overlayLabels={OVERLAY_LABELS}
          />
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
