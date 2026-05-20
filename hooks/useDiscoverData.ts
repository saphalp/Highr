import { ApplicantCardData } from "@/constants/discover";
import { JobPostingRow } from "@/components/JobPostingCard";
import { SummaryData } from "@/components/SummaryModal";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export type UserRole = "applicant" | "employer" | "unknown";

async function ensureConversationExists(
  applicantId: string,
  employerId: string,
  jobPostingId: string | null,
) {
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
      .insert({
        applicant_id: applicantId,
        employer_id: employerId,
        job_posting_id: jobPostingId,
        status: "active",
      })
      .select("id")
      .single();
    if (insertError) console.error("[ensureConversation] match insert error:", insertError);
    match = created;
  }

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
  }
}

export function useDiscoverData() {
  const [role, setRole] = useState<UserRole>("unknown");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPostingRow[]>([]);
  const [applicants, setApplicants] = useState<ApplicantCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [allSwiped, setAllSwiped] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);

  const [matchVisible, setMatchVisible] = useState(false);
  const [matchName, setMatchName] = useState("");
  const [matchDetail, setMatchDetail] = useState("");

  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState<"loading" | "success" | "error">("loading");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [summaryError, setSummaryError] = useState("");

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
          const { data: profile } = await supabase
            .from("Applicant")
            .select("*")
            .eq("id", user.id)
            .single();
          setUserProfile(profile ?? null);

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

          const applicantIds = [...new Set(pendingSwipes.map((s) => s.applicant_id))];
          const jobPostingIds = [
            ...new Set(
              pendingSwipes.map((s) => s.job_posting_id).filter(Boolean) as string[],
            ),
          ];

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
    if (!currentUserId) return;
    const posting = jobPostings[index];
    if (!posting) return;

    const { error } = await supabase.from("swipes").upsert(
      {
        applicant_id: currentUserId,
        employer_id: posting.employer_id,
        applicant_dir: "right",
        job_posting_id: posting.id,
      },
      { onConflict: "applicant_id,employer_id,job_posting_id" },
    );

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

    ensureConversationExists(applicant.id, currentUserId, applicant.job_posting_id);

    const name = `${applicant.f_name ?? ""} ${applicant.l_name ?? ""}`.trim();
    setMatchName(name || "this applicant");
    setMatchDetail(applicant.applied_for ?? applicant.experience?.[0]?.title ?? "");
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

  const handleAiPress = async (cardData: JobPostingRow | ApplicantCardData) => {
    setSummaryVisible(true);
    setSummaryStatus("loading");
    setSummaryData(null);
    setSummaryError("");
    try {
      const res = await fetch(
        "https://n8n.saphalpant.com/webhook/f5060ba2-628d-4438-87ed-b8cd3ea956b2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicantProfile: userProfile, jobListing: cardData }),
        },
      );
      if (!res.ok) {
        setSummaryStatus("error");
        setSummaryError(`Server error (${res.status}). Please try again.`);
        return;
      }
      const json = await res.json().catch(() => null);
      if (json?.success && json?.data) {
        setSummaryData(json.data);
        setSummaryStatus("success");
      } else {
        setSummaryStatus("error");
        setSummaryError(json?.message ?? "Unexpected response from server.");
      }
    } catch {
      setSummaryStatus("error");
      setSummaryError("Network error. Check your connection and try again.");
    }
  };

  const closeSummary = () => {
    setSummaryVisible(false);
    setSummaryStatus("loading");
    setSummaryData(null);
    setSummaryError("");
  };

  return {
    role,
    currentUserId,
    jobPostings,
    applicants,
    loading,
    allSwiped,
    setAllSwiped,
    refreshKey,
    setRefreshKey,
    matchVisible,
    setMatchVisible,
    matchName,
    matchDetail,
    summaryVisible,
    summaryStatus,
    summaryData,
    summaryError,
    closeSummary,
    handleJobSwipeRight,
    handleJobSwipeLeft,
    handleApplicantSwipeRight,
    handleApplicantSwipeLeft,
    handleAiPress,
  };
}
