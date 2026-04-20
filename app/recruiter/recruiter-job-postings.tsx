import RecruiterJobPostingCard from '@/components/RecruiterJobPostingCard';
import { Colors } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";


export default function RecruiterJobPostings() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(true);
  const lastScrollY = useRef(0);

  return (
    <SafeAreaView style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
    <ScrollView
      contentContainerStyle={styles.contentContainerStyle}
      onScroll={(event) => {
        const currentY = event.nativeEvent.contentOffset.y;

        if (currentY > lastScrollY.current + 5) {
          setShowButton(false);
        } else if (currentY < lastScrollY.current - 5) {
          setShowButton(true);
        }

        lastScrollY.current = currentY;
      }}
      scrollEventThrottle={16}
    >
      <Text style={styles.title}>My Job Postings</Text>

      
    

      <RecruiterJobPostingCard
        title="Software Engineer"
        subtitle="Google | California"
        description="$120k | Full-time | Python/Java"
      />

      <RecruiterJobPostingCard
        title="Data Analyst Intern"
        subtitle="Meta | Wisconsin"
        description="$25/hr | Internship | Python/SQL"
      />

      <RecruiterJobPostingCard
        title="Product Manager"
        subtitle="Amazon | Seattle"
        description="$150k | Full-time | Project Management"
      />
  
      <RecruiterJobPostingCard
        title="UX Designer"
        subtitle="Airbnb | Remote"
        description="$100k | Full-time | Figma/Sketch"
      />

      <RecruiterJobPostingCard
        title="Junior Software Engineer"
        subtitle="Stripe | Remote"
        description="$80k | Full-time | JavaScript/React"
      />

      <RecruiterJobPostingCard
        title="Product Manager"
        subtitle="Amazon | Seattle"
        description="$150k | Full-time | Project Management"
      />

      <RecruiterJobPostingCard
        title="Consultant"
        subtitle="IBMC | New York"
        description="$90k | Full-time | Business Strategy"
      />

      <RecruiterJobPostingCard
        title="Network Production Engineer"
        subtitle="Cloudflare | Texas"
        description="$110k | Full-time | Networking/Linux"
      />

      <RecruiterJobPostingCard
        title="Data Scientist"
        subtitle="Netflix | California"
        description="$130k | Full-time | Python/R"
      />

    </ScrollView>

      {showButton && (
        <Button
          mode="contained"
          style={styles.createButton}
          labelStyle={styles.createButtonText}
          onPress={() => router.push('/recruiter/create-job')}
        >
          Create New Job Posting
        </Button>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, },
  contentContainerStyle: { paddingBottom: 120 },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', },
  createButton: { position: "absolute", bottom: 60, left: 16, right: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 6, },
  createButtonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16, },
  card: { backgroundColor: Colors.surface, marginBottom: 16, },
  cardTitle: { color: Colors.text, },
  cardSubtitle: { color: Colors.textMuted, },
  description: { color: Colors.text, },
});
