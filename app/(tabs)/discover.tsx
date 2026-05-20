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
import { useSwipeOverlay } from "@/hooks/useSwipeOverlay";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { Text } from "react-native-paper";

export type { ApplicantCardData };

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

  const onPassPress = () => triggerSwipe("pass", swipeLeft);
  const onSuperLikePress = () => triggerSwipe("super", swipeTop);
  const onLikePress = () => triggerSwipe("like", swipeRight);

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
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
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
