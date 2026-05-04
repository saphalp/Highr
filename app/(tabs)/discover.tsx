import MatchPopup from '@/components/MatchPopup';
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Swiper from 'react-native-deck-swiper';
import { Text } from "react-native-paper";

const { height } = Dimensions.get('window');

type UserInfo = {
  email: string;
  role: string;
  id: string;
};

type Applicant = {
  id: string;
  f_name: string;
  l_name: string;
  bio: string;
  address: string;
  skills: any[];
  experience: any[];
};

type Job = {
  id: string;
  employer_id: string;
  job_name: string;
  company_name: string;
  location: string;
  salary?: string;
  skills?: string[];
  description?: string;
};

export default function Discover() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchName, setMatchName] = useState('');
  const [matchPartnerId, setMatchPartnerId] = useState('');
  const [matchedJob, setMatchedJob] = useState<Job | null>(null);
  const [matchedApplicant, setMatchedApplicant] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const role = user.user_metadata?.role ?? "unknown";
        setUserInfo({ email: user.email ?? "", role, id: user.id });
        setDebugMsg(`logged in as: ${user.email} | role: ${role}`);

        if (role === 'employer') {
          fetchApplicants();
        } else {
          fetchJobs();
        }
      } else {
        setDebugMsg('NOT logged in');
      }
    });
  }, []);

  const fetchApplicants = async () => {
    const { data, error } = await supabase
      .from('Applicant')
      .select('id, f_name, l_name, bio, address, skills, experience');
    setDebugMsg(`applicants: ${data?.length ?? 0} | error: ${error?.message ?? 'none'}`);
    if (data) setApplicants(data);
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from('job_postings')
      .select('id, employer_id, job_name, company_name, location, salary, skills, description')
      .order('created_at', { ascending: false });
    setDebugMsg(`jobs: ${data?.length ?? 0} | error: ${error?.message ?? 'none'}`);
    if (data) setJobs(data);
    setLoadingJobs(false);
  };

  const handleSwipeRight = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isApplicant = user.user_metadata?.role !== 'employer';

    if (isApplicant) {
      const job = jobs[index];
      if (!job) return;
      setMatchedJob(job);
      setDebugMsg(`applicant(${user.id}) swiped job(${job.id}) employer(${job.employer_id})`);

      // Check if employer already swiped right on this applicant
      const { data: existingSwipe, error: checkErr } = await supabase
        .from('swipes')
        .select('*')
        .eq('employer_id', job.employer_id)
        .eq('applicant_id', user.id)
        .maybeSingle();

      setDebugMsg(`swipe row=${JSON.stringify(existingSwipe)} err=${checkErr?.message ?? 'none'}`);

      if (existingSwipe && existingSwipe.employer_dir === 'right') {
        await supabase
          .from('swipes')
          .update({ applicant_dir: 'right', job_posting_id: job.id })
          .eq('id', existingSwipe.id);

        const { error: matchErr } = await supabase
          .from('matches')
          .insert({ applicant_id: user.id, employer_id: job.employer_id, job_posting_id: job.id, status: 'matched' });

        setDebugMsg(`MATCH! err=${matchErr?.message ?? 'none'}`);
        setMatchName(`${job.job_name} at ${job.company_name}`);
        setMatchPartnerId(job.employer_id);
        setMatchVisible(true);
      } else {
        // Update existing row if one exists (employer swiped left earlier), else insert
        const { data: updated } = await supabase
          .from('swipes')
          .update({ applicant_dir: 'right', job_posting_id: job.id })
          .eq('applicant_id', user.id)
          .eq('employer_id', job.employer_id)
          .select();

        if (!updated || updated.length === 0) {
          const { error: insertErr } = await supabase
            .from('swipes')
            .insert({ applicant_id: user.id, applicant_dir: 'right', job_posting_id: job.id, employer_id: job.employer_id });
          setDebugMsg(`applicant swipe saved err=${insertErr?.message ?? 'none'}`);
        } else {
          setDebugMsg('applicant swipe updated existing row');
        }
      }
    } else {
      const applicant = applicants[index];
      if (!applicant) return;
      setMatchedApplicant(applicant);
      setDebugMsg(`employer(${user.id}) swiped applicant(${applicant.id})`);

      // Check if applicant already swiped right on any of this employer's jobs
      const { data: existingSwipe, error: checkErr } = await supabase
        .from('swipes')
        .select('*')
        .eq('employer_id', user.id)
        .eq('applicant_id', applicant.id)
        .maybeSingle();

      setDebugMsg(`swipe row=${JSON.stringify(existingSwipe)} err=${checkErr?.message ?? 'none'}`);

      if (existingSwipe && existingSwipe.applicant_dir === 'right') {
        for (const swipe of [existingSwipe]) {
          await supabase.from('swipes').update({ employer_dir: 'right' }).eq('id', swipe.id);

          const { error: matchErr } = await supabase
            .from('matches')
            .insert({ applicant_id: applicant.id, employer_id: user.id, job_posting_id: swipe.job_posting_id, status: 'matched' });

          setDebugMsg(`MATCH! err=${matchErr?.message ?? 'none'}`);
        }
        setMatchName(`${applicant.f_name} ${applicant.l_name}`);
        setMatchPartnerId(applicant.id);
        setMatchVisible(true);
      } else {
        // Update existing row if one exists, else insert
        const { data: updated } = await supabase
          .from('swipes')
          .update({ employer_dir: 'right' })
          .eq('applicant_id', applicant.id)
          .eq('employer_id', user.id)
          .select();

        if (!updated || updated.length === 0) {
          const { error: insertErr } = await supabase
            .from('swipes')
            .insert({ employer_id: user.id, employer_dir: 'right', applicant_id: applicant.id });
          setDebugMsg(`employer swipe saved err=${insertErr?.message ?? 'none'}`);
        } else {
          setDebugMsg('employer swipe updated existing row');
        }
      }
    }
  };

  const handleSwipeLeft = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isApplicant = user.user_metadata?.role !== 'employer';

    if (isApplicant) {
      const job = jobs[index];
      if (!job) return;
      await supabase
        .from('swipes')
        .insert({
          applicant_id: user.id,
          applicant_dir: 'left',
          job_posting_id: job.id,
          employer_id: job.employer_id,
        });
    } else {
      const applicant = applicants[index];
      if (!applicant) return;
      await supabase
        .from('swipes')
        .insert({
          employer_id: user.id,
          employer_dir: 'left',
          applicant_id: applicant.id,
        });
    }
  };

  const handleSendMessage = () => {
    setMatchVisible(false);
    router.push({
      pathname: '/chat',
      params: {
        id: matchPartnerId,
        name: matchName,
        profilePicture: '',
        lastMessage: "You matched! Say hello 👋",
      },
    });
  };

  const isEmployer = userInfo?.role === 'employer';

  return (
    <View style={styles.container}>
      {!!debugMsg && (
        <Text style={{ color: 'yellow', backgroundColor: '#333', padding: 6, fontSize: 11, textAlign: 'center' }}>
          {debugMsg}
        </Text>
      )}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Highr</Text>
          <Text style={styles.welcome}>
            {isEmployer ? 'Find your next hire 🎯' : 'Find your next opportunity 🚀'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        {isEmployer ? (
          applicants.length > 0 ? (
            <Swiper
              ref={swiperRef}
              cards={applicants}
              renderCard={(applicant) => (
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.companyBadge}>
                      <Text style={styles.companyBadgeText}>
                        {applicant.f_name?.[0] ?? '?'}
                      </Text>
                    </View>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>Job Seeker</Text>
                    </View>
                  </View>
                  <View style={styles.cardBottom}>
                    <Text style={styles.jobTitle}>
                      {applicant.f_name} {applicant.l_name}
                    </Text>
                    {applicant.address && (
                      <Text style={styles.infoText}>📍 {applicant.address}</Text>
                    )}
                    {applicant.bio && (
                      <Text style={styles.description}>{applicant.bio}</Text>
                    )}
                    {applicant.skills?.length > 0 && (
                      <View style={styles.tagsRow}>
                        {applicant.skills.slice(0, 4).map((skill: any, i: number) => (
                          <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>
                              {typeof skill === 'string' ? skill : skill.skill ?? ''}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              )}
              onSwipedRight={handleSwipeRight}
              onSwipedLeft={handleSwipeLeft}
              backgroundColor="transparent"
              stackSize={Math.min(3, applicants.length)}
              cardIndex={0}
              cardVerticalMargin={0}
              keyExtractor={(applicant) => applicant.id}
              overlayLabels={{
                left: {
                  title: 'PASS',
                  style: {
                    label: { backgroundColor: '#FF6B6B', color: 'white', fontSize: 24, borderRadius: 8, padding: 8 },
                    wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginLeft: -20 },
                  },
                },
                right: {
                  title: 'HIRE',
                  style: {
                    label: { backgroundColor: Colors.primary, color: 'white', fontSize: 24, borderRadius: 8, padding: 8 },
                    wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20, marginLeft: 20 },
                  },
                },
              }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No applicants yet!</Text>
            </View>
          )
        ) : loadingJobs ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading jobs...</Text>
          </View>
        ) : jobs.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={jobs}
            renderCard={(job) => (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.companyBadge}>
                    <Text style={styles.companyBadgeText}>
                      {job.company_name?.[0] ?? '?'}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.jobTitle}>{job.job_name}</Text>
                  <Text style={styles.companyName}>{job.company_name}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoText}>📍 {job.location}</Text>
                    {job.salary && (
                      <Text style={styles.infoText}>💰 {job.salary}</Text>
                    )}
                  </View>
                  {job.description && (
                    <Text style={styles.description}>{job.description}</Text>
                  )}
                  {job.skills && job.skills.length > 0 && (
                    <View style={styles.tagsRow}>
                      {job.skills.map((skill, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
            onSwipedRight={handleSwipeRight}
            onSwipedLeft={handleSwipeLeft}
            backgroundColor="transparent"
            stackSize={Math.min(3, jobs.length)}
            cardIndex={0}
            cardVerticalMargin={0}
            keyExtractor={(job) => String(job.id)}
            overlayLabels={{
              left: {
                title: 'PASS',
                style: {
                  label: { backgroundColor: '#FF6B6B', color: 'white', fontSize: 24, borderRadius: 8, padding: 8 },
                  wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginLeft: -20 },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: { backgroundColor: Colors.primary, color: 'white', fontSize: 24, borderRadius: 8, padding: 8 },
                  wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20, marginLeft: 20 },
                },
              },
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No jobs available!</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.passButton} onPress={() => swiperRef.current?.swipeLeft()}>
          <Ionicons name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.superLikeButton} onPress={() => swiperRef.current?.swipeTop()}>
          <Ionicons name="star" size={24} color="#00C9FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={() => swiperRef.current?.swipeRight()}>
          <Ionicons name="heart" size={32} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <MatchPopup
        visible={matchVisible}
        matchName={matchName}
        onKeepSwiping={() => setMatchVisible(false)}
        onSendMessage={handleSendMessage}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  card: {
    height: height * 0.62,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTop: {
    flex: 1,
    backgroundColor: Colors.outline,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  companyBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyBadgeText: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  typeBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeBadgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  cardBottom: {
    padding: 20,
    backgroundColor: Colors.surface,
  },
  jobTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.outline,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 11,
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
