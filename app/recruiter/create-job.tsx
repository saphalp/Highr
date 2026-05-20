import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateJobScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [pay, setPay] = useState("");

  const handleSubmit = async () => {
    if (pay.trim() && isNaN(Number(pay.trim()))) {
      Alert.alert("Invalid pay", "Estimated pay must be numbers only.");
      return;
    }
    if (!jobName.trim() || !company.trim()) {
      Alert.alert("Missing fields", "Job name and company name are required.");
      return;
    }

    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "You must be logged in to post a job.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("job_postings").insert({
      employer_id: user.id,
      job_name: jobName.trim(),
      description: description.trim(),
      skills: skills,
      location: location.trim(),
      company_name: company.trim(),
      salary: pay.trim() ? Number(pay.trim()) : null,
    });

    setSubmitting(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.push("/recruiter/recruiter-job-postings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Text style={styles.title}>Create Job Posting</Text>

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
          label="Estimated Pay (numbers only)"
          placeholder="e.g. 85000"
          mode="outlined"
          value={pay}
          onChangeText={setPay}
          keyboardType="numeric"
          style={styles.input}
          textColor={Colors.text}
          theme={{
            colors: {
              primary: Colors.primary,
              onSurfaceVariant: Colors.textMuted,
            },
          }}
        />

        <Text style={styles.helperText}>
          Enter the dollar amount only — no $ or commas.
        </Text>

        <TextInput
          label="Relevant Skill(s)"
          mode="outlined"
          value={skillInput}
          onChangeText={setSkillInput}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <Button
          mode="outlined"
          onPress={() => {
            if (!skillInput.trim()) return;

            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
          }}
        >
          Add Skill
        </Button>

        <Text style={styles.currentList}>
          Current Skills: {skills.length > 0 ? skills.join(", ") : "None"}
        </Text>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            style={styles.backButton}
            labelStyle={styles.backButtonText}
            disabled={submitting}
            onPress={() => router.back()}
          >
            Back
          </Button>

          <Button
            mode="contained"
            style={styles.submitButton}
            labelStyle={styles.buttonText}
            loading={submitting}
            disabled={submitting}
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: Colors.inputBackground, marginBottom: 12 },
  button: { backgroundColor: Colors.primary, borderRadius: 8, marginTop: 16, padding: 4 },
  buttonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16 },
  buttonRow : { flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 16 },
  backButton : { flex: 1, borderRadius : 8, backgroundColor: Colors.primary, padding: 4 },
  submitButton : { flex: 1, borderRadius : 8, backgroundColor: Colors.primary, padding: 4 },
  backButtonText : { color: Colors.text, fontWeight: 'bold', fontSize: 16 },
  currentList : { color: Colors.textMuted, marginTop: 10, fontStyle: 'italic' },
  helperText : { color: Colors.textMuted, fontSize: 12, marginTop: -6, marginBottom: 12, fontStyle: 'italic' },
});
