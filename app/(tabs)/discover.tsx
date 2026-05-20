import ApplicantCard from "@/components/ApplicantCard";
import FilterModal from "@/components/FilterModal";
import JobPostingCard, { JobPostingRow } from "@/components/JobPostingCard";
import MatchPopup from "@/components/MatchPopup";
import SummaryModal from "@/components/SummaryModal";
import SwipeActionButtons from "@/components/SwipeActionButtons";
import {
  ApplicantCardData,
  DEMO_APPLICANTS,
  DEMO_JOB_POSTINGS,
  OVERLAY_LABELS,
  SWIPE_OVERLAYS,
} from "@/constants/discover";
import { Colors } from "@/constants/theme";
import { useDiscoverData } from "@/hooks/useDiscoverData";
import { useJobFilters } from "@/hooks/useJobFilters";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import Swiper from "react-native-deck-swiper";
import { Text } from "react-native-paper";

const { height } = Dimensions.get('window');

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

const { height } = Dimensions.get("window");

export default function Discover() {
  const {
    role,
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
  } = useDiscoverData();

  const {
    filterVisible,
    setFilterVisible,
    searchText,
    setSearchText,
    filterLocation,
    setFilterLocation,
    selectedSkills,
    setSelectedSkills,
    minPay,
    setMinPay,
    locationSuggestions,
    jobMatchesFilters,
    reset: resetFilters,
  } = useJobFilters();

  const { overlayOpacity, overlayScale, overlayType, flashSwipeOverlay, triggerSwipe } = useSwipeOverlay();

  const jobSwiperRef = useRef<Swiper<JobPostingRow>>(null);
  const applicantSwiperRef = useRef<Swiper<ApplicantCardData>>(null);

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

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const loadNotificationPreference = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !role) return;

    const tableName = role === "employer" ? "Employer" : "Applicant";

    const { data, error } = await supabase
      .from(tableName)
      .select("notifications")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.log("Error loading notifications:", error);
      return;
    }

    setNotificationsEnabled(data?.notifications ?? true);
  };

  const toggleNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !role) return;

    const tableName = role === "employer" ? "Employer" : "Applicant";
    const newValue = !notificationsEnabled;

    const { error } = await supabase
      .from(tableName)
      .update({ notifications: newValue })
      .eq("id", user.id);

    if (error) {
      Alert.alert("Error", "Could not update notification setting.");
      console.log("Error updating notifications:", error);
      return;
    }

    setNotificationsEnabled(newValue);
  };

  useEffect(() => {
    loadNotificationPreference();
  }, [role]);

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
          <TouchableOpacity style={styles.notifButton} onPress={toggleNotifications}>
            <Ionicons 
              name={notificationsEnabled ? "notifications" : "notifications-off-outline"} 
              size={22} 
              color={Colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.swiperContainer}>
        <View style={styles.demoBanner}>
          <Ionicons name="flask-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.demoText}> First 3 cards are samples</Text>
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
          filteredDisplayJobs.length === 0 ? (
            <View style={styles.centered}>
              <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No jobs match your filters</Text>
              <Text style={styles.emptySubtext}>Try resetting or changing your filters</Text>
            </View>
          ) : (
            <Swiper
              key={`job-swiper-${refreshKey}`}
              ref={jobSwiperRef}
              cards={filteredDisplayJobs}
              renderCard={(posting) => (
                <JobPostingCard posting={posting} onAiPress={() => handleAiPress(posting)} />
              )}
              onSwipedRight={(i) => {
                flashSwipeOverlay("like");
                if (i >= DEMO_JOB_POSTINGS.length)
                  handleJobSwipeRight(i - DEMO_JOB_POSTINGS.length);
              }}
              onSwipedLeft={(i) => {
                flashSwipeOverlay("pass");
                if (i >= DEMO_JOB_POSTINGS.length)
                  handleJobSwipeLeft(i - DEMO_JOB_POSTINGS.length);
              }}
              onSwipedTop={(i) => {
                flashSwipeOverlay("super");
                if (i >= DEMO_JOB_POSTINGS.length)
                  handleJobSwipeRight(i - DEMO_JOB_POSTINGS.length);
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
              <ApplicantCard applicant={applicant} appliedFor={applicant.applied_for} />
            )}
            onSwipedRight={(i) => {
              flashSwipeOverlay("like");
              if (i >= DEMO_APPLICANTS.length)
                handleApplicantSwipeRight(i - DEMO_APPLICANTS.length);
            }}
            onSwipedLeft={(i) => {
              flashSwipeOverlay("pass");
              if (i >= DEMO_APPLICANTS.length)
                handleApplicantSwipeLeft(i - DEMO_APPLICANTS.length);
            }}
            onSwipedTop={(i) => {
              flashSwipeOverlay("super");
              if (i >= DEMO_APPLICANTS.length)
                handleApplicantSwipeRight(i - DEMO_APPLICANTS.length);
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

        {overlayType && (
          <Animated.View
            pointerEvents="none"
            style={[styles.swipeOverlay, { opacity: overlayOpacity, transform: [{ scale: overlayScale }] }]}
          >
            <View style={[styles.swipeOverlayBadge, { borderColor: SWIPE_OVERLAYS[overlayType].color }]}>
              <Ionicons name={SWIPE_OVERLAYS[overlayType].icon} size={64} color={SWIPE_OVERLAYS[overlayType].iconColor} />
              <Text style={[styles.swipeOverlayText, { color: SWIPE_OVERLAYS[overlayType].color }]}>
                {SWIPE_OVERLAYS[overlayType].label}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.buttonsAbsolute} pointerEvents="box-none">
        <SwipeActionButtons
          onPass={onPassPress}
          onSuperLike={onSuperLikePress}
          onLike={onLikePress}
        />
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        searchText={searchText}
        onSearchChange={setSearchText}
        filterLocation={filterLocation}
        onLocationChange={setFilterLocation}
        locationSuggestions={locationSuggestions}
        selectedSkills={selectedSkills}
        onSkillsChange={setSelectedSkills}
        minPay={minPay}
        onMinPayChange={setMinPay}
        onReset={() => {
          resetFilters();
          setAllSwiped(false);
          setRefreshKey((k) => k + 1);
        }}
        onApply={() => {
          setAllSwiped(false);
          setRefreshKey((k) => k + 1);
          setFilterVisible(false);
        }}
      />

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
        data={summaryData}
        errorMessage={summaryError}
        onClose={closeSummary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: Colors.text, fontSize: 26, fontWeight: "bold", letterSpacing: 2 },
  welcome: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
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
  filterButtonText: { color: Colors.text, fontSize: 13, fontWeight: "700" },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  swiperContainer: { height: height * 0.62 + 36, zIndex: 1, overflow: "hidden" },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  demoText: { color: Colors.textMuted, fontSize: 12 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { color: Colors.text, fontSize: 18, fontWeight: "600" },
  emptySubtext: { color: Colors.textMuted, fontSize: 14 },
  buttonsAbsolute: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 50,
  },
  swipeOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  swipeOverlayBadge: {
    borderWidth: 4,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  swipeOverlayText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    letterSpacing: 2,
  },
});