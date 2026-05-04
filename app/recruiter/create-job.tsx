import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateJobScreen() {
  const router = useRouter();

  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [pay, setPay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!jobName.trim() || !company.trim() || !location.trim()) {
      setError("Job name, company, and location are required.");
      return;
    }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const { error: insertError } = await supabase.from('job_postings').insert({
      employer_id: user.id,
      job_name: jobName.trim(),
      description: description.trim(),
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      location: location.trim(),
      company_name: company.trim(),
      salary: pay.trim(),
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Job Posting</Text>
        <View style={{ width: 34 }} />
      </View>
      <ScrollView>
        {!!error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          label="Job Name"
          mode="outlined"
          value={jobName}
          onChangeText={setJobName}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />


        <TextInput
          label="Job Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Relevant Skills (comma separated)"
          mode="outlined"
          value={skills}
          onChangeText={setSkills}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Location"
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Company Name"
          mode="outlined"
          value={company}
          onChangeText={setCompany}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Estimated Pay"
          mode="outlined"
          value={pay}
          onChangeText={setPay}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />


        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Submit Job Posting
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backButton: { padding: 4 },
  title: { color: Colors.text, fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  input: { backgroundColor: Colors.inputBackground, marginBottom: 12 },
  button: { backgroundColor: Colors.primary, borderRadius: 8, marginTop: 16, padding: 4 },
  buttonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16 },
  error: { color: Colors.error ?? '#FF6B6B', marginBottom: 12, textAlign: 'center' },
});
