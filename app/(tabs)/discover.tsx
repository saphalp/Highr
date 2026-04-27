import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Swiper from 'react-native-deck-swiper';
import { Text } from "react-native-paper";

const { height } = Dimensions.get('window');

type UserInfo = {
  email: string;
  role: string;
};

const JOBS = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    skills: ['React Native', 'TypeScript', 'Node.js'],
    description: 'Join our team to build next-gen products used by billions.',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$120k - $160k',
    type: 'Full-time',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    description: 'Design beautiful experiences for Apple products.',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$140k - $180k',
    type: 'Remote',
    skills: ['Python', 'Machine Learning', 'SQL'],
    description: 'Use data to drive decisions and build AI-powered products.',
  },
  {
    id: 4,
    title: 'Backend Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$160k - $220k',
    type: 'Hybrid',
    skills: ['Java', 'AWS', 'Microservices'],
    description: 'Build infrastructure that powers streaming for millions.',
  },
];

export default function Discover() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const swiperRef = useRef<Swiper<typeof JOBS[0]>>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserInfo({
          email: user.email ?? "",
          role: user.user_metadata?.role ?? "unknown",
        });
      }
    });
  }, []);

  const handleSwipeLeft = () => {
    swiperRef.current?.swipeLeft();
  };

  const handleSwipeRight = () => {
    swiperRef.current?.swipeRight();
  };

  const handleSuperLike = () => {
    swiperRef.current?.swipeTop();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Highr</Text>
          <Text style={styles.welcome}>
            {userInfo ? `Find your next opportunity 🚀` : 'Discover jobs for you ✨'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={JOBS}
          renderCard={(job) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.companyBadge}>
                  <Text style={styles.companyBadgeText}>{job.company[0]}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{job.type}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>📍 {job.location}</Text>
                  <Text style={styles.infoText}>💰 {job.salary}</Text>
                </View>
                <Text style={styles.description}>{job.description}</Text>
                <View style={styles.tagsRow}>
                  {job.skills.map((skill, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          onSwipedRight={(index) => console.log('Liked:', JOBS[index].title)}
          onSwipedLeft={(index) => console.log('Passed:', JOBS[index].title)}
          backgroundColor="transparent"
          stackSize={3}
          cardIndex={0}
          infinite
          cardVerticalMargin={0}
          overlayLabels={{
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
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
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
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.passButton} onPress={handleSwipeLeft}>
          <Ionicons name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.superLikeButton} onPress={handleSuperLike}>
          <Ionicons name="star" size={24} color="#00C9FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleSwipeRight}>
          <Ionicons name="heart" size={32} color={Colors.text} />
        </TouchableOpacity>
      </View>
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