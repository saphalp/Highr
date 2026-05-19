import ApplicantCard from '@/components/ApplicantCard';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreviewCard() {
  const router = useRouter();

  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicant = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'You must be logged in to preview your card.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('Applicant')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error(error);
      Alert.alert('Error', 'Could not load your applicant profile.');
      setLoading(false);
      return;
    }

    setApplicant(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplicant();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.title}>Preview Card</Text>

      {loading ? (
        <ActivityIndicator animating={true} color={Colors.primary} />
      ) : applicant ? (
        <View style={styles.cardWrapper}>
          <ApplicantCard applicant={applicant} />
        </View>
      ) : (
        <Text style={styles.emptyText}>No applicant profile found.</Text>
      )}

      <Button
        mode="contained"
        style={styles.backButton}
        onPress={() => router.back()}
      >
        Back
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, },
  cardWrapper: { flex: 1, justifyContent: 'center', },
  emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, },
  backButton: { borderRadius: 8, marginTop: 16, },
});