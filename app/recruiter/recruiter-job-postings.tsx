import RecruiterJobPostingCard from '@/components/RecruiterJobPostingCard';
import { Colors } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";


export default function RecruiterJobPostings() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
    <ScrollView>
      <Text style={styles.title}>My Job Postings</Text>
      
      <Button     // navigate to job creation screen
        mode="contained"
        style={styles.createButton}
        labelStyle={styles.createButtonText}
        onPress={() => router.push('/recruiter/create-job')}  // navigate to job creation screen
      >
        Create New Job Posting
      </Button>

      <RecruiterJobPostingCard
        title="Software Engineer"
        subtitle="Google | California"
        description="$120k | Full-time | Python/Java"
      />

    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', },
  createButton: { backgroundColor: Colors.primary, marginBottom: 24, borderRadius: 8, padding: 4, },
  createButtonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16, },
  card: { backgroundColor: Colors.surface, marginBottom: 16, },
  cardTitle: { color: Colors.text, },
  cardSubtitle: { color: Colors.textMuted, },
  description: { color: Colors.text, },
});
