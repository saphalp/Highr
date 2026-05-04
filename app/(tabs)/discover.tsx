import ApplicantCard, { ApplicantRow } from '@/components/ApplicantCard';
import EmployerCard, { EmployerRow } from '@/components/EmployerCard';
import MatchPopup from '@/components/MatchPopup';
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Swiper from 'react-native-deck-swiper';
import { Text } from "react-native-paper";

const { height } = Dimensions.get('window');

type UserRole = 'applicant' | 'employer' | 'unknown';

const OVERLAY_LABELS = {
  left: {
    title: 'PASS',
    style: {
      label: {
        backgroundColor: '#FF6B6B',
        color: 'white',
        fontSize: 24,
        borderRadius: 8,
        padding: 8,
      },
      wrapper: {
        flexDirection: 'column' as const,
        alignItems: 'flex-end' as const,
        justifyContent: 'flex-start' as const,
        marginTop: 20,
        marginLeft: -20,
      },
    },
  },
  right: {
    title: 'LIKE',
    style: {
      label: {
        backgroundColor: Colors.primary,
        color: 'white',
        fontSize: 24,
        borderRadius: 8,
        padding: 8,
      },
      wrapper: {
        flexDirection: 'column' as const,
        alignItems: 'flex-start' as const,
        justifyContent: 'flex-start' as const,
        marginTop: 20,
        marginLeft: 20,
      },
    },
  },
};

export default function Discover() {
  const [role, setRole] = useState<UserRole>('unknown');
  const [employers, setEmployers] = useState<EmployerRow[]>([]);
  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchName, setMatchName] = useState('');
  const [matchDetail, setMatchDetail] = useState('');

  const employerSwiperRef = useRef<Swiper<EmployerRow>>(null);
  const applicantSwiperRef = useRef<Swiper<ApplicantRow>>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const userRole: UserRole = user.user_metadata?.role ?? 'unknown';
      setRole(userRole);

      if (userRole === 'applicant') {
        const { data } = await supabase.from('Employer').select('*').neq('id', user.id);
        setEmployers((data as EmployerRow[]) ?? []);
      } else if (userRole === 'employer') {
        const { data } = await supabase.from('Applicant').select('*').neq('id', user.id);
        setApplicants((data as ApplicantRow[]) ?? []);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  const handleEmployerSwipeRight = (index: number) => {
    const employer = employers[index];
    setMatchName(employer.company_name);
    setMatchDetail(employer.industry ?? '');
    setMatchVisible(true);
  };

  const handleApplicantSwipeRight = (index: number) => {
    const applicant = applicants[index];
    const name = `${applicant.f_name ?? ''} ${applicant.l_name ?? ''}`.trim();
    setMatchName(name || 'this applicant');
    setMatchDetail(applicant.experience?.[0]?.title ?? '');
    setMatchVisible(true);
  };

  const swipeLeft = () => {
    if (role === 'applicant') employerSwiperRef.current?.swipeLeft();
    else applicantSwiperRef.current?.swipeLeft();
  };

  const swipeTop = () => {
    if (role === 'applicant') employerSwiperRef.current?.swipeTop();
    else applicantSwiperRef.current?.swipeTop();
  };

  const swipeRight = () => {
    if (role === 'applicant') employerSwiperRef.current?.swipeRight();
    else applicantSwiperRef.current?.swipeRight();
  };

  const welcomeText =
    role === 'applicant' ? 'Find your next opportunity 🚀' :
    role === 'employer' ? 'Discover top talent ✨' :
    'Discover ✨';

  const hasCards = role === 'applicant' ? employers.length > 0 : applicants.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Highr</Text>
          <Text style={styles.welcome}>{welcomeText}</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : !hasCards ? (
          <View style={styles.centered}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No profiles to show</Text>
            <Text style={styles.emptySubtext}>Check back later</Text>
          </View>
        ) : role === 'applicant' ? (
          <Swiper
            key="employer-swiper"
            ref={employerSwiperRef}
            cards={employers}
            renderCard={(employer) => <EmployerCard employer={employer} />}
            onSwipedRight={handleEmployerSwipeRight}
            onSwipedLeft={() => {}}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            infinite
            cardVerticalMargin={0}
            overlayLabels={OVERLAY_LABELS}
          />
        ) : (
          <Swiper
            key="applicant-swiper"
            ref={applicantSwiperRef}
            cards={applicants}
            renderCard={(applicant) => <ApplicantCard applicant={applicant} />}
            onSwipedRight={handleApplicantSwipeRight}
            onSwipedLeft={() => {}}
            backgroundColor="transparent"
            stackSize={3}
            cardIndex={0}
            infinite
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: 'bold',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingBottom: 36,
    paddingTop: 16,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00C9FF',
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
