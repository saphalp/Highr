import RecruiterJobPostingCard from '@/components/RecruiterJobPostingCard';
import { Colors } from '@/constants/theme';
<<<<<<< HEAD
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
=======
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
>>>>>>> 4a6996d... feat: fix swipe logic, refresh on focus, styled cards and tab bar
import { SafeAreaView } from "react-native-safe-area-context";

type JobPosting = {
  id: number;
  employer_id: string;
  job_name: string;
  location: string;
  company_name: string;
  description: string;
  skills: string[] | null;
  salary: number | null;
};

export default function RecruiterJobPostings() {
  const router = useRouter();

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBackButton, setShowBackButton] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY) {
      setShowBackButton(false);
    } else {
      setShowBackButton(true);
    }

    setLastScrollY(currentScrollY);
  };

  const fetchJobPostings = async () => {
    setLoading(true);

  const { 
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  setJobPostings(data || []);
  setLoading(false);

};

  useEffect(() => {
    fetchJobPostings();
  },[]);

  return (
    <SafeAreaView style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
<<<<<<< HEAD
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Text style={styles.title}>My Job Postings</Text>
=======
    <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Job Postings</Text>
        <View style={{ width: 34 }} />
      </View>
>>>>>>> 4a6996d... feat: fix swipe logic, refresh on focus, styled cards and tab bar
      
      <Button
        mode="contained"
        style={styles.createButton}
        labelStyle={styles.createButtonText}
        onPress={() => router.push('/recruiter/create-job')}
      >
        Create New Job Posting
      </Button>


      {loading ? (
        <ActivityIndicator
          animating={true}
          color={Colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : jobPostings.length === 0 ? (
        <Text style={styles.emptyText}>
          No job postings yet. Let&apos;s get posting!
        </Text>
      ) : (
        jobPostings.map((job) => (
          <Pressable
            key={job.id}
            onPress={() => router.push(`/recruiter/create-job`)}
          >
            <RecruiterJobPostingCard
              title={job.job_name}
              subtitle={`${job.company_name} | ${job.location}`}
              description={`$${job.salary ?? 'N/A'} | ${(job.skills || []).join(', ')}`}
            />
          </Pressable>
        ))
      )}

    </ScrollView>
    {showBackButton && (
      <View style={styles.floatingBackButtonContainer}>
        <Button
          mode="contained"
          style={styles.backButton}
          labelStyle={styles.backButtonText}
          onPress={() => router.push('/(tabs)/profile')}
        >
          Back
        </Button>
      </View>
    )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, },
  backButton: { padding: 4, },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', },
  createButton: { backgroundColor: Colors.primary, marginBottom: 24, borderRadius: 8, padding: 4, },
  createButtonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16, },
  card: { backgroundColor: Colors.surface, marginBottom: 16, },
  cardTitle: { color: Colors.text, },
  cardSubtitle: { color: Colors.textMuted, },
  description: { color: Colors.text, },
  floatingBackButtonContainer: { position: 'absolute', bottom: 32, left: 16, right: 16, alignItems: 'center', },
  backButton: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8, },
  backButtonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16, },
  emptyText : { color: Colors.textMuted, fontSize: 16, textAlign: 'center', marginTop: 40, },
});
